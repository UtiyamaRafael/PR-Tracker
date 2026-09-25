package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.RecordRequest;
import com.rafael.pr_gym_backend.dto.RecordResponse;
import com.rafael.pr_gym_backend.model.Record;
import com.rafael.pr_gym_backend.model.User;
import com.rafael.pr_gym_backend.service.RecordService;
import com.rafael.pr_gym_backend.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;
    private final AuthUtil authUtil;

    public RecordController(RecordService recordService, AuthUtil authUtil) {
        this.recordService = recordService;
        this.authUtil = authUtil;
    }

    // Retorna RecordResponse (DTO), nunca a entidade Record crua: Record
    // carrega uma referencia para User, e serializar User expunha o hash
    // bcrypt da senha no JSON (ver analise tecnica, item critico).
    @PostMapping
    public ResponseEntity<RecordResponse> registrar(@Valid @RequestBody RecordRequest request) {
        User user = authUtil.getCurrentUser();
        Record criado = recordService.registrar(
                user,
                request.getExerciseId(),
                request.getWeight(),
                request.getReps(),
                request.getDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(new RecordResponse(criado));
    }

    @GetMapping("/exercise/{exerciseId}")
    public List<RecordResponse> historico(@PathVariable Long exerciseId) {
        User user = authUtil.getCurrentUser();
        return recordService.listarHistorico(user, exerciseId).stream()
                .map(RecordResponse::new)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public RecordResponse editar(@PathVariable Long id, @Valid @RequestBody RecordRequest request) {
        User user = authUtil.getCurrentUser();
        Record editado = recordService.editar(user, id, request.getWeight(), request.getReps(), request.getDate());
        return new RecordResponse(editado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        User user = authUtil.getCurrentUser();
        recordService.excluir(user, id);
        return ResponseEntity.noContent().build();
    }
}
