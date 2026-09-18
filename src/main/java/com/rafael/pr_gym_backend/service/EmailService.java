package com.rafael.pr_gym_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmailRecuperacao(String destinatario, String token) {
        String link = frontendUrl + "/resetar-senha.html?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject("PR Gym — Recuperação de senha");
        mensagem.setText(
                "Você solicitou a recuperação de senha da sua conta no PR Gym.\n\n" +
                "Clique no link abaixo para criar uma nova senha (válido por 30 minutos):\n" +
                link + "\n\n" +
                "Se você não solicitou isso, pode ignorar este e-mail."
        );

        mailSender.send(mensagem);
    }
}
