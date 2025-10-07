# 📊 API de Histórico de Preços - Documentação

**Data:** 06/10/2025  
**Versão:** 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Endpoints](#endpoints)
3. [Exemplos de Uso](#exemplos-de-uso)
4. [Testes com Postman](#testes-com-postman)

---

## 🎯 Visão Geral

A API de Histórico de Preços permite:
- ✅ Rastrear automaticamente cada simulação de preço
- ✅ Visualizar evolução de preços ao longo do tempo
- ✅ Comparar preços entre períodos
- ✅ Obter estatísticas e alertas de variação

### Base URL
```
http://localhost:8080
```

### Autenticação
Todos os endpoints requerem autenticação via **JWT Token** no header:
```
Authorization: Bearer {seu_token_jwt}
```

---

## 🔌 Endpoints

### 1. Listar Histórico de Preços

```http
GET /products/{productId}/price-history
```

**Descrição:** Retorna o histórico paginado de preços e simulações de um produto.

**Parâmetros de Query:**
| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `startDate` | DateTime | Não | - | Data inicial (ISO 8601) |
| `endDate` | DateTime | Não | - | Data final (ISO 8601) |
| `page` | Integer | Não | 0 | Número da página |
| `size` | Integer | Não | 20 | Tamanho da página |

**Exemplo de Request:**
```bash
curl -X GET "http://localhost:8080/products/123e4567-e89b-12d3-a456-426614174000/price-history?page=0&size=10" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Exemplo de Response (200 OK):**
```json
{
  "content": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "productId": "123e4567-e89b-12d3-a456-426614174000",
      "productName": "Produto Exemplo",
      "suggestedPrice": 150.00,
      "actualPrice": null,
      "pricingProfileId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "pricingProfileName": "Perfil Padrão",
      "costs": {
        "purchaseCost": 50.00,
        "packagingCost": 10.00,
        "otherVariableCost": 5.00,
        "freightCostUnit": 3.50,
        "directCostUnit": 68.50,
        "indirectCostUnit": 15.00,
        "totalCostUnit": 83.50,
        "feesValue": 15.00,
        "costPlusFees": 98.50
      },
      "profit": {
        "netProfitPerUnit": 51.50,
        "netProfitPercentage": 34.33,
        "markupApplied": 79.64,
        "marginOnPrice": 54.33
      },
      "createdAt": "2025-10-06T10:30:00Z",
      "createdBy": "usuario@email.com",
      "notes": null
    }
  ],
  "totalElements": 45,
  "totalPages": 5,
  "size": 10,
  "number": 0
}
```

---

### 2. Evolução de Preços (Gráfico)

```http
GET /products/{productId}/price-history/evolution
```

**Descrição:** Retorna dados de evolução de preços para visualização em gráficos.

**Parâmetros de Query:**
| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `days` | Integer | Não | 30 | Número de dias para análise |

**Exemplo de Request:**
```bash
curl -X GET "http://localhost:8080/products/123e4567-e89b-12d3-a456-426614174000/price-history/evolution?days=30" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Exemplo de Response (200 OK):**
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "productName": "Produto Exemplo",
  "period": {
    "start": "2025-09-06",
    "end": "2025-10-06",
    "days": 30
  },
  "dataPoints": [
    {
      "date": "2025-09-06",
      "suggestedPrice": 120.00,
      "actualPrice": null,
      "profitMargin": 25.50,
      "pricingProfile": "Perfil Padrão"
    },
    {
      "date": "2025-09-13",
      "suggestedPrice": 125.00,
      "actualPrice": null,
      "profitMargin": 26.00,
      "pricingProfile": "Perfil Padrão"
    },
    {
      "date": "2025-09-20",
      "suggestedPrice": 135.00,
      "actualPrice": null,
      "profitMargin": 28.50,
      "pricingProfile": "Perfil Premium"
    },
    {
      "date": "2025-10-06",
      "suggestedPrice": 150.00,
      "actualPrice": null,
      "profitMargin": 34.33,
      "pricingProfile": "Perfil Padrão"
    }
  ],
  "statistics": {
    "minPrice": 120.00,
    "maxPrice": 150.00,
    "avgPrice": 132.50,
    "avgMargin": 28.58,
    "priceVariation": 25.00,
    "trend": "INCREASING",
    "totalRecords": 4
  }
}
```

---

### 3. Comparação de Preços

```http
GET /products/{productId}/price-history/comparison
```

**Descrição:** Compara preços e métricas entre duas datas específicas.

**Parâmetros de Query:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `date1` | Date | **Sim** | Primeira data (YYYY-MM-DD) |
| `date2` | Date | **Sim** | Segunda data (YYYY-MM-DD) |

**Exemplo de Request:**
```bash
curl -X GET "http://localhost:8080/products/123e4567-e89b-12d3-a456-426614174000/price-history/comparison?date1=2025-09-01&date2=2025-10-01" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Exemplo de Response (200 OK):**
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "productName": "Produto Exemplo",
  "period1": {
    "date": "2025-09-01",
    "price": 120.00,
    "profitMargin": 25.00,
    "totalCost": 90.00,
    "pricingProfile": "Perfil Padrão"
  },
  "period2": {
    "date": "2025-10-01",
    "price": 150.00,
    "profitMargin": 34.33,
    "totalCost": 98.50,
    "pricingProfile": "Perfil Padrão"
  },
  "changes": {
    "priceChange": 30.00,
    "priceChangePercentage": 25.00,
    "marginChange": 9.33,
    "marginChangePercentage": null,
    "costChange": 8.50,
    "costChangePercentage": null,
    "analysis": "Aumento significativo de preço (25.0%)"
  }
}
```

---

### 4. Estatísticas de Preços

```http
GET /products/{productId}/price-history/statistics
```

**Descrição:** Retorna estatísticas gerais, tendências e alertas do histórico de preços.

**Exemplo de Request:**
```bash
curl -X GET "http://localhost:8080/products/123e4567-e89b-12d3-a456-426614174000/price-history/statistics" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Exemplo de Response (200 OK):**
```json
{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "productName": "Produto Exemplo",
  "currentPrice": 150.00,
  "minPrice": 100.00,
  "maxPrice": 180.00,
  "avgPrice": 135.50,
  "medianPrice": null,
  "currentMargin": 34.33,
  "avgMargin": 28.75,
  "minMargin": 20.00,
  "maxMargin": 40.00,
  "priceTrend": "INCREASING",
  "priceChangeLastMonth": 15.50,
  "priceChangeLastWeek": 5.25,
  "alerts": [
    {
      "type": "SUDDEN_CHANGE",
      "severity": "WARNING",
      "message": "Variação de preço maior que 20% nos últimos 7 dias",
      "value": 25.50
    }
  ],
  "totalRecords": 45,
  "firstRecordDate": "2025-08-01T10:00:00Z",
  "lastRecordDate": "2025-10-06T14:30:00Z"
}
```

