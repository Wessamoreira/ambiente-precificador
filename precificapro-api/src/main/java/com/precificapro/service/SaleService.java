package com.precificapro.service;

import com.precificapro.controller.dto.ProductRankingDTO;
import com.precificapro.controller.dto.ProductSalesChartDTO;
import com.precificapro.controller.dto.SaleCreateDTO;
import com.precificapro.domain.model.*;
import com.precificapro.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SaleService {

    @Autowired private SaleRepository saleRepository;
    @Autowired private SaleItemRepository saleItemRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CostItemRepository costItemRepository;
    @Autowired private FreightBatchRepository freightBatchRepository;
    @Autowired private InventoryService inventoryService;
    
    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);
    
    @Transactional(readOnly = true)
    public List<Sale> findAllByOwner(User owner) {
        return saleRepository.findAllByOwnerOrderBySaleDateDesc(owner);
    }

    @Transactional
    @CacheEvict(value = "dashboardMetrics", key = "#owner.id")
    public Sale recordSale(SaleCreateDTO dto, User owner) {
        // 1. Encontra ou cria o cliente
        Customer customer = customerRepository.findByOwnerAndPhoneNumber(owner, dto.customerPhoneNumber())
                .orElseGet(() -> {
                    Customer newCustomer = Customer.builder()
                            .owner(owner)
                            .phoneNumber(dto.customerPhoneNumber())
                            .name("Cliente - " + dto.customerPhoneNumber()) // Nome padrão
                            .build();
                    return customerRepository.save(newCustomer);
                });

        Sale sale = Sale.builder()
                .owner(owner)
                .customer(customer)
                .saleDate(OffsetDateTime.now())
                .build();

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalNetProfit = BigDecimal.ZERO;

        // 2. VERIFICAR ESTOQUE ANTES DE PROCESSAR A VENDA
        for (SaleCreateDTO.SaleItemCreateDTO itemDto : dto.items()) {
            Product product = productRepository.findByIdAndOwner(itemDto.productId(), owner)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
            
            // ✅ VERIFICAR SE HÁ ESTOQUE DISPONÍVEL
            if (!inventoryService.hasAvailableStock(itemDto.productId(), itemDto.quantity())) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName() + 
                    ". Disponível: " + inventoryService.getAvailableStock(itemDto.productId()) + 
                    ", Solicitado: " + itemDto.quantity());
            }
        }
        
        // 3. Processa cada item da venda
        for (SaleCreateDTO.SaleItemCreateDTO itemDto : dto.items()) {
            Product product = productRepository.findByIdAndOwner(itemDto.productId(), owner)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

            // 4. CALCULA O CUSTO DO PRODUTO NO MOMENTO DA VENDA (SNAPSHOT)
            // Esta lógica é uma simplificação do PricingSimulationService
            BigDecimal freightCostUnit = freightBatchRepository.findFirstByProductOrderByCreatedAtDesc(product)
                .map(batch -> batch.getFreightTotal().divide(BigDecimal.valueOf(batch.getBatchSize()), MC))
                .orElse(BigDecimal.ZERO);
            BigDecimal directCostUnit = product.getDefaultPurchaseCost()
                .add(product.getDefaultPackagingCost())
                .add(product.getDefaultOtherVariableCost())
                .add(freightCostUnit);

            // Custo total unitário (sem rateio de fixos para o lucro da venda)
            BigDecimal unitCostAtSale = directCostUnit; // Decisão: lucro da venda não considera custo fixo
            BigDecimal itemProfit = itemDto.unitPrice().subtract(unitCostAtSale);
            BigDecimal totalItemProfit = itemProfit.multiply(BigDecimal.valueOf(itemDto.quantity()));

            SaleItem saleItem = SaleItem.builder()
                    .sale(sale)
                    .product(product)
                    .quantity(itemDto.quantity())
                    .unitPrice(itemDto.unitPrice())
                    .unitCostAtSale(unitCostAtSale)
                    .netProfit(totalItemProfit)
                    .build();
            
            saleItems.add(saleItem);
            totalAmount = totalAmount.add(itemDto.unitPrice().multiply(BigDecimal.valueOf(itemDto.quantity())));
            totalNetProfit = totalNetProfit.add(totalItemProfit);
        }

        sale.setItems(saleItems);
        sale.setTotalAmount(totalAmount);
        sale.setTotalNetProfit(totalNetProfit);

        Sale savedSale = saleRepository.save(sale);
        
        // 5. ✅ DAR BAIXA NO ESTOQUE APÓS SALVAR A VENDA
        for (SaleCreateDTO.SaleItemCreateDTO itemDto : dto.items()) {
            inventoryService.adjustStock(
                itemDto.productId(), 
                itemDto.quantity(), 
                "OUT", 
                "Venda registrada - ID: " + savedSale.getId(),
                "Baixa automática de estoque pela venda"
            );
        }
        
        return savedSale;
    }
    
    @Transactional(readOnly = true)
    public List<ProductRankingDTO> getProductRanking(User owner) {
        List<Object[]> results = saleItemRepository.findProductRankingByOwner(owner);
        
        return results.stream()
            .map(row -> new ProductRankingDTO(
                ((UUID) row[0]).toString(),
                (String) row[1],
                (String) row[2],
                ((Number) row[3]).longValue(),
                (BigDecimal) row[4],
                (BigDecimal) row[5],
                row[6] != null ? ((Number) row[6]).doubleValue() : 0.0
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductSalesChartDTO getProductSalesChart(UUID productId, int days, User owner) {
        // Verificar se produto existe e pertence ao usuário
        Product product = productRepository.findByIdAndOwner(productId, owner)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
        
        OffsetDateTime startDate = OffsetDateTime.now().minusDays(days);
        List<Object[]> results = saleItemRepository.findProductSalesChart(owner, productId, startDate);
        
        List<ProductSalesChartDTO.DataPoint> dataPoints = results.stream()
            .map(row -> new ProductSalesChartDTO.DataPoint(
                (LocalDate) row[0],
                ((Number) row[1]).longValue(),
                (BigDecimal) row[2],
                (BigDecimal) row[3],
                ((Number) row[4]).intValue()
            ))
            .collect(Collectors.toList());
        
        BigDecimal totalRevenue = dataPoints.stream()
            .map(ProductSalesChartDTO.DataPoint::revenue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Long totalQuantity = dataPoints.stream()
            .mapToLong(ProductSalesChartDTO.DataPoint::quantitySold)
            .sum();
        
        BigDecimal avgDailyRevenue = dataPoints.isEmpty() 
            ? BigDecimal.ZERO 
            : totalRevenue.divide(BigDecimal.valueOf(days), MathContext.DECIMAL64);
        
        return new ProductSalesChartDTO(
            productId.toString(),
            product.getName(),
            product.getSku(),
            dataPoints,
            totalRevenue,
            totalQuantity,
            avgDailyRevenue
        );
    }
}