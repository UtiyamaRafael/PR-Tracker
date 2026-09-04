package com.rafael.pr_gym_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    // Nulo para exercícios com peso corporal (ex: barra fixa sem anilha extra)
    private Double weight;

    @Column(nullable = false)
    private Integer reps;

    // Calculado via fórmula de Epley; nulo quando weight é nulo
    @Column(name = "estimated_1rm")
    private Double estimated1RM;

    @Column(name = "is_pr", nullable = false)
    private Boolean isPr = false;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }

    public Record() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }

    public Double getEstimated1RM() { return estimated1RM; }
    public void setEstimated1RM(Double estimated1RM) { this.estimated1RM = estimated1RM; }

    public Boolean getIsPr() { return isPr; }
    public void setIsPr(Boolean isPr) { this.isPr = isPr; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}