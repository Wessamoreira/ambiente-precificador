# 🚀 SPRINT 1 - GUIA DE IMPLEMENTAÇÃO

## ✅ JÁ IMPLEMENTADO

### 1. Migration Database (V6)
✅ `/db/migration/V6__add_inventory_and_categories.sql`
- Tabela `categories` (categorias)
- Tabela `inventory` (estoque)
- Tabela `stock_movements` (movimentações)
- Triggers automáticos
- Índices de performance

### 2. Entidades (Domain Models)
✅ `Category.java` - Categorias com subcategorias
✅ `Inventory.java` - Controle de estoque
✅ `StockStatus.java` - Enum de status
✅ `StockMovement.java` - Histórico de movimentações

### 3. Repositories
✅ `CategoryRepository.java`
✅ `InventoryRepository.java`
✅ `StockMovementRepository.java`

---

## 📝 PRÓXIMOS PASSOS (Continuar Implementação)

### PASSO 4: Criar DTOs

Criar em `/controller/dto/`:

**CategoryDTO.java**
```java
public record CategoryDTO(
    UUID id,
    String name,
    String description,
    String color,
    String icon,
    UUID parentId,
    String parentName,
    Long productCount
) {}

public record CategoryCreateDTO(
    String name,
    String description,
    String color,
    String icon,
    UUID parentId
) {}
```

**InventoryDTO.java**
```java
public record InventoryDTO(
    UUID id,
    UUID productId,
    String productName,
    String productSku,
    Integer currentStock,
    Integer minStock,
    Integer maxStock,
    Integer reservedStock,
    Integer availableStock,
    String stockStatus,
    OffsetDateTime lastRestockDate
) {}

public record StockAdjustmentDTO(
    Integer quantity,
    String reason,
    String notes
) {}
```

**StockMovementDTO.java**
```java
public record StockMovementDTO(
    UUID id,
    UUID productId,
    String productName,
    String movementType,
    Integer quantity,
    String reason,
    String notes,
    UUID saleId,
    String createdBy,
    OffsetDateTime createdAt
) {}
```

---

### PASSO 5: Atualizar Product.java

Adicionar campo category:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "category_id")
private Category category;
```

---

### PASSO 6: Criar Services

**CategoryService.java**
```java
@Service
public class CategoryService {
    
    public List<CategoryDTO> getAllByOwner(User owner);
    public CategoryDTO create(CategoryCreateDTO dto, User owner);
    public CategoryDTO update(UUID id, CategoryCreateDTO dto, User owner);
    public void delete(UUID id, User owner);
    public List<CategoryDTO> getRootCategories(User owner);
    public List<CategoryDTO> getSubcategories(UUID parentId, User owner);
}
```

**InventoryService.java**
```java
@Service
public class InventoryService {
    
    public InventoryDTO getByProductId(UUID productId);
    public InventoryDTO adjustStock(UUID productId, StockAdjustmentDTO dto, User user);
    public List<InventoryDTO> getLowStock(User owner);
    public List<InventoryDTO> getOutOfStock(User owner);
    public void reserveStock(UUID productId, Integer quantity);
    public void releaseReservedStock(UUID productId, Integer quantity);
    
    // Chamado automaticamente ao criar venda
    public void processStockForSale(Sale sale, User user);
}
```

**StockMovementService.java**
```java
@Service
public class StockMovementService {
    
    public Page<StockMovementDTO> getByProduct(UUID productId, Pageable pageable);
    public Page<StockMovementDTO> getByOwner(User owner, Pageable pageable);
    public StockMovementDTO recordMovement(
        UUID productId,
        MovementType type,
        Integer quantity,
        String reason,
        User user
    );
}
```

---

### PASSO 7: Criar Controllers

**CategoryController.java**
```java
@RestController
@RequestMapping("/categories")
public class CategoryController {
    
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAll();
    
    @GetMapping("/root")
    public ResponseEntity<List<CategoryDTO>> getRootCategories();
    
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryDTO>> getSubcategories(@PathVariable UUID id);
    
    @PostMapping
    public ResponseEntity<CategoryDTO> create(@RequestBody CategoryCreateDTO dto);
    
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(@PathVariable UUID id, @RequestBody CategoryCreateDTO dto);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id);
}
```

**InventoryController.java**
```java
@RestController
@RequestMapping("/inventory")
public class InventoryController {
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryDTO> getByProduct(@PathVariable UUID productId);
    
    @PutMapping("/product/{productId}/adjust")
    public ResponseEntity<InventoryDTO> adjustStock(
        @PathVariable UUID productId,
        @RequestBody StockAdjustmentDTO dto
    );
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryDTO>> getLowStock();
    
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryDTO>> getOutOfStock();
    
