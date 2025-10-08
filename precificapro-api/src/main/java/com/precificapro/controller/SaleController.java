package com.precificapro.controller;

import com.precificapro.controller.dto.ProductRankingDTO;
import com.precificapro.controller.dto.ProductSalesChartDTO;
import com.precificapro.controller.dto.SaleCreateDTO;
import com.precificapro.controller.dto.SaleResponseDTO;
import com.precificapro.domain.model.User;
import com.precificapro.mapper.SaleMapper;
import com.precificapro.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sales")
public class SaleController {

    @Autowired private SaleService saleService;
    @Autowired private SaleMapper saleMapper;

    @PostMapping
    public ResponseEntity<?> recordSale(@Valid @RequestBody SaleCreateDTO dto, @AuthenticationPrincipal User owner) {
        saleService.recordSale(dto, owner);
        return new ResponseEntity<>("Venda registrada com sucesso.", HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SaleResponseDTO>> getAllSales(@AuthenticationPrincipal User owner) {
        List<SaleResponseDTO> sales = saleService.findAllByOwner(owner).stream()
                .map(saleMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sales);
    }
    
    @GetMapping("/product-ranking")
    public ResponseEntity<List<ProductRankingDTO>> getProductRanking(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(saleService.getProductRanking(owner));
    }
    
    @GetMapping("/product-chart/{productId}")
    public ResponseEntity<ProductSalesChartDTO> getProductSalesChart(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal User owner
    ) {
        return ResponseEntity.ok(saleService.getProductSalesChart(productId, days, owner));
    }
}