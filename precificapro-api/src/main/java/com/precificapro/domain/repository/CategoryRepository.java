package com.precificapro.domain.repository;

import com.precificapro.domain.model.Category;
import com.precificapro.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    List<Category> findByOwnerOrderByNameAsc(User owner);
    
    Optional<Category> findByIdAndOwner(UUID id, User owner);
    
    Optional<Category> findByNameAndOwner(String name, User owner);
    
    boolean existsByNameAndOwner(String name, User owner);
    
    long countByOwner(User owner);
}
