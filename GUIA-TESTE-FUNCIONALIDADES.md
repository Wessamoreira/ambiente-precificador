# 🧪 Guia de Testes - Funcionalidades Implementadas

**Data**: 08/10/2025  
**Objetivo**: Guia passo a passo para testar todas as funcionalidades implementadas

---

## 🚀 Pré-requisitos

```bash
# 1. Backend rodando
cd precificapro-api
./mvnw spring-boot:run

# 2. Frontend rodando
cd precificapro-frontend
npm run dev

# 3. URLs:
Backend: http://localhost:8080
Frontend: http://localhost:5173
Swagger: http://localhost:8080/swagger-ui/index.html
```

---

## 1️⃣ TESTAR ENDPOINTS PUT

### 🔧 Teste 1.1: PricingProfile PUT (Novo)

**Via Swagger UI**:
```
1. Acessar: http://localhost:8080/swagger-ui/index.html
2. Autenticar-se (botão "Authorize")
3. Expandir seção "pricing-profiles"
4. Clicar em "POST /pricing-profiles" primeiro para criar um perfil
5. Copiar o ID do perfil criado
6. Clicar em "PUT /pricing-profiles/{id}"
7. Colar o ID
8. Body de exemplo:
{
  "name": "Perfil Premium Atualizado",
  "description": "Perfil para produtos premium",
  "method": "MARKUP",
  "markup": 60.0,
  "marginOnPrice": null,
  "taxPercentage": 15.0,
  "additionalCost": 5.0
}
9. Clicar em "Execute"
10. Verificar response 200 OK
```

**Via Frontend**:
```
1. Acessar: http://localhost:5173/pricing-profiles
2. Criar um perfil
3. Clicar em "Editar" no perfil criado
4. Alterar valores (ex: mudar markup de 50% para 60%)
5. Salvar
6. Verificar se os valores foram atualizados
```

### 🔧 Teste 1.2: CostItems PUT

**Via Frontend**:
```
1. Acessar: http://localhost:5173/cost-items
2. Criar um custo fixo (ex: "Aluguel", R$ 2000)
3. Clicar em "Editar"
4. Alterar valor para R$ 2500
5. Salvar
6. Verificar se o valor foi atualizado na lista
```

### 🔧 Teste 1.3: Products PUT

**Via Frontend**:
```
1. Acessar: http://localhost:5173/products
2. Criar ou selecionar um produto existente
3. Clicar em "Editar"
4. Alterar nome, preço ou categoria
5. Salvar
6. Verificar se as alterações aparecem na lista
```

---

## 2️⃣ TESTAR PÁGINA DE CATEGORIAS

### 🎨 Teste 2.1: Design e Visual

```
1. Acessar: http://localhost:5173/categories
2. Verificar:
   ✅ Cards têm efeito glassmorphism (transparente/blur)?
   ✅ Ao passar mouse, card aumenta de tamanho (scale)?
   ✅ Ícone de olho (Eye) aparece no canto superior direito?
   ✅ Título da categoria muda para cor cyan?
   ✅ Cada categoria tem cor diferente?
   ✅ Contador de produtos está correto?
```

### 🎨 Teste 2.2: Funcionalidade do Modal

```
1. Na página de categorias
2. Clicar em qualquer card de categoria (NÃO nos botões editar/deletar)
3. Verificar se modal abre
4. Verificar conteúdo do modal:
   ✅ Título mostra nome da categoria?
   ✅ Contador de produtos está correto?
   ✅ Lista de produtos aparece?
   ✅ Produtos mostram: imagem, nome, SKU, custo?
   ✅ Campo de busca funciona?
   ✅ Footer mostra total de produtos e custo total?
5. Digitar no campo de busca
6. Verificar se filtra os produtos em tempo real
7. Fechar modal (X ou clicar fora)
```

### 🎨 Teste 2.3: CRUD de Categorias

