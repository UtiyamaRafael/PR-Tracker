package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.RecordRequest;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.service.RecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @PostMapping
    public ResponseEntity<Record> registrar(@RequestBody RecordRequest request) {
        Record criado = recordService.registrar(
                request.getExerciseId(),
                request.getWeight(),
                request.getReps(),
                request.getDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/exercise/{exerciseId}")
    public List<Record> historico(@PathVariable Long exerciseId) {
        return recordService.listarHistorico(exerciseId);
    }

    @PutMapping("/{id}")
    public Record editar(@PathVariable Long id, @RequestBody RecordRequest request) {
        return recordService.editar(id, request.getWeight(), request.getReps(), request.getDate());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        recordService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}