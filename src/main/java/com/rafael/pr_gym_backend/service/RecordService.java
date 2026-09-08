package com.rafael.pr_gym_backend.service;

import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.repository.ExerciseRepository;
import com.rafael.pr_gym_backend.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final ExerciseRepository exerciseRepository;
    private final PRCalculatorService prCalculatorService;

    public RecordService(RecordRepository recordRepository,
                         ExerciseRepository exerciseRepository,
                         PRCalculatorService prCalculatorService) {
        this.recordRepository = recordRepository;
        this.exerciseRepository = exerciseRepository;
        this.prCalculatorService = prCalculatorService;
    }

    public Record registrar(Long exerciseId, Double weight, Integer reps, LocalDate date) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercício não encontrado."));

        Double estimated1RM = prCalculatorService.calcularEstimated1RM(weight, reps);
        boolean isPr = prCalculatorService.verificarNovoPR(exercise, weight, reps, estimated1RM);

        if (isPr) {
            removerPRAnterior(exercise, weight == null);
        }

        Record record = new Record();
        record.setExercise(exercise);
        record.setWeight(weight);
        record.setReps(reps);
        record.setEstimated1RM(estimated1RM);
        record.setIsPr(isPr);
        if (date != null) {
            record.setDate(date);
        }

        return recordRepository.save(record);
    }

    // Tira a flag de PR do registro que era recorde antes deste novo
    private void removerPRAnterior(Exercise exercise, boolean pesoCorporal) {
        var anterior = pesoCorporal
                ? recordRepository.findTopByExerciseAndWeightIsNullOrderByRepsDesc(exercise)
                : recordRepository.findTopByExerciseAndWeightIsNotNullOrderByEstimated1RMDesc(exercise);

        anterior.ifPresent(r -> {
            r.setIsPr(false);
            recordRepository.save(r);
        });
    }

    // RF10 — histórico por exercício
    public List<Record> listarHistorico(Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercício não encontrado."));

        return recordRepository.findByExerciseOrderByDateDesc(exercise);
    }

    // RF09 — editar registro, recalculando o PR do exercício
    public Record editar(Long recordId, Double weight, Integer reps, LocalDate date) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Registro não encontrado."));

        record.setWeight(weight);
        record.setReps(reps);
        record.setEstimated1RM(prCalculatorService.calcularEstimated1RM(weight, reps));
        if (date != null) {
            record.setDate(date);
        }

        Record salvo = recordRepository.save(record);
        recalcularPR(record.getExercise());
        return salvo;
    }

    // RF09 — excluir registro, recalculando o PR do exercício
    public void excluir(Long recordId) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Registro não encontrado."));

        Exercise exercise = record.getExercise();
        recordRepository.delete(record);
        recalcularPR(exercise);
    }

    // Reavalia qual registro é o PR vigente do exercício (usado após editar/excluir)
    private void recalcularPR(Exercise exercise) {
        List<Record> registros = recordRepository.findByExerciseOrderByDateDesc(exercise);

        registros.forEach(r -> r.setIsPr(false));

        registros.stream()
                .filter(r -> r.getWeight() != null)
                .max(Comparator.comparing(Record::getEstimated1RM))
                .ifPresent(r -> r.setIsPr(true));

        registros.stream()
                .filter(r -> r.getWeight() == null)
                .max(Comparator.comparing(Record::getReps))
                .ifPresent(r -> r.setIsPr(true));

        recordRepository.saveAll(registros);
    }
}