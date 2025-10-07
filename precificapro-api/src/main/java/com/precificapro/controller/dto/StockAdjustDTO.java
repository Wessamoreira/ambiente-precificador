package com.precificapro.controller.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record StockAdjustDTO(
    @NotBlank(message = "Tipo é obrigatório")
    @Pattern(regexp = "IN|OUT", message = "Tipo deve ser IN ou OUT")
    String type,
    
    @Min(value = 1, message = "Quantidade deve ser maior que 0")
    Integer quantity,
    
    @NotBlank(message = "Motivo é obrigatório")
    String reason,
    
    String notes
) {}
