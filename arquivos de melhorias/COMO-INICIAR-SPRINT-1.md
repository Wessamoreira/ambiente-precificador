# 🚀 COMO INICIAR SPRINT 1 - GUIA RÁPIDO

## ✅ STATUS: BACKEND 100% IMPLEMENTADO!

---

## 📦 O QUE ESTÁ PRONTO

### Backend (Java/Spring Boot)
✅ 18 arquivos criados
✅ 14 endpoints novos
✅ 3 tabelas novas no banco
✅ Migration V6 pronta
✅ Validações implementadas
✅ Triggers automáticos

### Features Completas
✅ Gestão de Estoque
✅ Categorias de Produtos
✅ Dashboard com dados REAIS
✅ Histórico de movimentações

---

## 🚀 PASSO 1: RODAR O BACKEND

```bash
cd precificapro-api

# Compilar
mvn clean install

# Rodar
mvn spring-boot:run
```

A migration `V6` será executada automaticamente! ✨

---

## 🧪 PASSO 2: TESTAR ENDPOINTS

### 1. Login (pegar token)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu_usuario",
    "password": "sua_senha"
  }'
```

Copie o `token` da resposta.

### 2. Criar Categoria
```bash
curl -X POST http://localhost:8080/categories \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos",
    "color": "#3B82F6",
    "icon": "laptop"
  }'
```

### 3. Listar Categorias
```bash
curl http://localhost:8080/categories \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Consultar Estoque
```bash
curl http://localhost:8080/inventory/product/SEU_PRODUCT_ID \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Ajustar Estoque
```bash
curl -X PUT http://localhost:8080/inventory/product/SEU_PRODUCT_ID/adjust \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 100,
    "reason": "Reposição inicial",
    "notes": "Primeiro lote"
  }'
```

### 6. Dashboard com Dados Reais
```bash
curl http://localhost:8080/dashboard/sales-chart?months=6 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 VERIFICAR NO BANCO

```sql
-- Ver categorias criadas
SELECT * FROM categories;

-- Ver estoque dos produtos
SELECT p.name, i.current_stock, i.min_stock, i.stock_status 
FROM products p 
JOIN inventory i ON p.id = i.product_id;

-- Ver movimentações
SELECT p.name, sm.movement_type, sm.quantity, sm.created_at 
FROM stock_movements sm 
JOIN products p ON p.id = sm.product_id 
ORDER BY sm.created_at DESC;
```

---

## 🎨 PASSO 3: INTEGRAR FRONTEND

### Arquivos para criar/modificar:

1. **`src/api/categoryService.ts`** - Serviço de categorias
2. **`src/api/inventoryService.ts`** - Serviço de estoque
3. **`src/pages/CategoriesPage.tsx`** - Página de categorias
4. **`src/pages/ProductsPage.tsx`** - Adicionar badge de estoque
5. **`src/components/dashboard/SalesChart.tsx`** - Atualizar com dados reais

### Exemplo: Atualizar SalesChart

**ANTES (Mock):**
```typescript
const mockData = [
  { month: 'Jan', revenue: 4200, profit: 1200 },
  // ...
];
```

**DEPOIS (Real):**
```typescript
const [data, setData] = useState([]);

useEffect(() => {
  api.get('/dashboard/sales-chart?months=6')
    .then(res => setData(res.data.data))
    .catch(err => console.error(err));
}, []);
```

---

## 📋 CHECKLIST

- [ ] Backend rodando sem erros
- [ ] Migration V6 executada
- [ ] Endpoints testados
- [ ] Categorias criadas
- [ ] Estoque ajustado
- [ ] Dashboard mostrando dados reais
- [ ] Frontend atualizado

---

## 🐛 TROUBLESHOOTING

### Erro: "Table already exists"
```bash
# A migration já foi executada antes
# Verificar versão:
SELECT * FROM flyway_schema_history;
```

### Erro: "Category not found"
- Verificar se o token é válido
- Verificar se a categoria pertence ao usuário

### Erro: "Stock not found"
```sql
-- Criar manualmente se necessário:
INSERT INTO inventory (product_id, current_stock, min_stock)
VALUES ('seu-product-id', 0, 10);
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Veja os arquivos:
- `SPRINT-1-COMPLETO.md` - Documentação completa
- `SPRINT-1-IMPLEMENTACAO-GUIA.md` - Guia de implementação

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Testar backend
2. ⏳ Integrar frontend (2-3 horas)
3. ⏳ Sprint 2: Formas de Pagamento + Exportação

---

**🚀 ESTÁ TUDO PRONTO! BOA SORTE!**
