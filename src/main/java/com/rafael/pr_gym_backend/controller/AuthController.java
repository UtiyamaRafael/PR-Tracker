package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.*;
import com.rafael.pr_gym_backend.model.User;
import com.rafael.pr_gym_backend.repository.UserRepository;
import com.rafael.pr_gym_backend.security.JwtUtil;
import com.rafael.pr_gym_backend.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetService passwordResetService;

    public AuthController(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           PasswordResetService passwordResetService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body("Já existe uma conta com esse e-mail");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        String token = jwtUtil.generateToken(dto.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
        passwordResetService.solicitarRecuperacao(dto.getEmail());
        // Mensagem genérica de propósito: não revela se o e-mail existe ou não na base
        return ResponseEntity.ok("Se esse e-mail estiver cadastrado, você vai receber um link de recuperação.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO dto) {
        passwordResetService.resetarSenha(dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok("Senha atualizada com sucesso.");
    }
}
