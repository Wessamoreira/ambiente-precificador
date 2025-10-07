# 🔒 Documentação de Segurança - PrecificaPro API

## ✅ Melhorias de Segurança Implementadas

### 1. **Proteção de Credenciais Sensíveis**

#### ❌ **ANTES:** Credenciais expostas no código
```properties
# application.properties (INSEGURO)
spring.datasource.password=your_super_secret_password_12345
gemini.api.key=AIzaSyC-_jGa3AvOZS_4mRLzU38H2srFiAYzaQk
cloudinary.api-secret=Pu2Ysw3PqWxYKzBQ10NayGyIC38
```

#### ✅ **AGORA:** Variáveis de ambiente
```properties
# application.properties (SEGURO)
spring.datasource.password=${DB_PASSWORD:default_fallback}
gemini.api.key=${GEMINI_API_KEY:}
cloudinary.api-secret=${CLOUDINARY_API_SECRET:}
```

**📋 Arquivo criado:** `.env.example` com instruções de configuração

**🔐 Como usar:**
1. Copie `.env.example` para `.env`
2. Configure suas credenciais reais no `.env`
3. O `.env` está no `.gitignore` e nunca será commitado

---

### 2. **Sistema de Roles e Permissões (RBAC)**

#### ✅ Implementado:
- **Enum `Role`**: `USER` e `ADMIN`
- **Tabela `user_roles`**: Relacionamento many-to-many
- **Autorização granular** com `@PreAuthorize` e `@EnableMethodSecurity`

#### Exemplo de uso:
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/admin/users/{id}")
public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
    // Apenas ADMINs podem acessar
}
```

**📋 Migração criada:** `V9__add_user_security_features.sql`

---

### 3. **Validação de Força de Senha**

#### ✅ Regras implementadas:
- ✔️ Mínimo 8 caracteres
- ✔️ Pelo menos 1 letra maiúscula
- ✔️ Pelo menos 1 letra minúscula
- ✔️ Pelo menos 1 número
- ✔️ Pelo menos 1 caractere especial (!@#$%^&*...)

#### Mensagens de erro:
```json
{
  "error": "Erro de negócio",
  "message": "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial"
}
```

---

### 4. **Proteção Contra Brute Force**

#### ✅ Implementado:
- **Bloqueio de conta** após 5 tentativas falhadas
- **Rastreamento de tentativas** com timestamp
- **Reset automático** de tentativas após login bem-sucedido
- **Listener de eventos** de autenticação

**📋 Classe:** `AuthenticationEventListener.java`

#### Fluxo:
1. Usuário erra senha → contador incrementa
2. Após 5 erros → conta bloqueada (`accountNonLocked = false`)
3. Login correto → contador reseta
4. Admin pode desbloquear manualmente

---

### 5. **Rate Limiting**

#### ✅ Implementado com Bucket4j:
- **100 requisições por minuto** por IP (configurável)
- **Filtro global** em todas as rotas (exceto Swagger)
- **Resposta HTTP 429** quando limite excedido

**📋 Configuração no `application.properties`:**
```properties
security.rate-limit.enabled=true
security.rate-limit.max-requests=100
security.rate-limit.duration-seconds=60
```

**📋 Classe:** `RateLimitingFilter.java`

#### Resposta ao exceder:
```json
{
  "error": "Limite de requisições excedido. Tente novamente mais tarde."
}
```

---

### 6. **Sistema de Refresh Tokens**

#### ✅ Implementado:
- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido por 24 horas
- **Revogação de tokens** no logout
- **Limpeza automática** de tokens expirados

**📋 Tabela criada:** `refresh_tokens`
**📋 Endpoints:**

```bash
# Login - recebe access + refresh token
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}

# Renovar access token
POST /auth/refresh
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}

# Logout (revoga refresh token)
POST /auth/logout
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 7. **Auditoria de Ações (Audit Log)**

