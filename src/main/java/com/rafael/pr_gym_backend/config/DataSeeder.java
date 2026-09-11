package com.rafael.pr_gym_backend.config;

import com.rafael.pr_gym_backend.model.MuscleGroup;
import com.rafael.pr_gym_backend.repository.MuscleGroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MuscleGroupRepository muscleGroupRepository;

    public DataSeeder(MuscleGroupRepository muscleGroupRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
    }

    @Override
    public void run(String... args) {
        // Só popula se a tabela estiver vazia — evita duplicar em produção
        if (muscleGroupRepository.count() == 0) {
            List<String> grupos = List.of("Peito", "Costas", "Pernas", "Ombro", "Braço", "Abdômen", "Panturrilha");
            grupos.forEach(nome -> muscleGroupRepository.save(new MuscleGroup(nome)));
        }
    }
}