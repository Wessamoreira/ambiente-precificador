# 📦 MÓDULO 1 - SISTEMA DE CATEGORIAS

**Prioridade:** 🔴 ALTA  
**Tempo Estimado:** 4-6 horas  
**Complexidade:** ⭐⭐ (Média)

---

## 🎯 OBJETIVO
Implementar sistema completo de categorias para organizar produtos.

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### BACKEND (3-4h)
- [ ] V3__add_categories_table.sql - Migration
- [ ] Category.java - Model
- [ ] CategoryRepository.java - Repository
- [ ] CategoryService.java - Service
- [ ] CategoryController.java - Controller
- [ ] CategoryDTO.java - DTO

### FRONTEND (1-2h)
- [ ] types/index.ts - Adicionar tipos
- [ ] api/categoryService.ts - Service
- [ ] pages/CategoriesPage.tsx - Página
- [ ] Adicionar rota em AppRoutes.tsx
- [ ] Adicionar link no Sidebar.tsx

---

## 🗄️ PASSO 1: MIGRATION (15min)

**Arquivo:** `precificapro-api/src/main/resources/db/migration/V3__add_categories_table.sql`

```sql
-- Tabela de categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categories_owner FOREIGN KEY (owner_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_category_name_owner UNIQUE (name, owner_id)
);

-- Índices
CREATE INDEX idx_categories_owner_id ON categories(owner_id);
CREATE INDEX idx_categories_name ON categories(name);

-- Adicionar categoria_id na tabela products
ALTER TABLE products ADD COLUMN category_id UUID;
ALTER TABLE products ADD CONSTRAINT fk_products_category 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
CREATE INDEX idx_products_category_id ON products(category_id);

-- Comentários
COMMENT ON TABLE categories IS 'Categorias de produtos';
COMMENT ON COLUMN categories.icon IS 'Nome do ícone (ex: Package, Box, etc)';
COMMENT ON COLUMN categories.color IS 'Cor hexadecimal para identificação visual';
```

---

## 🏗️ PASSO 2: MODEL (10min)

**Arquivo:** `precificapro-api/src/main/java/com/precificapro/domain/model/Category.java`

```java
package com.precificapro.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name", "owner_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String icon;
    
    @Column(length = 20)
    private String color;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
    
    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
```

---

## 📚 PASSO 3: REPOSITORY (5min)

**Arquivo:** `precificapro-api/src/main/java/com/precificapro/domain/repository/CategoryRepository.java`

```java
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
```

---

## 🛠️ PASSO 4: SERVICE (30min)

**Arquivo:** `precificapro-api/src/main/java/com/precificapro/service/CategoryService.java`

```java
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
```

---

## 🎮 PASSO 5: CONTROLLER (20min)

**Arquivo:** `precificapro-api/src/main/java/com/precificapro/controller/CategoryController.java`

```java
package com.precificapro.controller;

import com.precificapro.controller.dto.CategoryCreateDTO;
import com.precificapro.controller.dto.CategoryDTO;
import com.precificapro.controller.dto.CategoryUpdateDTO;
import com.precificapro.domain.model.User;
import com.precificapro.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Gerenciamento de Categorias")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    @Operation(summary = "Listar todas as categorias")
    public ResponseEntity<List<CategoryDTO>> getAll(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.findAllByOwner(owner));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria por ID")
    public ResponseEntity<CategoryDTO> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.findById(id, owner));
    }
    
    @PostMapping
    @Operation(summary = "Criar nova categoria")
    public ResponseEntity<CategoryDTO> create(
            @Valid @RequestBody CategoryCreateDTO dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.status(201).body(categoryService.create(dto, owner));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria")
    public ResponseEntity<CategoryDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryUpdateDTO dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.update(id, dto, owner));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar categoria")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User owner) {
        categoryService.delete(id, owner);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 📝 PASSO 6: DTOs (15min)

**Arquivos em:** `precificapro-api/src/main/java/com/precificapro/controller/dto/`

```java
// CategoryDTO.java
public record CategoryDTO(
    UUID id,
    String name,
    String description,
    String icon,
    String color,
    int productCount,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}

// CategoryCreateDTO.java
public record CategoryCreateDTO(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String name,
    
    String description,
    String icon,
    String color
) {}

// CategoryUpdateDTO.java
public record CategoryUpdateDTO(
    String name,
    String description,
    String icon,
    String color
) {}
```

---

## 🎨 PASSO 7: FRONTEND - Types (5min)

**Arquivo:** `precificapro-frontend/src/types/index.ts` (adicionar)

```typescript
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}
```

---

## 🌐 PASSO 8: FRONTEND - Service (10min)

**Arquivo:** `precificapro-frontend/src/api/categoryService.ts`

```typescript
import api from './axios';
import { Category, CategoryCreateData } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CategoryCreateData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CategoryCreateData>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
```

---

## 💻 PASSO 9: FRONTEND - Página (30min)

**Arquivo:** `precificapro-frontend/src/pages/CategoriesPage.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { categoryService } from '../api/categoryService';
import { Category, CategoryCreateData } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryCreateData>({
    name: '',
    description: '',
    icon: 'Package',
    color: '#6366f1',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      alert('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      await loadCategories();
      handleCloseModal();
    } catch (error) {
      alert('Erro ao salvar categoria');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja deletar esta categoria?')) {
      try {
        await categoryService.delete(id);
        await loadCategories();
      } catch (error) {
        alert('Erro ao deletar categoria');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'Package',
      color: category.color || '#6366f1',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Package',
      color: '#6366f1',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📦 Categorias</h1>
        <GlassButton onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nova Categoria
        </GlassButton>
      </div>

      {loading ? (
        <div className="text-white text-center">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <GlassCard key={category.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Package className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.productCount} produtos</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="text-gray-300 text-sm mt-2">{category.description}</p>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Nome *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-24"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Cor</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-12 bg-white/10 border border-white/20 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
            >
              Cancelar
            </button>
            <GlassButton type="submit">
              {editingCategory ? 'Atualizar' : 'Criar'}
            </GlassButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
```

---

## 🔗 PASSO 10: ROTAS E MENU (10min)

**1. Adicionar rota em `AppRoutes.tsx`:**
```typescript
import { CategoriesPage } from '../pages/CategoriesPage';

<Route path="/categories" element={<CategoriesPage />} />
```

**2. Adicionar no Sidebar:**
```typescript
<Link to="/categories">
  <Package className="w-5 h-5 mr-3" />
  Categorias
</Link>
```

---

## ✅ CONCLUSÃO

**Tempo Total:** ~4-6 horas  
**Arquivos Criados:** 12  
**Endpoints:** 5 REST  
**Pronto para:** Usar em produção
