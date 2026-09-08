package com.rafael.pr_gym_backend.dto;

public class ExerciseRequest {

    private String name;
    private Long muscleGroupId;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getMuscleGroupId() { return muscleGroupId; }
    public void setMuscleGroupId(Long muscleGroupId) { this.muscleGroupId = muscleGroupId; }
}