#### ✅ Sistema de auditoria completo:
- **Logging assíncrono** para não impactar performance
- **Rastreamento de IP e User-Agent**
- **Ações auditadas:**
  - `USER_REGISTERED`
  - `PRODUCT_CREATED`
  - `PRODUCT_UPDATED`
  - `PRODUCT_DELETED`
  - (Adicione mais conforme necessário)

**📋 Tabela criada:** `audit_logs`
**📋 Classe:** `AuditLogService.java`

#### Estrutura do log:
```java
{
  "id": "uuid",
  "user": "user@example.com",
  "action": "PRODUCT_CREATED",
  "entityType": "Product",
  "entityId": "product-uuid",
  "details": "Produto criado: Notebook (SKU: NB-001)",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-10-07T15:30:00-03:00"
}
```

---

### 8. **Headers de Segurança HTTP**

#### ✅ Headers configurados:
- **X-Content-Type-Options**: `nosniff`
- **X-XSS-Protection**: `1; mode=block`
- **X-Frame-Options**: `DENY`
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains`

**📋 Configurado em:** `SecurityConfig.java`

---

### 9. **CORS Melhorado**

#### ✅ Configuração segura:
- **Origens permitidas**: Configurável via variável de ambiente
- **Métodos permitidos**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers permitidos**: Apenas necessários (Authorization, Content-Type, X-Requested-With)
- **Credentials**: Habilitado com segurança
- **Max Age**: 3600s (cache de preflight)

```properties
cors.allowed-origins=http://localhost:5173,https://meuapp.com
```

---

### 10. **Tratamento Global de Exceções**

#### ✅ Exceções customizadas:
- `ResourceNotFoundException` → 404
- `ResourceAlreadyExistsException` → 409
- `BusinessException` → 400
- `BadCredentialsException` → 401
- `AccessDeniedException` → 403
- `RateLimitExceededException` → 429

**📋 Classe:** `GlobalExceptionHandler.java`

#### Resposta padronizada:
```json
{
  "timestamp": "2025-10-07T15:30:00-03:00",
  "status": 404,
  "error": "Recurso não encontrado",
  "message": "Produto não encontrado.",
  "path": "/products/123"
}
```

#### Validação de DTOs:
```json
{
  "timestamp": "2025-10-07T15:30:00-03:00",
  "status": 400,
  "error": "Erro de validação",
  "message": "Dados inválidos fornecidos",
  "path": "/products",
  "validationErrors": {
    "name": "Nome não pode estar vazio",
    "sku": "SKU deve ter entre 3 e 50 caracteres"
  }
}
```

---

## 🚀 Como Executar com Segurança

### 1. **Configurar Variáveis de Ambiente**

#### Desenvolvimento (local):
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais
nano .env
```

#### Produção (Docker/Kubernetes):
```bash
# Docker
docker run -e DB_PASSWORD=secret -e JWT_SECRET_KEY=my-key ...

# Kubernetes
kubectl create secret generic app-secrets \
  --from-literal=DB_PASSWORD=secret \
  --from-literal=JWT_SECRET_KEY=my-key
```

### 2. **Executar Migrações do Flyway**

```bash
# As migrações rodam automaticamente ao iniciar a aplicação
./mvnw spring-boot:run

# Ou forçar manualmente
./mvnw flyway:migrate
```

### 3. **Testar Rate Limiting**

```bash
# Teste ultrapassar 100 requisições/min
for i in {1..110}; do
  curl -X GET http://localhost:8080/products
done

# Deve retornar 429 após 100 requisições
```

### 4. **Testar Refresh Token**

