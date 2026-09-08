package com.rafael.pr_gym_backend.service;

import com.rafael.pr_gym_backend.dto.PrSummaryResponse;
import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.repository.ExerciseRepository;
import com.rafael.pr_gym_backend.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ExerciseRepository exerciseRepository;
    private final RecordRepository recordRepository;

    public DashboardService(ExerciseRepository exerciseRepository, RecordRepository recordRepository) {
        this.exerciseRepository = exerciseRepository;
        this.recordRepository = recordRepository;
    }

    // RF11 — um card por exercício, com o PR vigente (ou vazio, se ainda não tem registro)
    public List<PrSummaryResponse> listarResumoPRs() {
        List<Exercise> exercicios = exerciseRepository.findAll();

        return exercicios.stream()
                .map(exercise -> recordRepository.findByExerciseAndIsPrTrue(exercise)
                        .map(record -> new PrSummaryResponse(
                                exercise.getId(), exercise.getName(), exercise.getMuscleGroup().getName(),
                                record.getWeight(), record.getReps(), record.getEstimated1RM(), record.getDate()
                        ))
                        .orElse(new PrSummaryResponse(
                                exercise.getId(), exercise.getName(), exercise.getMuscleGroup().getName(),
                                null, null, null, null
                        )))
                .collect(Collectors.toList());
    }
}