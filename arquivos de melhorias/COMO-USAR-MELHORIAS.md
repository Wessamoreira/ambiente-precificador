# 🚀 GUIA RÁPIDO - COMO USAR AS MELHORIAS IMPLEMENTADAS

---

## 🔧 BACKEND - CONFIGURAÇÃO INICIAL

### 1. Configurar Variáveis de Ambiente (OBRIGATÓRIO)

Crie um arquivo `.env` na raiz do projeto backend:

```bash
cd precificapro-api
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```bash
# Banco de dados
DB_PASSWORD=sua_senha_forte_aqui

# JWT (mínimo 32 caracteres)
JWT_SECRET_KEY=gere_uma_chave_secreta_aqui_minimo_32_chars

# Opcional - APIs externas
GEMINI_API_KEY=sua_chave_gemini
CLOUDINARY_API_KEY=sua_chave_cloudinary
```

**Gerar JWT Secret seguro:**
```bash
openssl rand -base64 32
```

### 2. Executar Migrations

As migrations (incluindo índices) rodam automaticamente:

```bash
./mvnw spring-boot:run
```

Você verá no log:
```
✅ Configurações de segurança validadas com sucesso
Flyway migration V13__add_performance_indexes.sql applied successfully
```

### 3. Verificar Monitoramento

Acesse os endpoints do Actuator:

- **Health:** http://localhost:8080/actuator/health
- **Métricas:** http://localhost:8080/actuator/metrics
- **Prometheus:** http://localhost:8080/actuator/prometheus
- **Info:** http://localhost:8080/actuator/info

### 4. Testar Cache

```bash
# 1ª chamada - vai ao banco de dados (lento)
curl http://localhost:8080/dashboard/metrics -H "Authorization: Bearer SEU_TOKEN"

# 2ª chamada - retorna do cache (rápido)
curl http://localhost:8080/dashboard/metrics -H "Authorization: Bearer SEU_TOKEN"
```

Veja no log:
```
Cache hit: dashboardMetrics
```

### 5. Usar Endpoint Paginado

```bash
# Produtos paginados - página 0, 20 itens, ordenado por nome
GET /products/paginated?page=0&size=20&sortBy=name&sortDirection=ASC

# Resposta:
{
  "content": [...], // 20 produtos
  "totalElements": 150,
  "totalPages": 8,
  "number": 0,
  "size": 20
}
```

---

## 🎨 FRONTEND - CONFIGURAÇÃO INICIAL

### 1. Instalar Dependências

```bash
cd precificapro-frontend
npm install
```

O React Query já foi adicionado ao `package.json`.

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Iniciar Desenvolvimento

```bash
npm run dev
```

### 4. Verificar React Query DevTools

Abra http://localhost:5173 e veja:
- Canto inferior direito: ícone do React Query 🔍
- Clique para abrir DevTools
- Veja queries, cache, e estados

### 5. Usar Hooks Customizados

**DashboardPage (já implementado):**
```typescript
import { useDashboard } from '@/hooks/useDashboard';

export const DashboardPage = () => {
  const { data: stats, isLoading, error } = useDashboard();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{/* usar stats */}</div>;
};
```

**ProductsPage (para refatorar):**
```typescript
import { useProducts, useCreateProduct, useDeleteProduct } from '@/hooks/useProducts';

export const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();
  
  const handleCreate = async (data: ProductData) => {
    await createMutation.mutateAsync(data);
    // Cache invalidado automaticamente!
  };
  
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };
  
  // Sem useState, sem useEffect, cache automático!
  return (
    <div>
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};
```

---

## 🐳 DOCKER - USO RÁPIDO

### 1. Configurar Ambiente

Na **raiz do projeto** (não dentro de backend ou frontend):

```bash
cp .env.example .env
```

Edite com suas credenciais:
```bash
DB_PASSWORD=senha_segura_aqui
JWT_SECRET_KEY=sua_chave_jwt_32_chars_minimo
```

### 2. Subir Containers

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta 5432
- API Spring Boot na porta 8080

### 3. Verificar Status

```bash
docker-compose ps
docker-compose logs -f api
```

### 4. Acessar Banco de Dados

```bash
docker exec -it precificapro-postgres psql -U postgres_user -d precificapro_db
```

### 5. Parar Containers

```bash
docker-compose down
```

Manter dados:
```bash
docker-compose down  # volumes persistem
```

Limpar tudo:
```bash
docker-compose down -v  # remove volumes
```

---

## 🔍 MONITORAMENTO EM PRODUÇÃO

### Prometheus + Grafana (Opcional)

Adicione ao `docker-compose.yml`:

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  depends_on:
    - prometheus
```

