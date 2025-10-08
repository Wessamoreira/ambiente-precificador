package com.precificapro.service;

import com.precificapro.controller.dto.DashboardMetricsDTO;
import com.precificapro.domain.model.Sale;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.CustomerRepository;
import com.precificapro.domain.repository.ProductRepository;
import com.precificapro.domain.repository.SaleRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Cacheable(value = "dashboardMetrics", key = "#owner.id")
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

    public List<Map<String, Object>> getSalesChartData(User owner, int days) {
        List<Sale> sales = saleRepository.findAllByOwnerOrderBySaleDateDesc(owner);
        
        // Agrupar vendas por data (Revenue)
        Map<LocalDate, BigDecimal> revenueByDate = sales.stream()
            .collect(Collectors.groupingBy(
                sale -> sale.getSaleDate().toLocalDate(),
                Collectors.reducing(BigDecimal.ZERO, Sale::getTotalAmount, BigDecimal::add)
            ));

        // Agrupar lucro por data (Profit)
        Map<LocalDate, BigDecimal> profitByDate = sales.stream()
            .collect(Collectors.groupingBy(
                sale -> sale.getSaleDate().toLocalDate(),
                Collectors.reducing(BigDecimal.ZERO, Sale::getTotalNetProfit, BigDecimal::add)
            ));

        LocalDate today = LocalDate.now();
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        
        // Criar dados para cada dia (limitado a 365 dias para performance)
        int maxDays = Math.min(days, 365);
        LocalDate startDate = today.minusDays(maxDays - 1);
        
        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", date.format(formatter));
            dataPoint.put("revenue", revenueByDate.getOrDefault(date, BigDecimal.ZERO));
            dataPoint.put("profit", profitByDate.getOrDefault(date, BigDecimal.ZERO));
            chartData.add(dataPoint);
        }
        
        return chartData;
    }
}
