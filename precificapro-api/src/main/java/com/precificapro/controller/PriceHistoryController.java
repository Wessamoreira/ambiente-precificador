package com.precificapro.controller;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.model.User;
import com.precificapro.service.PriceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/products/{productId}/price-history")
@RequiredArgsConstructor
public class PriceHistoryController {
    
    private final PriceHistoryService priceHistoryService;
    
    @GetMapping
    public ResponseEntity<Page<PriceHistoryResponseDTO>> getHistory(
            @PathVariable UUID productId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
            @AuthenticationPrincipal User owner,
            Pageable pageable) {
        return ResponseEntity.ok(priceHistoryService.getPriceHistory(productId, owner, startDate, endDate, pageable));
    }
    
    @GetMapping("/evolution")
    public ResponseEntity<PriceEvolutionDTO> getEvolution(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(priceHistoryService.getPriceEvolution(productId, owner, days));
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<PriceStatisticsDTO> getStatistics(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(priceHistoryService.getStatistics(productId, owner));
    }
}