```
1. Clicar em "Nova Categoria"
2. Preencher:
   - Nome: "Eletrônicos"
   - Descrição: "Produtos eletrônicos"
   - Escolher cor (ex: Azul)
3. Salvar
4. Verificar se categoria aparece na lista
5. Clicar em "Editar" (botão azul)
6. Alterar nome para "Eletrônicos Premium"
7. Salvar
8. Verificar atualização
9. Click na categoria
10. Verificar se modal abre com produtos dessa categoria
```

---

## 3️⃣ TESTAR RANKING DE PRODUTOS

### 📊 Teste 3.1: Página de Ranking

```
1. Acessar: http://localhost:5173/sales/ranking
2. Verificar:
   ✅ Produtos ordenados por quantidade vendida?
   ✅ Top 3 tem troféus (ouro, prata, bronze)?
   ✅ Colunas visíveis: Posição, Produto, SKU, Qtd, Receita, Lucro, Margem?
   ✅ Botão "Ver Detalhes" visível em cada linha?
   ✅ Cores corretas:
      - Margem > 30% = verde
      - Margem 15-30% = amarelo
      - Margem < 15% = vermelho
```

### 📊 Teste 3.2: Busca no Ranking

```
1. Na página de ranking
2. Digitar nome de produto no campo de busca
3. Verificar se filtra em tempo real
4. Digitar SKU
5. Verificar se filtra por SKU também
6. Limpar busca
7. Verificar se volta a mostrar todos
```

### 📊 Teste 3.3: Modal de Detalhes do Produto

```
1. Na página de ranking
2. Clicar em "Ver Detalhes" de qualquer produto
3. Verificar abertura do modal
4. Verificar conteúdo:
   ✅ Título mostra nome do produto?
   ✅ Botões de período (7, 30, 60, 90 dias) visíveis?
   ✅ 3 cards de métricas:
      - Receita Total (verde)
      - Quantidade Vendida (cyan)
      - Média Diária (roxo)
   ✅ Gráfico de área aparece?
   ✅ Gráfico tem duas linhas:
      - Quantidade (cyan)
      - Receita (roxo)
   ✅ Tabela detalhada abaixo do gráfico?
```

### 📊 Teste 3.4: Seletor de Período

```
1. Com modal aberto
2. Clicar em "7 dias"
3. Verificar se gráfico atualiza (menos pontos)
4. Clicar em "60 dias"
5. Verificar se gráfico atualiza (mais pontos)
6. Clicar em "90 dias"
7. Verificar se gráfico atualiza
8. Voltar para "30 dias"
```

### 📊 Teste 3.5: Interações do Gráfico

```
1. Com modal e gráfico abertos
2. Passar mouse sobre os pontos do gráfico
3. Verificar se tooltip aparece mostrando:
   ✅ Data formatada (ex: "15 de out")
   ✅ Quantidade vendida
   ✅ Receita formatada (R$ X.XXX)
4. Scroll na tabela detalhada abaixo
5. Verificar dados dia a dia
```

### 📊 Teste 3.6: Responsividade Mobile

```
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Selecionar iPhone ou Galaxy S20
4. Verificar:
   ✅ Tabela vira cards?
   ✅ Cards têm todas as informações?
   ✅ Botão "Ver Detalhes e Gráfico" visível?
   ✅ Modal funciona no mobile?
   ✅ Gráfico responsivo?
```

---

## 4️⃣ TESTAR ALERTAS DE ESTOQUE

### 🔔 Teste 4.1: Preparação - Criar Produtos com Estoque Baixo

```
1. Acessar: http://localhost:5173/inventory
2. Selecionar um produto
3. Ajustar estoque para 0 (Saída)
4. Selecionar outro produto
5. Ajustar estoque para valor abaixo do mínimo (ex: 2 unidades se mínimo é 10)
```

### 🔔 Teste 4.2: Verificar Ícone de Notificação

```
1. Ir para qualquer página do sistema
2. Olhar no header (canto superior direito)
3. Verificar:
   ✅ Ícone de sino (bell) está visível?
   ✅ Badge vermelho com número aparece?
   ✅ Número do badge está correto (ex: "2")?
   ✅ Ícone está amarelo (indicando alerta)?
```

### 🔔 Teste 4.3: Abrir Dropdown de Alertas

