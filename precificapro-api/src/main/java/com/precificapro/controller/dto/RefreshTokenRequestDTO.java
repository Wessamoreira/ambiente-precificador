package com.precificapro.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDTO(
        @NotBlank(message = "Refresh token é obrigatório")
        String refreshToken
) {}
