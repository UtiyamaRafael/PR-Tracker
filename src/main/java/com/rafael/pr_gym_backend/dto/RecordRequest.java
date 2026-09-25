package com.rafael.pr_gym_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class RecordRequest {

    @NotNull(message = "O exercício é obrigatório")
    private Long exerciseId;

    // Nulo é permitido (exercício de peso corporal)
    @PositiveOrZero(message = "O peso não pode ser negativo")
    private Double weight;

    @NotNull(message = "As repetições são obrigatórias")
    @Min(value = 1, message = "As repetições devem ser pelo menos 1")
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