```
1. Clicar no ícone do sino
2. Verificar abertura do dropdown
3. Verificar conteúdo:
   ✅ Título "Alertas de Estoque"?
   ✅ Texto mostra quantidade de produtos?
   ✅ Seção "Sem Estoque" (fundo vermelho)?
   ✅ Seção "Estoque Baixo" (fundo amarelo)?
   ✅ Produtos listados com:
      - Nome do produto
      - SKU
      - Quantidade atual
      - Mínimo (para estoque baixo)
```

### 🔔 Teste 4.4: Navegação via Alerta

```
1. Com dropdown aberto
2. Clicar em qualquer produto listado
3. Verificar:
   ✅ Dropdown fecha?
   ✅ Navega para página /inventory?
   ✅ Página de inventário abre?
```

### 🔔 Teste 4.5: Fechar Dropdown

```
1. Abrir dropdown de alertas
2. Clicar fora do dropdown
3. Verificar se fecha
4. Abrir novamente
5. Clicar no X (se houver)
6. Verificar se fecha
```

### 🔔 Teste 4.6: Estado Vazio

```
1. Ajustar todos os estoques para valores normais
2. Aguardar atualização automática (ou recarregar página)
3. Clicar no sino
4. Verificar:
   ✅ Ícone do sino está cinza (sem alerta)?
   ✅ Badge não aparece?
   ✅ Dropdown mostra "Todos os estoques estão OK!"?
   ✅ Ícone de pacote verde aparece?
```

### 🔔 Teste 4.7: Auto-atualização

```
1. Com página aberta
2. Em outra aba, ajustar estoque de um produto para 0
3. Aguardar 5 minutos (ou menos se configurado)
4. Verificar se badge atualiza automaticamente
```

---

## 5️⃣ TESTES DE INTEGRAÇÃO

### 🔗 Teste 5.1: Fluxo Completo de Categoria

```
1. Criar uma categoria "Notebooks"
2. Criar um produto "Notebook Dell" e vincular à categoria
3. Voltar para página de categorias
4. Verificar contador aumentou (1 produto)
5. Clicar na categoria "Notebooks"
6. Verificar se modal mostra o produto "Notebook Dell"
7. Criar mais 2 produtos nesta categoria
8. Voltar para categorias
9. Verificar contador (3 produtos)
10. Click na categoria
11. Verificar lista com 3 produtos no modal
```

### 🔗 Teste 5.2: Fluxo Completo de Vendas

```
1. Criar produto "Mouse Gamer" (R$ 50 custo, R$ 100 venda)
2. Registrar venda: 5 unidades
3. Registrar mais vendas em dias diferentes
4. Acessar /sales/ranking
5. Verificar se "Mouse Gamer" aparece no ranking
6. Clicar em "Ver Detalhes"
7. Verificar gráfico mostra evolução das vendas
8. Verificar métricas calculadas corretamente
```

### 🔗 Teste 5.3: Fluxo Completo de Estoque

```
1. Criar produto "Teclado Mecânico"
2. Definir estoque mínimo: 10 unidades
3. Ajustar estoque atual: 15 unidades
4. Verificar: SEM alerta no sino
5. Fazer saída de 12 unidades
6. Estoque fica em 3 unidades
7. Verificar: Badge amarelo aparece (estoque baixo)
8. Clicar no sino
9. Verificar "Teclado Mecânico" listado em "Estoque Baixo"
10. Fazer saída de 3 unidades
11. Estoque fica em 0
12. Verificar: Badge continua aparecendo
13. Clicar no sino
14. Verificar produto moveu para "Sem Estoque" (vermelho)
```

---

## 6️⃣ TESTES DE UX/UI

### 🎨 Teste 6.1: Responsividade

```
Testar em resoluções:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

Para cada resolução, verificar:
✅ Layout não quebra
✅ Textos legíveis
✅ Botões clicáveis
✅ Modais responsivos
✅ Tabelas viram cards no mobile
✅ Sem scroll horizontal
```

### 🎨 Teste 6.2: Animações

