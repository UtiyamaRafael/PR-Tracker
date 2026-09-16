package com.rafael.pr_gym_backend.repository;

import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findByUserAndExerciseOrderByDateDesc(User user, Exercise exercise);

    Optional<Record> findTopByUserAndExerciseAndWeightIsNotNullOrderByEstimated1RMDesc(User user, Exercise exercise);

    Optional<Record> findTopByUserAndExerciseAndWeightIsNullOrderByRepsDesc(User user, Exercise exercise);

    Optional<Record> findByUserAndExerciseAndIsPrTrue(User user, Exercise exercise);

    List<Record> findByUserAndExerciseId(User user, Long exerciseId);

    // Sem filtro de usuário de propósito: Exercise é compartilhado entre todos,
    // então bloqueia exclusão se QUALQUER usuário tiver histórico nele (RF04)
    boolean existsByExercise(Exercise exercise);
}