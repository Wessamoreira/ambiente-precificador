# 🔧 Correção do Erro de Migration

## ❌ Problema Identificado

A migration `V12__create_backup_metadata_table.sql` estava usando **BIGINT** para a foreign key `created_by_user_id`, mas a tabela `users` usa **UUID** como chave primária.

**Erro:**
```
ERROR: foreign key constraint "fk_backup_created_by" cannot be implemented
Detalhe: Key columns "created_by_user_id" and "id" are of incompatible types: bigint and uuid.
```

---

## ✅ Correção Aplicada

### 1. Migration SQL Corrigida
**Arquivo:** `V12__create_backup_metadata_table.sql`

**Antes:**
```sql
created_by_user_id BIGINT,
```

**Depois:**
```sql
created_by_user_id UUID,
```

### 2. Entity Java Atualizada
**Arquivo:** `BackupMetadata.java`

Adicionado import:
```java
import java.util.UUID;
```

---

## 🚀 Como Resolver (4 passos)

### Passo 1: Limpar Estado do Flyway

Execute o script SQL que criei:

```bash
psql -h localhost -U postgres_user -d precificapro_db -f fix-flyway-backup.sql
```

**OU manualmente no pgAdmin/DBeaver:**

```sql
-- Remover entrada com falha
DELETE FROM flyway_schema_history WHERE version = '12';

-- Limpar tabela criada parcialmente
DROP TABLE IF EXISTS backup_metadata CASCADE;
```

---

### Passo 2: Recompilar Projeto (IMPORTANTE!)

```bash
cd precificapro-api
./mvnw clean compile
```

Isso garante que:
- Migration SQL corrigida seja copiada para `target/classes/`
- Entity `BackupMetadata.java` seja recompilada com os mapeamentos corretos

---

### Passo 3: Rodar Testes (pula testes para iniciar mais rápido)

```bash
./mvnw spring-boot:run -DskipTests
```

**OU sem pular testes:**

```bash
./mvnw spring-boot:run
```

A migration V12 será executada novamente **COM TODAS AS CORREÇÕES**.

---

### Passo 4: Verificar Sucesso

Você deve ver nos logs:

```
✅ Successfully applied 1 migration to schema "public" (execution time 00:00.XXXs)
✅ Migration V12__create_backup_metadata_table.sql completed
```

---

## ✅ Verificar Se Funcionou

Após reiniciar, você deve ver nos logs:

```
✅ Migrating schema "public" to version "12 - create backup metadata table"
✅ Successfully applied 1 migration
```

**Sem erros!**

---

## 📋 Comandos Completos (Copy & Paste)

```bash
# 1. Limpar Flyway
psql -h localhost -U postgres_user -d precificapro_db -f fix-flyway-backup.sql

# 2. Recompilar
cd precificapro-api
./mvnw clean compile

# 3. Rodar
./mvnw spring-boot:run
```

---

## 🔍 Validar Tabela Criada

Após iniciar com sucesso:

```sql
-- Ver estrutura da tabela
\d backup_metadata

-- Deve mostrar:
-- created_by_user_id | uuid | (Não mais BIGINT!)
```

---

## ⚠️ Se Precisar Resetar Completamente

Se ainda houver problemas, pode resetar todo o Flyway (CUIDADO - apenas em desenvolvimento):

```sql
-- ATENÇÃO: Isso remove TODAS as migrations!
-- Use apenas se estiver em ambiente de desenvolvimento local

DROP TABLE flyway_schema_history CASCADE;
DROP TABLE backup_metadata CASCADE;

-- Depois reinicie a aplicação
-- Todas as migrations serão reaplicadas do zero
```

---

## ✅ Status da Correção

- [x] Migration SQL corrigida (BIGINT → UUID)
- [x] Entity Java atualizada (import UUID)
- [x] Entity Java - Mapeamento de colunas corrigido (s3_key, file_size, etc.)
- [x] Script de limpeza criado (`fix-flyway-backup.sql`)
- [x] Documentação criada (este arquivo)

**Próximo passo:** Execute os 3 comandos abaixo!

---

## 📞 Caso Persista o Erro

Se após executar os passos ainda houver erro, verifique:

1. **Senha do PostgreSQL:** O comando `psql` pedirá a senha
2. **Nome do usuário:** Confirme que é `postgres_user`
3. **Nome do banco:** Confirme que é `precificapro_db`

**Ou execute manualmente no pgAdmin/DBeaver:**
1. Conectar ao banco
2. Executar as queries do `fix-flyway-backup.sql`
3. Reiniciar Spring Boot

---

**Correção aplicada com sucesso!** 🎉