```bash
# 1. Login
ACCESS_TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"SecurePass123!"}' \
  | jq -r '.accessToken')

REFRESH_TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"SecurePass123!"}' \
  | jq -r '.refreshToken')

# 2. Usar refresh token para obter novo access token
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

---

## 📊 Checklist de Segurança

### ✅ Implementado:
- [x] Credenciais em variáveis de ambiente
- [x] Sistema de Roles e Permissões (RBAC)
- [x] Validação de força de senha
- [x] Proteção contra brute force (bloqueio de conta)
- [x] Rate Limiting por IP
- [x] Refresh Tokens
- [x] Auditoria de ações críticas
- [x] Headers de segurança HTTP
- [x] CORS configurado corretamente
- [x] Tratamento global de exceções
- [x] Logging de tentativas de acesso
- [x] Migrações de banco de dados seguras

### 🔄 Próximas Melhorias (Opcionais):
- [ ] Autenticação de dois fatores (2FA)
- [ ] Criptografia de dados sensíveis no banco
- [ ] Rate limiting por usuário (além de IP)
- [ ] Blacklist de tokens JWT
- [ ] Captcha em endpoints de login
- [ ] Política de expiração de senha
- [ ] Notificação de login suspeito
- [ ] IP Whitelisting para endpoints admin

---

## 🛡️ Boas Práticas Aplicadas

1. **Princípio do Menor Privilégio**: Usuários têm apenas permissões necessárias
2. **Defesa em Profundidade**: Múltiplas camadas de segurança
3. **Segurança por Design**: Segurança desde o início do desenvolvimento
4. **Fail Securely**: Falhas não expõem informações sensíveis
5. **Logging e Monitoramento**: Todas ações críticas são auditadas
6. **Input Validation**: Validação em todos os endpoints
7. **Stateless Authentication**: JWT sem estado no servidor
8. **Secrets Management**: Credenciais nunca no código

---

## 📝 Exemplos de Código

### Criar usuário com validação de senha:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "SecurePass123!"
  }'
```

### Login com auditoria:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SecurePass123!"
  }'
```

### Acessar recurso protegido:
```bash
curl -X GET http://localhost:8080/products \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🔍 Monitoramento de Segurança

### Consultar logs de auditoria:
```sql
-- Últimas ações do usuário
SELECT * FROM audit_logs 
WHERE user_id = 'user-uuid' 
ORDER BY timestamp DESC 
LIMIT 50;

-- Ações suspeitas (múltiplas tentativas falhadas)
SELECT user_id, COUNT(*) as attempts
FROM audit_logs
WHERE action = 'LOGIN_FAILED' 
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING COUNT(*) > 5;

-- Produtos deletados recentemente
SELECT * FROM audit_logs
WHERE action = 'PRODUCT_DELETED'
  AND timestamp > NOW() - INTERVAL '24 hours';
```

### Verificar contas bloqueadas:
```sql
SELECT id, email, failed_login_attempts, last_failed_login
FROM users
WHERE account_non_locked = false;
```

### Limpar refresh tokens expirados:
```sql
DELETE FROM refresh_tokens
WHERE expires_at < NOW();
```

---

## 🚨 Resposta a Incidentes

### Se detectar tentativa de ataque:
1. **Identificar origem**: Verificar IP nos logs de auditoria
2. **Bloquear temporariamente**: Adicionar IP no firewall
3. **Revisar logs**: Verificar padrão de ataque
4. **Notificar equipe**: Alertar time de segurança
5. **Documentar**: Registrar incidente e resposta

### Se conta comprometida:
1. **Bloquear usuário**: `UPDATE users SET enabled = false WHERE id = 'uuid'`
2. **Revogar tokens**: `DELETE FROM refresh_tokens WHERE user_id = 'uuid'`
3. **Forçar troca de senha**: Enviar email com link de reset
4. **Auditar ações**: Verificar `audit_logs` do usuário
5. **Notificar usuário**: Email sobre atividade suspeita

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Rate Limiting Strategies](https://cloud.google.com/architecture/rate-limiting-strategies)

---

**⚠️ IMPORTANTE:** Revise e ajuste as configurações de segurança conforme as necessidades específicas do seu ambiente de produção.
