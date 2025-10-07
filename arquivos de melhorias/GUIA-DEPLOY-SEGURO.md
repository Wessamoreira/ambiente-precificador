# 🚀 Guia de Deploy Seguro - PrecificaPro API

## 📋 Pré-requisitos

- Java 17+
- PostgreSQL 14+
- Maven 3.8+
- Servidor com HTTPS configurado

---

## 🔐 Configuração de Produção

### 1. Variáveis de Ambiente Obrigatórias

```bash
# Database
export DB_HOST=seu-db-host.com
export DB_PORT=5432
export DB_NAME=precificapro_prod
export DB_USERNAME=precificapro_user
export DB_PASSWORD=senha-super-segura-aqui

# JWT (GERAR CHAVE FORTE!)
export JWT_SECRET_KEY=$(openssl rand -base64 64)
export JWT_EXPIRATION_MS=3600000
export JWT_REFRESH_EXPIRATION_MS=86400000

# APIs Externas
export GEMINI_API_KEY=sua-api-key
export CLOUDINARY_CLOUD_NAME=seu-cloud-name
export CLOUDINARY_API_KEY=sua-key
export CLOUDINARY_API_SECRET=seu-secret

# CORS
export CORS_ALLOWED_ORIGINS=https://seuapp.com,https://www.seuapp.com

# Rate Limiting
export RATE_LIMIT_ENABLED=true
export RATE_LIMIT_MAX_REQUESTS=100
export RATE_LIMIT_DURATION=60
```

### 2. Build da Aplicação

```bash
# Limpar e compilar
./mvnw clean package -DskipTests

# Ou com testes
./mvnw clean package
```

### 3. Deploy com Docker

```dockerfile
# Dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build
docker build -t precificapro-api:latest .

# Run com variáveis de ambiente
docker run -d \
  -p 8080:8080 \
  -e DB_HOST=postgres-host \
  -e DB_PASSWORD=senha-segura \
  -e JWT_SECRET_KEY=chave-secreta \
  --name precificapro-api \
  precificapro-api:latest
```

### 4. Deploy com Kubernetes

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: precificapro-secrets
type: Opaque
stringData:
  DB_PASSWORD: senha-segura
  JWT_SECRET_KEY: chave-jwt-secreta
  GEMINI_API_KEY: api-key
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: precificapro-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: precificapro-api:latest
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: precificapro-secrets
              key: DB_PASSWORD
```

---

## 🛡️ Checklist de Segurança para Produção

- [ ] HTTPS obrigatório (sem HTTP)
- [ ] JWT secret key forte (mínimo 64 caracteres)
- [ ] Credenciais em variáveis de ambiente
- [ ] Database com usuário de privilégios limitados
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] Rate limiting ativado
- [ ] Logs de auditoria habilitados
- [ ] Backup automático do banco de dados
- [ ] Monitoramento de segurança ativo
- [ ] Testes de penetração realizados

---

## 📊 Monitoramento

### Logs importantes:
```bash
# Verificar logs da aplicação
tail -f /var/log/precificapro/app.log

# Filtrar por segurança
grep "SECURITY" /var/log/precificapro/app.log

# Tentativas de login falhadas
grep "Bad credentials" /var/log/precificapro/app.log
```

### Alertas recomendados:
1. Múltiplas tentativas de login falhadas
2. Rate limit excedido
3. Erros 500 em sequência
4. Refresh tokens expirados não limpos

---

## 🔄 Manutenção

### Limpeza de tokens expirados (cronjob):
```sql
-- Executar diariamente
DELETE FROM refresh_tokens WHERE expires_at < NOW();
DELETE FROM audit_logs WHERE timestamp < NOW() - INTERVAL '90 days';
```

### Rotação de chaves JWT:
1. Gerar nova chave
2. Atualizar variável de ambiente
3. Reiniciar aplicação
4. Invalidar tokens antigos

---

## 📞 Suporte

Para dúvidas de segurança: security@precificapro.com
