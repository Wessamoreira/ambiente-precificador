package com.precificapro.domain.repository;

import com.precificapro.domain.model.Inventory;
import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    
    Page<StockMovement> findByInventoryOrderByCreatedAtDesc(Inventory inventory, Pageable pageable);
    
    Page<StockMovement> findByProductOrderByCreatedAtDesc(Product product, Pageable pageable);
    
    List<StockMovement> findTop10ByProductOrderByCreatedAtDesc(Product product);
}
