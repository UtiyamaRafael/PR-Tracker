package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.model.MuscleGroup;
import com.rafael.pr_gym_backend.repository.MuscleGroupRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/muscle-groups")
public class MuscleGroupController {

    private final MuscleGroupRepository muscleGroupRepository;

    public MuscleGroupController(MuscleGroupRepository muscleGroupRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
    }

    @GetMapping
    public List<MuscleGroup> listar() {
        return muscleGroupRepository.findAll();
    }
}