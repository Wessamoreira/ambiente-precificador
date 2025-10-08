package com.precificapro.domain.repository;

import com.precificapro.domain.model.SaleItem;
import com.precificapro.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, UUID> {
    
    @Query("""
        SELECT 
            p.id as productId,
            p.name as productName,
            p.sku as productSku,
            SUM(si.quantity) as totalQuantitySold,
            SUM(si.quantity * si.unitPrice) as totalRevenue,
            SUM(si.netProfit) as totalNetProfit,
            AVG((si.unitPrice - si.unitCostAtSale) / si.unitPrice * 100) as avgProfitMargin
        FROM SaleItem si
        JOIN si.product p
        JOIN si.sale s
        WHERE s.owner = :owner
        GROUP BY p.id, p.name, p.sku
        ORDER BY SUM(si.quantity) DESC
    """)
    List<Object[]> findProductRankingByOwner(@Param("owner") User owner);
    
    @Query("""
        SELECT 
            CAST(s.saleDate AS LocalDate) as saleDate,
            SUM(si.quantity) as totalQuantity,
            SUM(si.quantity * si.unitPrice) as totalRevenue,
            SUM(si.netProfit) as totalProfit,
            COUNT(DISTINCT s.id) as salesCount
        FROM SaleItem si
        JOIN si.sale s
        WHERE s.owner = :owner 
        AND si.product.id = :productId
        AND s.saleDate >= :startDate
        GROUP BY CAST(s.saleDate AS LocalDate)
        ORDER BY CAST(s.saleDate AS LocalDate) ASC
    """)
    List<Object[]> findProductSalesChart(
        @Param("owner") User owner,
        @Param("productId") UUID productId,
        @Param("startDate") java.time.OffsetDateTime startDate
    );
}