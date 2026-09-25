package com.rafael.pr_gym_backend.service;

import com.rafael.pr_gym_backend.model.Exercise;
import com.rafael.pr_gym_backend.model.MuscleGroup;
import com.rafael.pr_gym_backend.repository.ExerciseRepository;
import com.rafael.pr_gym_backend.repository.MuscleGroupRepository;
import com.rafael.pr_gym_backend.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final RecordRepository recordRepository;

    public ExerciseService(ExerciseRepository exerciseRepository,
                           MuscleGroupRepository muscleGroupRepository,
                           RecordRepository recordRepository) {
        this.exerciseRepository = exerciseRepository;
        this.muscleGroupRepository = muscleGroupRepository;
        this.recordRepository = recordRepository;
    }

    public List<Exercise> listarTodos() {
        return exerciseRepository.findAll();
    }

    // RF01 — cadastro com validação de nome único
    public Exercise cadastrar(String nome, Long muscleGroupId) {
        if (exerciseRepository.existsByNameIgnoreCase(nome)) {
            throw new IllegalArgumentException("Já existe um exercício com esse nome.");
        }

        MuscleGroup grupo = muscleGroupRepository.findById(muscleGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo muscular não encontrado."));

        Exercise exercise = new Exercise(nome, grupo);
        return exerciseRepository.save(exercise);
    }

    // RF03 — editar exercício
    public Exercise editar(Long id, String novoNome, Long novoMuscleGroupId) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exercício não encontrado."));

        // Mesma validação de unicidade do cadastro (RF01): sem isso, renomear para um
        // nome já existente derruba com uma DataIntegrityViolationException não tratada.
        if (!exercise.getName().equalsIgnoreCase(novoNome) && exerciseRepository.existsByNameIgnoreCase(novoNome)) {
            throw new IllegalArgumentException("Já existe um exercício com esse nome.");
        }

        MuscleGroup grupo = muscleGroupRepository.findById(novoMuscleGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo muscular não encontrado."));

        exercise.setName(novoNome);
        exercise.setMuscleGroup(grupo);
        return exerciseRepository.save(exercise);
    }

    // RF04 — excluir, bloqueando se houver histórico
    public void excluir(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exercício não encontrado."));

        if (recordRepository.existsByExercise(exercise)) {
            throw new IllegalStateException("Não é possível excluir: este exercício possui registros.");
        }

        exerciseRepository.delete(exercise);
    }
}