package com.rafael.pr_gym_backend.repository;

import com.rafael.pr_gym_backend.model.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MuscleGroupRepository extends JpaRepository<MuscleGroup, Long> {
}