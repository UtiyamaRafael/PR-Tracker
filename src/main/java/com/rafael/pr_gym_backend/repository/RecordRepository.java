package com.rafael.pr_gym_backend.repository;

import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<Record, Long> {

    // Histórico de um exercício, mais recente primeiro (RF10)
    List<Record> findByExerciseOrderByDateDesc(Exercise exercise);

    // Usado pelo PRCalculatorService pra achar o recorde atual (RF07)
    Optional<Record> findTopByExerciseAndWeightIsNotNullOrderByEstimated1RMDesc(Exercise exercise);

    // PR de exercícios com peso corporal (weight nulo) — recorde por repetições (RF07)
    Optional<Record> findTopByExerciseAndWeightIsNullOrderByRepsDesc(Exercise exercise);

    // Usado ao excluir um exercício (RF04 — bloqueia exclusão se houver histórico)
    boolean existsByExercise(Exercise exercise);

    List<Record> findByUserAndExerciseId(User user, Long exerciseId);
}