---

## 📚 Exemplos de Uso

### Cenário 1: Ver evolução dos últimos 7 dias

```bash
# 1. Obter token (login)
TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"senha123"}' \
  | jq -r '.token')

# 2. Buscar evolução
curl -X GET "http://localhost:8080/products/{productId}/price-history/evolution?days=7" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Cenário 2: Comparar preço atual com mês anterior

```bash
DATA_ATUAL=$(date +%Y-%m-%d)
DATA_MES_ANTERIOR=$(date -v-1m +%Y-%m-%d)

curl -X GET "http://localhost:8080/products/{productId}/price-history/comparison?date1=$DATA_MES_ANTERIOR&date2=$DATA_ATUAL" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Cenário 3: Verificar estatísticas e alertas

```bash
curl -X GET "http://localhost:8080/products/{productId}/price-history/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🧪 Testes com Postman

### Importar Collection

1. Abra o Postman
2. Clique em **Import**
3. Cole este JSON:

```json
{
  "info": {
    "name": "PrecificaPro - Price History API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "1. Listar Histórico",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/products/{{product_id}}/price-history?page=0&size=20",
          "host": ["{{base_url}}"],
          "path": ["products", "{{product_id}}", "price-history"],
          "query": [
            {"key": "page", "value": "0"},
            {"key": "size", "value": "20"}
          ]
        }
      }
    },
    {
      "name": "2. Evolução de Preços (30 dias)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/products/{{product_id}}/price-history/evolution?days=30",
          "host": ["{{base_url}}"],
          "path": ["products", "{{product_id}}", "price-history", "evolution"],
          "query": [{"key": "days", "value": "30"}]
        }
      }
    },
    {
      "name": "3. Comparar Preços",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/products/{{product_id}}/price-history/comparison?date1=2025-09-01&date2=2025-10-01",
          "host": ["{{base_url}}"],
          "path": ["products", "{{product_id}}", "price-history", "comparison"],
          "query": [
            {"key": "date1", "value": "2025-09-01"},
            {"key": "date2", "value": "2025-10-01"}
          ]
        }
      }
    },
    {
      "name": "4. Estatísticas",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/products/{{product_id}}/price-history/statistics",
          "host": ["{{base_url}}"],
          "path": ["products", "{{product_id}}", "price-history", "statistics"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080"
    },
    {
      "key": "product_id",
      "value": "SEU_PRODUCT_ID_AQUI"
    },
    {
      "key": "jwt_token",
      "value": "SEU_TOKEN_AQUI"
    }
  ]
}
```

### Variáveis de Ambiente

Configure estas variáveis no Postman:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `base_url` | `http://localhost:8080` | URL base da API |
| `product_id` | `{seu_uuid}` | ID do produto para teste |
| `jwt_token` | `{seu_token}` | Token JWT obtido no login |

