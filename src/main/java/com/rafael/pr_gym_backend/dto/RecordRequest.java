package com.rafael.pr_gym_backend.dto;

import java.time.LocalDate;

public class RecordRequest {

    private Long exerciseId;
    private Double weight;
    private Integer reps;
    private LocalDate date;

    public Long getExerciseId() { return exerciseId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}