package com.precificapro.domain.repository;

import com.precificapro.domain.enums.StockStatus;
import com.precificapro.domain.model.Inventory;
import com.precificapro.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    
    Optional<Inventory> findByProduct(Product product);
    
    Optional<Inventory> findByProductId(UUID productId);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId")
    List<Inventory> findByOwnerId(@Param("ownerId") UUID ownerId);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId AND i.stockStatus = :status")
    List<Inventory> findByOwnerIdAndStatus(@Param("ownerId") UUID ownerId, @Param("status") StockStatus status);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId " +
           "AND (i.stockStatus = 'LOW_STOCK' OR i.stockStatus = 'OUT_OF_STOCK')")
    List<Inventory> findLowStockByOwnerId(@Param("ownerId") UUID ownerId);
    
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.product.owner.id = :ownerId AND i.stockStatus = 'OUT_OF_STOCK'")
    long countOutOfStockByOwnerId(@Param("ownerId") UUID ownerId);
    
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.product.owner.id = :ownerId AND i.stockStatus = 'LOW_STOCK'")
    long countLowStockByOwnerId(@Param("ownerId") UUID ownerId);
}
