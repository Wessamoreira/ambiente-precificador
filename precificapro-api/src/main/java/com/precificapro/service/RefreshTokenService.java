package com.precificapro.service;

import com.precificapro.domain.model.RefreshToken;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.RefreshTokenRepository;
import com.precificapro.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token.expiration.ms:86400000}")
    private Long refreshTokenDurationMs;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Revoga tokens anteriores do usuário
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(OffsetDateTime.now().plusSeconds(refreshTokenDurationMs / 1000))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional(readOnly = true)
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new BusinessException("Refresh token expirado. Por favor, faça login novamente.");
        }
        if (token.getRevoked()) {
            throw new BusinessException("Refresh token revogado. Por favor, faça login novamente.");
        }
        return token;
    }

    @Transactional(readOnly = true)
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException("Refresh token não encontrado"));
    }

    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(OffsetDateTime.now());
    }
}
