package com.precificapro.domain.repository;

import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    // Busca todos os produtos de um usuário específico (legado - usar versão paginada)
    List<Product> findByOwner(User owner);
    
    // NOVO: Busca paginada de produtos por owner
    Page<Product> findByOwner(User owner, Pageable pageable);
    
    // Busca um produto pelo seu ID E pelo seu dono
    Optional<Product> findByIdAndOwner(UUID id, User owner);

    // Verifica se já existe um produto com um SKU para um determinado dono
    boolean existsBySkuAndOwner(String sku, User owner);
    
    boolean existsByIdAndOwner(UUID id, User owner);
    Optional<Product> findBySkuAndOwner(String sku, User owner);
    
    // Método para o dashboard
    long countByOwner(User owner);
    
    // Buscar produtos por categoria
    @Query("SELECT p FROM Product p WHERE p.owner = :owner AND p.category.id = :categoryId")
    List<Product> findByOwnerAndCategoryId(@Param("owner") User owner, @Param("categoryId") UUID categoryId);
}