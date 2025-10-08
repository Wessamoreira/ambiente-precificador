# ✅ CHECKLIST DE DEPLOY - PRECIFICAPRO

Use este checklist para garantir que tudo está funcionando corretamente.

---

## 📋 PRÉ-DEPLOY

### Preparação Local

- [ ] Backend compila sem erros
  ```bash
  cd precificapro-api
  ./mvnw clean package -DskipTests
  ```

- [ ] Frontend builda sem erros
  ```bash
  cd precificapro-frontend
  npm run build
  ```

- [ ] Migrations Flyway validadas
  ```bash
  cd precificapro-api
  ./mvnw flyway:validate
  ```

- [ ] Dockerfile testado localmente
  ```bash
  cd precificapro-api
  docker build -t precificapro-api .
  docker run -p 8080:8080 precificapro-api
  ```

- [ ] Git repositório criado e atualizado
  ```bash
  git status
  git push origin main
  ```

### Credenciais Preparadas

- [ ] Gemini API Key obtida
- [ ] Cloudinary configurado (cloud_name, api_key, api_secret)
- [ ] JWT Secret gerado (64+ caracteres)
- [ ] Google Drive (opcional) configurado

---

## 🗄️ BANCO DE DADOS (RENDER)

### Criação

- [ ] PostgreSQL criado no Render
- [ ] Nome: `precificapro-db`
- [ ] User: `precificapro_user`
- [ ] Region: Oregon (US West)
- [ ] Plan: Free

### Validação

- [ ] Status: Available
- [ ] Internal Database URL copiada
- [ ] Conexão testada (opcional)

---

## 🔧 BACKEND (RENDER)

### Configuração

- [ ] Web Service criado
- [ ] Nome: `precificapro-api`
- [ ] Runtime: Docker
- [ ] Root Directory: `precificapro-api`
- [ ] Branch: `main`
- [ ] Plan: Free

### Variáveis de Ambiente

- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `DATABASE_URL` (do PostgreSQL)
- [ ] `JWT_SECRET_KEY` (64+ caracteres)
- [ ] `JWT_EXPIRATION_MS=3600000`
- [ ] `JWT_REFRESH_EXPIRATION_MS=86400000`
- [ ] `GEMINI_API_KEY`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `CORS_ALLOWED_ORIGINS` (atualizar depois)
- [ ] `RATE_LIMIT_ENABLED=true`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `RATE_LIMIT_DURATION=60`

### Deploy

- [ ] Build iniciado
- [ ] Build completo sem erros
- [ ] Service status: Live
- [ ] URL anotada: `https://precificapro-api.onrender.com`

### Validação Backend

```bash
# Health Check
curl https://precificapro-api.onrender.com/actuator/health
# Esperado: {"status":"UP"}
```

- [ ] Health check OK
- [ ] Swagger UI acessível
  ```
  https://precificapro-api.onrender.com/swagger-ui.html
  ```
- [ ] Logs sem erros críticos

---

## 🎨 FRONTEND (NETLIFY)

### Configuração

- [ ] Site criado
- [ ] Base directory: `precificapro-frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `precificapro-frontend/dist`
- [ ] Branch: `main`

### Variáveis de Ambiente

- [ ] `VITE_API_BASE_URL` (URL do backend Render)
- [ ] `VITE_ENV=production`

### Deploy

- [ ] Build iniciado
- [ ] Build completo sem erros
- [ ] Site status: Published
- [ ] URL anotada: `https://seu-app.netlify.app`

### Validação Frontend

- [ ] Site carrega sem erros 404
- [ ] Console do browser sem erros (F12)
- [ ] CSS carregado corretamente
- [ ] Rota `/` funciona
- [ ] Rota `/login` funciona

---

## 🔄 INTEGRAÇÃO

### Atualizar CORS

- [ ] Voltar ao Render → precificapro-api
- [ ] Environment → `CORS_ALLOWED_ORIGINS`
- [ ] Atualizar com URL do Netlify
- [ ] Save → Aguardar redeploy
- [ ] Validar CORS funcionando

---

## ✅ TESTES FUNCIONAIS

### Autenticação

- [ ] Página de registro carrega
- [ ] Criar novo usuário
- [ ] Login com usuário criado
- [ ] Token JWT recebido
- [ ] Redirecionamento para dashboard

### Categorias

- [ ] Listar categorias (vazio inicialmente)
- [ ] Criar nova categoria
- [ ] Categoria aparece na lista
- [ ] Editar categoria
- [ ] Deletar categoria

### Produtos

- [ ] Listar produtos (vazio inicialmente)
- [ ] Criar produto simples (sem imagem)
- [ ] Produto aparece na lista
- [ ] Criar produto com imagem
- [ ] Upload de imagem funcionando (Cloudinary)
- [ ] Imagem exibida no produto
- [ ] Editar produto
- [ ] Deletar produto

### AI (Gemini)

- [ ] Endpoint `/api/ai/analyze` acessível
- [ ] Análise de precificação retorna dados
- [ ] Response time aceitável

### Dashboard

- [ ] Dashboard carrega
- [ ] Gráficos renderizam
- [ ] Métricas exibidas corretamente
- [ ] Cards com estatísticas OK

### Performance

- [ ] Primeira carga < 3s (após cold start)
- [ ] Navegação entre páginas suave
- [ ] Sem memory leaks no console
- [ ] Responsivo mobile OK

---

## 📊 MONITORAMENTO

### Render Metrics

- [ ] CPU usage < 80%
- [ ] Memory usage < 400MB
- [ ] Request rate monitorado
- [ ] Logs configurados

### Netlify Analytics

- [ ] Deploy bem-sucedido
- [ ] Bandwidth usage monitorado
- [ ] Build time < 5min

---

## 🚨 TROUBLESHOOTING

### Se algo falhar:

#### Backend não inicia
1. Verificar logs no Render
2. Validar DATABASE_URL
3. Verificar variáveis de ambiente
4. Testar conexão com banco

#### Frontend não conecta
1. Verificar CORS no backend
2. Validar VITE_API_BASE_URL
3. Verificar network tab (F12)
4. Testar endpoints direto (curl)

#### CORS Error
1. CORS_ALLOWED_ORIGINS correto?
2. URL tem https?
3. URL sem / no final?
4. Backend redeploy após mudança?

#### Cold Start lento
- Normal no Render free tier
- Primeira request após sleep: 30-60s
- Considerar upgrade ou aceitar limitação

---

## 🎉 DEPLOY COMPLETO!

Se todos os itens estão marcados, parabéns! 🚀

### URLs de Produção

```
Backend: https://precificapro-api.onrender.com
Swagger: https://precificapro-api.onrender.com/swagger-ui.html
Frontend: https://seu-app.netlify.app
```

### Próximos Passos

1. Monitorar aplicação por 24h
2. Configurar domínio personalizado
3. Adicionar analytics
4. Performance tuning
5. SEO optimization

---

**Data de Deploy**: ___/___/______
**Deployed by**: __________________
**Status**: ⬜ Em andamento | ⬜ Concluído | ⬜ Com problemas
