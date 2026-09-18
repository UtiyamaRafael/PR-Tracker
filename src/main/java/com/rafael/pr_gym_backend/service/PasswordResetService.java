package com.rafael.pr_gym_backend.service;

import com.rafael.pr_gym_backend.model.PasswordResetToken;
import com.rafael.pr_gym_backend.model.User;
import com.rafael.pr_gym_backend.repository.PasswordResetTokenRepository;
import com.rafael.pr_gym_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final int VALIDADE_MINUTOS = 30;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepository,
                                 PasswordResetTokenRepository tokenRepository,
                                 EmailService emailService,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // Não revela se o e-mail existe ou não (evita enumeração de contas) —
    // só envia o e-mail de fato se o usuário existir, mas o retorno é sempre "sucesso"
    @Transactional
    public void solicitarRecuperacao(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(VALIDADE_MINUTOS));
            tokenRepository.save(resetToken);

            emailService.enviarEmailRecuperacao(user.getEmail(), token);
        });
    }

    @Transactional
    public void resetarSenha(String token, String novaSenha) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Link de recuperação inválido ou já utilizado."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Link de recuperação expirado. Solicite um novo.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(novaSenha));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
