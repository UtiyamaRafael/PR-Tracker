package com.rafael.pr_gym_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ExerciseRequest {

    @NotBlank(message = "O nome do exercício é obrigatório")
    private String name;

    @NotNull(message = "O grupo muscular é obrigatório")
    private Long muscleGroupId;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getMuscleGroupId() { return muscleGroupId; }
    public void setMuscleGroupId(Long muscleGroupId) { this.muscleGroupId = muscleGroupId; }
}
