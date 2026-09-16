package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.RecordRequest;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.model.User;
import com.rafael.pr_gym_backend.service.RecordService;
import com.rafael.pr_gym_backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;
    private final AuthUtil authUtil;

    public RecordController(RecordService recordService, AuthUtil authUtil) {
        this.recordService = recordService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public ResponseEntity<Record> registrar(@RequestBody RecordRequest request) {
        User user = authUtil.getCurrentUser();
        Record criado = recordService.registrar(
                user,
                request.getExerciseId(),
                request.getWeight(),
                request.getReps(),
                request.getDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/exercise/{exerciseId}")
    public List<Record> historico(@PathVariable Long exerciseId) {
        User user = authUtil.getCurrentUser();
        return recordService.listarHistorico(user, exerciseId);
    }

    @PutMapping("/{id}")
    public Record editar(@PathVariable Long id, @RequestBody RecordRequest request) {
        User user = authUtil.getCurrentUser();
        return recordService.editar(user, id, request.getWeight(), request.getReps(), request.getDate());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        User user = authUtil.getCurrentUser();
        recordService.excluir(user, id);
        return ResponseEntity.noContent().build();
    }
}