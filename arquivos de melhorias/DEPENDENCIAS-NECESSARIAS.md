# 📦 Dependências Necessárias para Ativar Melhorias

## ⚠️ ATENÇÃO: Adicionar ao pom.xml

Para ativar as melhorias implementadas, adicione estas dependências ao `pom.xml`:

---

## 1. Bucket4j (Rate Limiting)

```xml
<dependency>
    <groupId>com.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.1.0</version>
</dependency>
```

**Habilita:**
- Rate Limiting (100 req/min por IP)
- Proteção contra DDoS
- Arquivos afetados:
  - `RateLimitingFilter.java`
  - `SecurityConfig.java` (linhas comentadas)

---

## 2. Spring Boot Actuator (Health Checks)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Habilita:**
- Health checks customizados
- Endpoints `/actuator/health`, `/actuator/metrics`
- Arquivos afetados:
  - `DatabaseHealthIndicator.java`
  - `CloudinaryHealthIndicator.java`

---

## 📝 Como Adicionar

1. Abra o arquivo `pom.xml`
2. Localize a seção `<dependencies>`
3. Adicione as dependências acima
4. Salve o arquivo
5. Execute: `mvn clean install`
6. Descomente os arquivos marcados com TODO

---

## 🔧 Arquivos para Descomentar Após Adicionar Dependências

### SecurityConfig.java
- Linha 4: `import com.precificapro.security.RateLimitingFilter;`
- Linha 34-35: `@Autowired private RateLimitingFilter rateLimitingFilter;`
- Linha 92: `.addFilterBefore(rateLimitingFilter, ...)`

### DatabaseHealthIndicator.java
- Linhas 5-6: imports de Health e HealthIndicator
- Linha 16: `implements HealthIndicator`
- Linha 21: `@Override`
- Linhas 24-44: código completo do método health()

### CloudinaryHealthIndicator.java
- Linhas 8-9: imports de Health e HealthIndicator
- Linha 18: `implements HealthIndicator`
- Linha 25: `@Override`
- Linhas 28-44: código completo do método health()

---

## ✅ Status Atual

### Funcionando SEM Dependências:
- ✅ Índices no DB (migrations aplicadas)
- ✅ Validação de senha forte
- ✅ Audit Logging (@Async)
- ✅ Paginação em endpoints

### Aguardando Dependências:
- ⏳ Rate Limiting (requer Bucket4j)
- ⏳ Health Checks (requer Actuator)

---

## 🚀 Após Adicionar

```bash
# 1. Rebuild
mvn clean install

# 2. Reiniciar aplicação

# 3. Testar health checks
curl http://localhost:8080/actuator/health

# 4. Testar rate limiting
for i in {1..105}; do curl http://localhost:8080/products; done
```

---

**Código está preparado, apenas aguardando dependências!**
