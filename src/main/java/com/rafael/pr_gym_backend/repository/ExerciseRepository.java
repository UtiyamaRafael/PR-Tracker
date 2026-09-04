package com.rafael.pr_gym_backend.repository;

import com.rafael.pr_gym_backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    // Usado na validação de nome único (RF01)
    boolean existsByNameIgnoreCase(String name);

    Optional<Exercise> findByNameIgnoreCase(String name);
}