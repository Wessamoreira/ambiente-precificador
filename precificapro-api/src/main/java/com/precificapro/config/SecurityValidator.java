package com.precificapro.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Valida que variáveis de ambiente críticas estão configuradas
 * Falha rápido na inicialização se houver problemas de configuração
 */
@Component
@Slf4j
public class SecurityValidator implements ApplicationRunner {

    @Value("${spring.datasource.password:}")
    private String dbPassword;
    
    @Value("${jwt.secret.key:}")
    private String jwtSecret;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Validando configurações de segurança...");
        
        if (!StringUtils.hasText(dbPassword)) {
            throw new IllegalStateException(
                "❌ ERRO CRÍTICO: Variável de ambiente DB_PASSWORD não configurada! " +
                "Configure DB_PASSWORD antes de iniciar a aplicação."
            );
        }
        
        if (!StringUtils.hasText(jwtSecret)) {
            throw new IllegalStateException(
                "❌ ERRO CRÍTICO: Variável de ambiente JWT_SECRET_KEY não configurada! " +
                "Configure JWT_SECRET_KEY antes de iniciar a aplicação."
            );
        }
        
        // Valida tamanho mínimo do JWT secret (256 bits = 32 caracteres)
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException(
                "❌ ERRO CRÍTICO: JWT_SECRET_KEY deve ter no mínimo 32 caracteres (256 bits). " +
                "Tamanho atual: " + jwtSecret.length()
            );
        }
        
        log.info("✅ Configurações de segurança validadas com sucesso");
    }
}