    @GetMapping("/movements")
    public ResponseEntity<Page<StockMovementDTO>> getMovements(
        @RequestParam(required = false) UUID productId,
        Pageable pageable
    );
}
```

---

### PASSO 8: Atualizar ProductService

Adicionar suporte a categorias:

```java
// Ao criar/atualizar produto, incluir category
if (dto.categoryId() != null) {
    Category category = categoryRepository.findById(dto.categoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    product.setCategory(category);
}
```

---

### PASSO 9: Atualizar SaleService

Integrar com estoque ao registrar venda:

```java
@Transactional
public SaleResponseDTO createSale(SaleCreateDTO dto, User owner) {
    // ... código existente ...
    
    // NOVO: Processar estoque
    for (SaleItemCreateDTO itemDto : dto.items()) {
        inventoryService.reserveStock(itemDto.productId(), itemDto.quantity());
    }
    
    Sale sale = // ... salvar venda
    
    // NOVO: Registrar movimentação
    inventoryService.processStockForSale(sale, owner);
    
    return // ... retornar
}
```

---

### PASSO 10: Criar Endpoint Dashboard Real

**DashboardController.java** (adicionar):

```java
@GetMapping("/sales-chart")
public ResponseEntity<SalesChartDTO> getSalesChart(
    @RequestParam(defaultValue = "6") int months
) {
    User user = authService.getAuthenticatedUser();
    return ResponseEntity.ok(dashboardService.getSalesChartData(user, months));
}
```

**DashboardService.java** (adicionar método):

```java
public SalesChartDTO getSalesChartData(User owner, int months) {
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusMonths(months);
    
    List<Sale> sales = saleRepository.findByOwnerAndDateBetween(
        owner, 
        startDate.atStartOfDay(), 
        endDate.atTime(23, 59, 59)
    );
    
    // Agrupar por mês
    Map<String, MonthData> monthlyData = new HashMap<>();
    
    for (Sale sale : sales) {
        String monthKey = sale.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        MonthData data = monthlyData.getOrDefault(monthKey, new MonthData());
        data.revenue = data.revenue.add(sale.getTotalAmount());
        data.profit = data.profit.add(sale.getTotalProfit());
        monthlyData.put(monthKey, data);
    }
    
    // Formatar resposta
    List<ChartDataPoint> dataPoints = monthlyData.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .map(entry -> new ChartDataPoint(
            formatMonth(entry.getKey()),
            entry.getValue().revenue,
            entry.getValue().profit
        ))
        .toList();
    
    return new SalesChartDTO(dataPoints);
}

private static class MonthData {
    BigDecimal revenue = BigDecimal.ZERO;
    BigDecimal profit = BigDecimal.ZERO;
}

public record SalesChartDTO(List<ChartDataPoint> data) {}
public record ChartDataPoint(String month, BigDecimal revenue, BigDecimal profit) {}
```

---

## 🎨 FRONTEND - Integração

### 1. Criar serviços API

**categoryService.ts**
```typescript
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data: CategoryCreateDTO) => api.post('/categories', data),
  update: (id: string, data: CategoryCreateDTO) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`)
};
```

**inventoryService.ts**
```typescript
export const inventoryService = {
  getByProduct: (productId: string) => api.get(`/inventory/product/${productId}`),
  adjustStock: (productId: string, data: StockAdjustmentDTO) => 
    api.put(`/inventory/product/${productId}/adjust`, data),
  getLowStock: () => api.get('/inventory/low-stock'),
  getOutOfStock: () => api.get('/inventory/out-of-stock')
};
```

### 2. Atualizar SalesChart.tsx

Substituir dados mock:

```typescript
const { data: chartData, loading } = useSalesChart(6); // 6 meses

// Hook
function useSalesChart(months: number) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get(`/dashboard/sales-chart?months=${months}`)
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [months]);
  
  return { data, loading };
}
```

### 3. Criar página de Categorias

**CategoriesPage.tsx** - Gerenciar categorias
**CategorySelect.tsx** - Componente select para formulários

### 4. Adicionar badge de estoque nos produtos

**ProductCard.tsx**:
```tsx
{inventory && (
  <div className={`badge ${getStockColor(inventory.stockStatus)}`}>
    {inventory.currentStock} unidades
  </div>
)}
```

---

## 🧪 TESTAR

1. **Rodar migration**: `mvn flyway:migrate`
2. **Testar categorias**:
   ```bash
   POST /categories
   GET /categories
   ```
3. **Testar estoque**:
   ```bash
   GET /inventory/product/{id}
   PUT /inventory/product/{id}/adjust
   ```
4. **Verificar dashboard**: `GET /dashboard/sales-chart`

---

## 📊 RESULTADO ESPERADO

✅ Categorias funcionando
✅ Estoque controlado
✅ Alertas de estoque baixo
✅ Dashboard com dados reais
✅ Movimentações registradas
✅ Frontend integrado

---

## 🎯 TEMPO ESTIMADO

- Backend: 4-6 horas
- Frontend: 2-3 horas
- Testes: 1-2 horas
- **Total: ~8-11 horas** (1-2 dias)

---

**Status Atual:** 40% completo (migrations + models + repositories criados)
**Próximo:** Criar DTOs, Services e Controllers
