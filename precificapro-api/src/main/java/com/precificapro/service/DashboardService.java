package com.precificapro.service;

import com.precificapro.controller.dto.DashboardMetricsDTO;
import com.precificapro.domain.model.Sale;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.CustomerRepository;
import com.precificapro.domain.repository.ProductRepository;
import com.precificapro.domain.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public DashboardService(SaleRepository saleRepository, 
                          ProductRepository productRepository,
                          CustomerRepository customerRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    public DashboardMetricsDTO getMetrics(User owner) {
        List<Sale> sales = saleRepository.findAllByOwnerOrderBySaleDateDesc(owner);

        BigDecimal totalRevenue = sales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNetProfit = sales.stream()
                .map(Sale::getTotalNetProfit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long productCount = productRepository.countByOwner(owner);
        long customerCount = customerRepository.countByOwner(owner);

        return new DashboardMetricsDTO(totalRevenue, totalNetProfit, productCount, customerCount);
    }
}