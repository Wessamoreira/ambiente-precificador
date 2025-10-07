# ⚡ EXECUTE ESTES COMANDOS - Correção Backup

## ✅ Todas as Correções Já Foram Aplicadas

**Problemas corrigidos:**
1. ✅ Foreign key `created_by_user_id` de BIGINT → UUID
2. ✅ Mapeamento de colunas JPA (s3_key, file_size, created_at, etc.)

---

## 🚀 Execute Estes 4 Comandos (Copy & Paste)

### 1. Limpar Flyway (Remover migration com falha)

```bash
psql -h localhost -U postgres_user -d precificapro_db -c "DELETE FROM flyway_schema_history WHERE version = '12'; DROP TABLE IF EXISTS backup_metadata CASCADE;"
```

**Vai pedir a senha do PostgreSQL** - Digite e pressione Enter.

---

### 2. Recompilar Projeto

```bash
cd /Users/macbook/Desktop/ambiente-procificador/precificapro-api && ./mvnw clean compile
```

Aguarde ~30 segundos...

---

### 3. Rodar Aplicação (PULANDO TESTES)

```bash
./mvnw spring-boot:run -DskipTests
```

**Vai iniciar mais rápido sem rodar os testes.**

---

### 4. Verificar Logs

Procure por estas mensagens de SUCESSO:

```
✅ Migrating schema "public" to version "12 - create backup metadata table"
✅ Successfully applied 1 migration
✅ Started PrecificaproApiApplication
```

**SEM ERROS!**

---

## 📋 Comandos em Sequência (Copie Tudo)

```bash
# 1. Limpar Flyway
psql -h localhost -U postgres_user -d precificapro_db -c "DELETE FROM flyway_schema_history WHERE version = '12'; DROP TABLE IF EXISTS backup_metadata CASCADE;"

# 2. Recompilar
cd /Users/macbook/Desktop/ambiente-procificador/precificapro-api
./mvnw clean compile

# 3. Rodar (pula testes)
./mvnw spring-boot:run -DskipTests
```

---

## ⚠️ Alternativa: Se não tiver psql instalado

Execute manualmente no pgAdmin, DBeaver ou similar:

```sql
-- Conectar ao banco: precificapro_db
-- Executar:

DELETE FROM flyway_schema_history WHERE version = '12';
DROP TABLE IF EXISTS backup_metadata CASCADE;
```

Depois execute os comandos 2 e 3.

---

## 🎯 Resultado Esperado

Após rodar os comandos, a aplicação deve:

1. ✅ Iniciar sem erros
2. ✅ Criar tabela `backup_metadata` corretamente
3. ✅ Aplicar migration V12 com sucesso
4. ✅ Estar pronta para usar o sistema de backup!

---

## 🔍 Como Testar Depois

```bash
# Obter token (substitua email/senha):
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha"}' \
  | jq -r '.token')

# Testar status do backup
curl http://localhost:8080/api/backups/status \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

**Execute os comandos acima e a aplicação iniciará corretamente!** ✅
