#!/bin/bash

echo "🔍 DIAGNÓSTICO - Upload de Imagens Cloudinary"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar arquivo .env
echo "📋 1. Verificando arquivo .env..."
if [ -f "precificapro-api/.env" ]; then
    echo -e "${GREEN}✓ Arquivo .env existe${NC}"
    
    if grep -q "CLOUDINARY_CLOUD_NAME" precificapro-api/.env; then
        echo -e "${GREEN}✓ Variável CLOUDINARY_CLOUD_NAME encontrada${NC}"
    else
        echo -e "${RED}✗ Variável CLOUDINARY_CLOUD_NAME não encontrada${NC}"
    fi
    
    if grep -q "CLOUDINARY_API_KEY" precificapro-api/.env; then
        echo -e "${GREEN}✓ Variável CLOUDINARY_API_KEY encontrada${NC}"
    else
        echo -e "${RED}✗ Variável CLOUDINARY_API_KEY não encontrada${NC}"
    fi
    
    if grep -q "CLOUDINARY_API_SECRET" precificapro-api/.env; then
        echo -e "${GREEN}✓ Variável CLOUDINARY_API_SECRET encontrada${NC}"
    else
        echo -e "${RED}✗ Variável CLOUDINARY_API_SECRET não encontrada${NC}"
    fi
else
    echo -e "${RED}✗ Arquivo .env NÃO existe${NC}"
    echo -e "${YELLOW}  Crie: cp precificapro-api/.env.example precificapro-api/.env${NC}"
fi

echo ""

# 2. Verificar dependência Cloudinary no pom.xml
echo "📦 2. Verificando dependência Cloudinary..."
if grep -q "cloudinary-http44" precificapro-api/pom.xml; then
    echo -e "${GREEN}✓ Dependência cloudinary-http44 encontrada${NC}"
else
    echo -e "${RED}✗ Dependência cloudinary-http44 NÃO encontrada${NC}"
fi

echo ""

# 3. Verificar arquivos criados
echo "📂 3. Verificando arquivos criados..."

FILES=(
    "precificapro-api/src/main/java/com/precificapro/config/CloudinaryConfig.java"
    "precificapro-api/src/main/java/com/precificapro/service/CloudinaryImageService.java"
    "precificapro-api/src/main/java/com/precificapro/controller/ProductImageController.java"
    "precificapro-api/src/main/java/com/precificapro/domain/model/ProductImage.java"
    "precificapro-api/src/main/java/com/precificapro/domain/repository/ProductImageRepository.java"
    "precificapro-api/src/main/java/com/precificapro/exception/InvalidFileException.java"
    "precificapro-api/src/main/resources/db/migration/V4__add_product_images_table.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file (NÃO EXISTE)${NC}"
    fi
done

echo ""

# 4. Verificar se backend está rodando
echo "🚀 4. Verificando se backend está rodando..."
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -s http://localhost:8080/v3/api-docs > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend está rodando na porta 8080${NC}"
else
    echo -e "${YELLOW}⚠ Backend NÃO está rodando${NC}"
    echo -e "${YELLOW}  Inicie: cd precificapro-api && mvn spring-boot:run${NC}"
fi

echo ""

# 5. Verificar se banco de dados está acessível
echo "🗄️  5. Verificando banco de dados..."
if command -v psql > /dev/null 2>&1; then
    if psql -h localhost -p 5433 -U postgres_user -d precificapro_db -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Banco de dados acessível${NC}"
        
        # Verificar se a tabela product_images existe
        TABLE_EXISTS=$(psql -h localhost -p 5433 -U postgres_user -d precificapro_db -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_images');" 2>/dev/null)
        
        if [ "$TABLE_EXISTS" = "t" ]; then
            echo -e "${GREEN}✓ Tabela product_images existe${NC}"
        else
            echo -e "${YELLOW}⚠ Tabela product_images NÃO existe (migration não rodou)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Não foi possível conectar ao banco${NC}"
    fi
else
    echo -e "${YELLOW}⚠ psql não instalado (não foi possível verificar)${NC}"
fi

echo ""

# 6. Resumo
echo "📊 RESUMO"
echo "=============================================="
echo ""
echo "Para corrigir problemas:"
echo "1. Certifique-se que o .env tem as credenciais Cloudinary"
echo "2. Recompile: cd precificapro-api && mvn clean install"
echo "3. Inicie o backend: mvn spring-boot:run"
echo "4. Teste o upload pela interface em http://localhost:5173"
echo ""
