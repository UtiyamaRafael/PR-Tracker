package com.rafael.pr_gym_backend.service;

import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PRCalculatorService {

    private final RecordRepository recordRepository;

    public PRCalculatorService(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    /**
     * Fórmula de Epley: 1RM = peso x (1 + reps/30)
     * Retorna null quando weight é nulo (exercício de peso corporal).
     */
    public Double calcularEstimated1RM(Double weight, Integer reps) {
        if (weight == null) {
            return null;
        }
        return weight * (1 + reps / 30.0);
    }

    /**
     * Verifica se o registro sendo salvo é um novo PR do exercício.
     * - Se weight for nulo: PR = maior número de repetições já registrado.
     * - Se weight for preenchido: PR = maior 1RM estimado já registrado.
     */
    public boolean verificarNovoPR(Exercise exercise, Double weight, Integer reps, Double estimated1RM) {
        if (weight == null) {
            Optional<Record> recordeAtual = recordRepository
                    .findTopByExerciseAndWeightIsNullOrderByRepsDesc(exercise);
            return recordeAtual.isEmpty() || reps > recordeAtual.get().getReps();
        } else {
            Optional<Record> recordeAtual = recordRepository
                    .findTopByExerciseAndWeightIsNotNullOrderByEstimated1RMDesc(exercise);
            return recordeAtual.isEmpty() || estimated1RM > recordeAtual.get().getEstimated1RM();
        }
    }
}