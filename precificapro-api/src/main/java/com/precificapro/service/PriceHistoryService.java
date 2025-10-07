package com.precificapro.service;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.model.*;
import com.precificapro.domain.repository.*;
import com.precificapro.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceHistoryService {
    
    private final PriceHistoryRepository priceHistoryRepository;
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public Page<PriceHistoryResponseDTO> getPriceHistory(
            UUID productId,
            User owner,
            OffsetDateTime startDate,
            OffsetDateTime endDate,
            Pageable pageable) {
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Page<PriceHistory> history;
        if (startDate != null && endDate != null) {
            history = priceHistoryRepository.findByProductAndCreatedAtBetweenOrderByCreatedAtDesc(
                product, startDate, endDate, pageable
            );
        } else {
            history = priceHistoryRepository.findByProductOrderByCreatedAtDesc(product, pageable);
        }
        
        return history.map(this::toResponseDTO);
    }
    
    @Transactional(readOnly = true)
    public PriceEvolutionDTO getPriceEvolution(UUID productId, User owner, int days) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        OffsetDateTime startDate = OffsetDateTime.now().minusDays(days);
        List<PriceHistory> evolution = priceHistoryRepository.findPriceEvolution(product, startDate);
        
        BigDecimal minPrice = priceHistoryRepository.findMinPriceByProduct(product);
        BigDecimal maxPrice = priceHistoryRepository.findMaxPriceByProduct(product);
        BigDecimal avgPrice = priceHistoryRepository.findAvgPriceByProduct(product);
        
        // Calcular variação e tendência
        BigDecimal variation = BigDecimal.ZERO;
        String trend = "STABLE";
        
        if (evolution.size() >= 2) {
            BigDecimal firstPrice = evolution.get(0).getSuggestedPrice();
            BigDecimal lastPrice = evolution.get(evolution.size() - 1).getSuggestedPrice();
            
            if (firstPrice.compareTo(BigDecimal.ZERO) > 0) {
                variation = lastPrice.subtract(firstPrice)
                        .divide(firstPrice, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
                
                if (variation.compareTo(new BigDecimal("5")) > 0) {
                    trend = "INCREASING";
                } else if (variation.compareTo(new BigDecimal("-5")) < 0) {
                    trend = "DECREASING";
                }
            }
        }
        
        return PriceEvolutionDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .periodDays(days)
                .dataPoints(evolution.stream()
                        .map(this::toDataPoint)
                        .collect(Collectors.toList()))
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .avgPrice(avgPrice)
                .priceVariation(variation)
                .trend(trend)
                .totalRecords((long) evolution.size())
                .build();
    }
    
    @Transactional(readOnly = true)
    public PriceStatisticsDTO getStatistics(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        BigDecimal minPrice = priceHistoryRepository.findMinPriceByProduct(product);
        BigDecimal maxPrice = priceHistoryRepository.findMaxPriceByProduct(product);
        BigDecimal avgPrice = priceHistoryRepository.findAvgPriceByProduct(product);
        long totalRecords = priceHistoryRepository.countByProduct(product);
        
        PriceHistory lastRecord = priceHistoryRepository.findFirstByProductOrderByCreatedAtDesc(product)
                .orElse(null);
        
        return PriceStatisticsDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .avgPrice(avgPrice)
                .currentPrice(lastRecord != null ? lastRecord.getSuggestedPrice() : null)
                .currentMargin(lastRecord != null ? lastRecord.getNetProfitPercentage() : null)
                .totalRecords(totalRecords)
                .lastUpdated(lastRecord != null ? lastRecord.getCreatedAt() : null)
                .build();
    }
    
    private PriceHistoryResponseDTO toResponseDTO(PriceHistory history) {
        return PriceHistoryResponseDTO.builder()
                .id(history.getId())
                .productId(history.getProduct().getId())
                .suggestedPrice(history.getSuggestedPrice())
                .actualPrice(history.getActualPrice())
                .pricingProfileName(history.getPricingProfileName())
                .totalCost(history.getTotalCost())
                .netProfitPerUnit(history.getNetProfitPerUnit())
                .netProfitPercentage(history.getNetProfitPercentage())
                .markupApplied(history.getMarkupApplied())
                .marginOnPrice(history.getMarginOnPrice())
                .createdAt(history.getCreatedAt())
                .createdBy(history.getCreatedBy() != null ? history.getCreatedBy().getName() : null)
                .notes(history.getNotes())
                .build();
    }
    
    private PriceEvolutionDTO.DataPoint toDataPoint(PriceHistory history) {
        return PriceEvolutionDTO.DataPoint.builder()
                .date(history.getCreatedAt().toLocalDate())
                .suggestedPrice(history.getSuggestedPrice())
                .profitMargin(history.getNetProfitPercentage())
                .pricingProfile(history.getPricingProfileName())
                .build();
    }
}