```
1. Navegar entre páginas
2. Verificar transições suaves
3. Abrir/fechar modais
4. Verificar animações de entrada/saída
5. Hover nos cards
6. Verificar efeitos de scale e cor
7. Scroll em listas longas
8. Verificar performance (sem lag)
```

### 🎨 Teste 6.3: Acessibilidade

```
1. Navegar usando apenas teclado (Tab)
2. Verificar foco visível
3. Apertar Enter em botões
4. Verificar se abre modais
5. Usar Esc para fechar modais
6. Verificar textos alternativos em ícones
7. Testar com leitor de tela (se possível)
```

---

## 7️⃣ TESTES DE ERRO

### ❌ Teste 7.1: Backend Offline

```
1. Parar o backend
2. Tentar criar categoria
3. Verificar mensagem de erro clara
4. Tentar acessar ranking
5. Verificar loading state ou erro
6. Reinicar backend
7. Verificar se reconecta automaticamente
```

### ❌ Teste 7.2: Dados Inválidos

```
1. Tentar criar categoria sem nome
2. Verificar validação frontend
3. Tentar criar produto com preço negativo
4. Verificar validação
5. Tentar criar perfil de precificação com markup nulo
6. Verificar erro do backend
```

### ❌ Teste 7.3: Permissões

```
1. Criar categoria com usuário A
2. Fazer login com usuário B
3. Tentar editar categoria de A
4. Verificar erro 403 ou 404
5. Verificar que B só vê suas próprias categorias
```

---

## 📊 CHECKLIST FINAL

### Backend
- [ ] Todos os endpoints PUT funcionando
- [ ] Validações retornam erros claros
- [ ] Ownership verificado em todos endpoints
- [ ] Swagger UI acessível e atualizado

### Frontend - Categorias
- [ ] Design moderno (glassmorphism)
- [ ] Hover effects funcionando
- [ ] Modal abre ao clicar
- [ ] Modal mostra produtos corretos
- [ ] Busca funciona
- [ ] CRUD completo funciona

### Frontend - Ranking
- [ ] Tabela ordenada corretamente
- [ ] Troféus no top 3
- [ ] Botão "Ver Detalhes" funciona
- [ ] Modal abre com gráfico
- [ ] Seletor de período funciona
- [ ] Gráfico renderiza corretamente
- [ ] Tabela detalhada visível
- [ ] Responsivo no mobile

### Frontend - Alertas
- [ ] Ícone visível no header
- [ ] Badge com contador aparece
- [ ] Dropdown abre ao clicar
- [ ] Produtos listados corretamente
- [ ] Categorização (sem/baixo) funciona
- [ ] Click no produto navega
- [ ] Fecha ao clicar fora
- [ ] Estado vazio funciona

### Integração
- [ ] Backend ↔ Frontend sincronizados
- [ ] Autenticação funcionando
- [ ] Dados persistem corretamente
- [ ] Performance adequada

---

## 🚨 PROBLEMAS CONHECIDOS E SOLUÇÕES

### Problema: Modal não abre

**Solução**:
```bash
# Limpar cache e reinstalar
cd precificapro-frontend
rm -rf node_modules
npm install
npm run dev
```

### Problema: Gráfico não renderiza

**Solução**:
```bash
# Verificar se recharts está instalado
npm list recharts

# Se não estiver:
npm install recharts
```

### Problema: Badge de alerta não aparece

**Solução**:
```bash
# Verificar se há produtos com estoque baixo no banco
# Verificar endpoint no backend:
curl http://localhost:8080/inventory/low-stock
```

### Problema: Endpoint PUT retorna 404

**Solução**:
```bash
# Reiniciar backend com clean
cd precificapro-api
./mvnw clean install
./mvnw spring-boot:run
```

---

## 📞 SUPORTE

Se algum teste falhar:

1. **Verificar logs do backend**: Console onde o Spring Boot está rodando
2. **Verificar console do navegador**: F12 → Console
3. **Verificar Network tab**: F12 → Network para ver requests
4. **Verificar arquivo**: `RELATORIO-VERIFICACAO-COMPLETA.md` para mais detalhes

---

**Documento criado**: 08/10/2025  
**Versão**: 1.0  
**Status**: ✅ Pronto para uso