Crie `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'precificapro-api'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['api:8080']
```

---

## 📊 VERIFICAR MELHORIAS DE PERFORMANCE

### 1. Cache Hit Rate

```bash
curl http://localhost:8080/actuator/metrics/cache.gets?tag=result:hit
curl http://localhost:8080/actuator/metrics/cache.gets?tag=result:miss
```

### 2. Tempo de Resposta

```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/products
```

Crie `curl-format.txt`:
```
time_total: %{time_total}s
```

### 3. Queries ao Banco (Log)

Habilite no `application.properties`:
```properties
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
```

Veja queries no log e confirme que N+1 foi eliminado.

---

## 🧪 TESTAR PAGINAÇÃO

### Backend

```bash
# Produtos - página 0
curl "http://localhost:8080/products/paginated?page=0&size=10" \
  -H "Authorization: Bearer TOKEN"

# Produtos - página 1, ordenado por SKU descendente
curl "http://localhost:8080/products/paginated?page=1&size=10&sortBy=sku&sortDirection=DESC" \
  -H "Authorization: Bearer TOKEN"
```

### Frontend (quando implementar)

```typescript
// Adicionar estado de paginação
const [page, setPage] = useState(0);
const { data: productsPage } = useProductsPaginated(page, 20);

// Navegar
<button onClick={() => setPage(p => p + 1)}>Próxima</button>
```

---

## ⚡ DICAS DE PERFORMANCE

### Backend

1. **Monitor cache hit rate** - deve ser > 80%
2. **Usar paginação** em produção (nunca endpoint sem paginação)
3. **Índices** - verificar com `EXPLAIN ANALYZE` queries lentas
4. **Connection pool** - ajustar se necessário:
   ```properties
   spring.datasource.hikari.maximum-pool-size=10
   spring.datasource.hikari.minimum-idle=5
   ```

### Frontend

1. **React Query DevTools** - verificar cache entre navegações
2. **Network tab** - deve ver menos chamadas API com cache
3. **Lazy load** - implementar para bundle menor
4. **Lighthouse** - rodar para métricas

---

## 🐛 TROUBLESHOOTING

### "DB_PASSWORD obrigatória!"

**Problema:** Variável de ambiente não configurada.

**Solução:**
```bash
export DB_PASSWORD=sua_senha
# ou criar arquivo .env
```

### Cache não funciona

**Problema:** Pode não estar configurado corretamente.

**Verificar:**
```bash
# Ver caches disponíveis
curl http://localhost:8080/actuator/caches

# Ver estatísticas
curl http://localhost:8080/actuator/metrics/cache.size
```

### React Query não atualiza

**Problema:** Cache stale.

**Solução:**
```typescript
// Invalidar manualmente
queryClient.invalidateQueries({ queryKey: ['products'] });

// Ou refetch
queryClient.refetchQueries({ queryKey: ['products'] });
```

### Docker não inicia

**Problema:** Porta em uso ou credenciais erradas.

**Solução:**
```bash
# Ver logs
docker-compose logs

# Verificar portas
lsof -i :8080
lsof -i :5432

# Recriar
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 RECURSOS ÚTEIS

- **Spring Cache:** https://docs.spring.io/spring-framework/reference/integration/cache.html
- **React Query:** https://tanstack.com/query/latest/docs/framework/react/overview
- **Caffeine Cache:** https://github.com/ben-manes/caffeine
- **Spring Actuator:** https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
- **Docker Compose:** https://docs.docker.com/compose/

---

## ✅ CHECKLIST FINAL

Antes de considerar completo:

- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação inicia sem erros
- [ ] Endpoints de health respondem
- [ ] Cache funcionando (verificar hit rate)
- [ ] Paginação testada
- [ ] React Query cache visível no DevTools
- [ ] Docker compose up funciona
- [ ] Migrations aplicadas (V13)
- [ ] Testes básicos criados
- [ ] Documentação atualizada

🎉 Pronto para produção quando checklist 100%!
