package com.precificapro.domain.repository;

import com.precificapro.domain.model.Sale;
import com.precificapro.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {
    List<Sale> findAllByOwnerOrderBySaleDateDesc(User owner);
    
    /**
     * Query otimizada que faz agregação no banco ao invés de carregar todas as sales em memória.
     * Retorna [totalRevenue, totalNetProfit]
     */
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0), COALESCE(SUM(s.totalNetProfit), 0) " +
           "FROM Sale s WHERE s.owner = :owner")
    Object[] getSalesAggregates(@Param("owner") User owner);
}