---

## 🔍 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| **200** | Sucesso - Dados retornados |
| **401** | Não autenticado - Token inválido ou ausente |
| **403** | Sem permissão - Produto não pertence ao usuário |
| **404** | Produto não encontrado |
| **500** | Erro interno do servidor |

---

## 💡 Dicas e Boas Práticas

### 1. Salvamento Automático
O histórico é salvo **automaticamente** toda vez que você faz uma simulação:

```http
POST /simulate
{
  "productId": "...",
  "profileId": "...",
  "override": { ... }
}
```
✅ Um registro de histórico é criado automaticamente após a simulação.

### 2. Análise de Tendências
Use o endpoint `/evolution` com diferentes períodos:
- **7 dias**: Tendência semanal
- **30 dias**: Tendência mensal
- **90 dias**: Tendência trimestral

### 3. Alertas
O endpoint `/statistics` retorna alertas automáticos:
- 🟡 **WARNING**: Variação > 20% ou margem < 15%
- 🔴 **ERROR**: Margem < 10%

### 4. Performance
- Use paginação (`page` e `size`) para grandes volumes
- Cache de 5 minutos nos endpoints de leitura
- Índices otimizados para queries por produto + data

---

## 📊 Integração com Frontend

### Exemplo React/TypeScript

```typescript
// api/priceHistoryService.ts
export const getPriceEvolution = async (productId: string, days: number = 30) => {
  const response = await api.get(
    `/products/${productId}/price-history/evolution?days=${days}`
  );
  return response.data;
};

// Componente
const PriceEvolutionChart = ({ productId }: Props) => {
  const [data, setData] = useState<PriceEvolutionDTO | null>(null);
  
  useEffect(() => {
    getPriceEvolution(productId, 30).then(setData);
  }, [productId]);
  
  if (!data) return <Loading />;
  
  return (
    <LineChart data={data.dataPoints}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line dataKey="suggestedPrice" stroke="#8884d8" />
    </LineChart>
  );
};
```

---

## 🐛 Troubleshooting

### Problema: Nenhum histórico retornado

**Causa:** Produto ainda não teve simulações.

**Solução:** Execute uma simulação primeiro via `POST /simulate`.

### Problema: Erro 401 Unauthorized

**Causa:** Token JWT inválido ou expirado.

**Solução:** Faça login novamente e obtenha um novo token.

### Problema: Dados de evolução vazios

**Causa:** Nenhuma simulação no período especificado.

**Solução:** Aumente o número de dias ou faça mais simulações.

---

## 📝 Changelog

### v1.0.0 - 06/10/2025
- ✨ Lançamento inicial da API de Histórico de Preços
- ✅ 4 endpoints principais
- ✅ Salvamento automático em simulações
- ✅ Estatísticas e alertas
- ✅ Suporte a paginação

---

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@precificapro.com
- 📚 Documentação: http://localhost:8080/swagger-ui.html
- 🐛 Issues: GitHub Issues

---

**Última Atualização:** 06/10/2025 13:30  
**Versão da API:** 1.0.0
