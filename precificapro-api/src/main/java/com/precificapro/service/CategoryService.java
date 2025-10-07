package com.precificapro.service;

import com.precificapro.controller.dto.CategoryCreateDTO;
import com.precificapro.controller.dto.CategoryDTO;
import com.precificapro.controller.dto.CategoryUpdateDTO;
import com.precificapro.domain.model.Category;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.CategoryRepository;
import com.precificapro.exception.ResourceAlreadyExistsException;
import com.precificapro.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAllByOwner(User owner) {
        log.info("Buscando categorias do usuário: {}", owner.getEmail());
        return categoryRepository.findByOwnerOrderByNameAsc(owner).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public CategoryDTO findById(UUID id, User owner) {
        log.info("Buscando categoria {} do usuário {}", id, owner.getEmail());
        Category category = categoryRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        return toDTO(category);
    }
    
    @Transactional
    public CategoryDTO create(CategoryCreateDTO dto, User owner) {
        log.info("Criando categoria {} para usuário {}", dto.name(), owner.getEmail());
        
        if (categoryRepository.existsByNameAndOwner(dto.name(), owner)) {
            throw new ResourceAlreadyExistsException("Categoria com nome '" + dto.name() + "' já existe");
        }
        
        Category category = Category.builder()
                .name(dto.name())
                .description(dto.description())
                .icon(dto.icon())
                .color(dto.color())
                .owner(owner)
                .build();
        
        Category saved = categoryRepository.save(category);
        log.info("Categoria criada com ID: {}", saved.getId());
        
        return toDTO(saved);
    }
    
    @Transactional
    public CategoryDTO update(UUID id, CategoryUpdateDTO dto, User owner) {
        log.info("Atualizando categoria {} do usuário {}", id, owner.getEmail());
        
        Category category = categoryRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        
        if (dto.name() != null && !dto.name().equals(category.getName())) {
            if (categoryRepository.existsByNameAndOwner(dto.name(), owner)) {
                throw new ResourceAlreadyExistsException("Categoria com nome '" + dto.name() + "' já existe");
            }
            category.setName(dto.name());
        }
        
        if (dto.description() != null) category.setDescription(dto.description());
        if (dto.icon() != null) category.setIcon(dto.icon());
        if (dto.color() != null) category.setColor(dto.color());
        
        Category updated = categoryRepository.save(category);
        log.info("Categoria atualizada: {}", updated.getId());
        
        return toDTO(updated);
    }
    
    @Transactional
    public void delete(UUID id, User owner) {
        log.info("Deletando categoria {} do usuário {}", id, owner.getEmail());
        
        Category category = categoryRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        
        categoryRepository.delete(category);
        log.info("Categoria deletada: {}", id);
    }
    
    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIcon(),
                category.getColor(),
                category.getProducts() != null ? category.getProducts().size() : 0,
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
