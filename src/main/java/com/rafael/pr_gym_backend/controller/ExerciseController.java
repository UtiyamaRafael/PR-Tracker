package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.ExerciseRequest;
import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public List<Exercise> listar() {
        return exerciseService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Exercise> cadastrar(@Valid @RequestBody ExerciseRequest request) {
        Exercise criado = exerciseService.cadastrar(request.getName(), request.getMuscleGroupId());
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public Exercise editar(@PathVariable Long id, @Valid @RequestBody ExerciseRequest request) {
        return exerciseService.editar(id, request.getName(), request.getMuscleGroupId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        exerciseService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
