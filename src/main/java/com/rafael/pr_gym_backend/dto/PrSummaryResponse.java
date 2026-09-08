package com.rafael.pr_gym_backend.dto;

import java.time.LocalDate;

public class PrSummaryResponse {

    private Long exerciseId;
    private String exerciseName;
    private String muscleGroupName;
    private Double weight;
    private Integer reps;
    private Double estimated1RM;
    private LocalDate date;

    public PrSummaryResponse(Long exerciseId, String exerciseName, String muscleGroupName,
                             Double weight, Integer reps, Double estimated1RM, LocalDate date) {
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.muscleGroupName = muscleGroupName;
        this.weight = weight;
        this.reps = reps;
        this.estimated1RM = estimated1RM;
        this.date = date;
    }

    public Long getExerciseId() { return exerciseId; }
    public String getExerciseName() { return exerciseName; }
    public String getMuscleGroupName() { return muscleGroupName; }
    public Double getWeight() { return weight; }
    public Integer getReps() { return reps; }
    public Double getEstimated1RM() { return estimated1RM; }
    public LocalDate getDate() { return date; }
}