package com.rafael.pr_gym_backend.dto;

import com.rafael.pr_gym_backend.model.Record;

import java.time.LocalDate;

/**
 * DTO de saida para Record. Existe para nunca serializar a entidade
 * Record diretamente: ela carrega uma referencia para User, e serializar
 * User expunha o hash bcrypt da senha no JSON de resposta (ver analise
 * tecnica - item critico "Hash da senha vazando na API").
 *
 * O campo "exercise" fica aninhado (em vez de exerciseId/exerciseName soltos)
 * de proposito: o frontend existente (historico.js, registro.js) ja consome
 * registro.exercise.name / registro.exercise.id, entao manter esse formato
 * evita ter que reescrever todas as telas.
 */
public class RecordResponse {

    private Long id;
    private ExerciseRef exercise;
    private Double weight;
    private Integer reps;
    private Double estimated1RM;
    private Boolean isPr;
    private LocalDate date;

    public RecordResponse(Record record) {
        this.id = record.getId();
        this.exercise = new ExerciseRef(record.getExercise().getId(), record.getExercise().getName());
        this.weight = record.getWeight();
        this.reps = record.getReps();
        this.estimated1RM = record.getEstimated1RM();
        this.isPr = record.getIsPr();
        this.date = record.getDate();
    }

    public Long getId() { return id; }
    public ExerciseRef getExercise() { return exercise; }
    public Double getWeight() { return weight; }
    public Integer getReps() { return reps; }
    public Double getEstimated1RM() { return estimated1RM; }
    public Boolean getIsPr() { return isPr; }
    public LocalDate getDate() { return date; }

    public static class ExerciseRef {
        private final Long id;
        private final String name;

        public ExerciseRef(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
    }
}
