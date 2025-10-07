#!/bin/bash

# 🚀 TESTE RÁPIDO - Sistema de Upload de Imagens
# Execute: chmod +x TESTE-RAPIDO.sh && ./TESTE-RAPIDO.sh

echo "🎯 TESTE RÁPIDO - Upload de Imagens"
echo "===================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}📋 Verificando dependências...${NC}"

# Verificar Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo -e "${GREEN}✅ Java encontrado: ${JAVA_VERSION}${NC}"
else
    echo -e "${RED}❌ Java não encontrado${NC}"
    exit 1
fi

# Verificar Node
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node encontrado: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node não encontrado${NC}"
    exit 1
fi

# Verificar NPM
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ NPM encontrado: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ NPM não encontrado${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔍 Verificando configuração...${NC}"

# Verificar .env do backend
if [ -f "precificapro-api/.env" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME" precificapro-api/.env; then
        echo -e "${GREEN}✅ Cloudinary configurado no backend${NC}"
    else
        echo -e "${YELLOW}⚠️  Cloudinary NÃO configurado no .env${NC}"
        echo -e "   Adicione estas linhas em precificapro-api/.env:"
        echo -e "   CLOUDINARY_CLOUD_NAME=seu_cloud_name"
        echo -e "   CLOUDINARY_API_KEY=sua_api_key"
        echo -e "   CLOUDINARY_API_SECRET=seu_api_secret"
    fi
else
    echo -e "${RED}❌ Arquivo .env não encontrado em precificapro-api/${NC}"
    exit 1
fi

# Verificar se backend está rodando
echo ""
echo -e "${BLUE}🔌 Verificando se backend está rodando...${NC}"
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está rodando na porta 8080${NC}"
    BACKEND_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Backend NÃO está rodando${NC}"
    BACKEND_RUNNING=false
fi

# Verificar se frontend está rodando
echo -e "${BLUE}🔌 Verificando se frontend está rodando...${NC}"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend está rodando na porta 5173${NC}"
    FRONTEND_RUNNING=true
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend está rodando na porta 3000${NC}"
    FRONTEND_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Frontend NÃO está rodando${NC}"
    FRONTEND_RUNNING=false
fi

echo ""
echo -e "${BLUE}📊 Status:${NC}"
echo "=================================="

if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${GREEN}✅ Sistema PRONTO para testar!${NC}"
    echo ""
    echo "🌐 Acesse: http://localhost:5173"
    echo "📸 Fluxo de teste:"
    echo "   1. Fazer login"
    echo "   2. Ir em Produtos"
    echo "   3. Clicar em '📸 Imagens' de um produto"
    echo "   4. Fazer upload de uma imagem"
    echo "   5. Ver a galeria"
    echo ""
elif [ "$BACKEND_RUNNING" = false ] && [ "$FRONTEND_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠️  Backend e Frontend PARADOS${NC}"
    echo ""
    echo "Para iniciar:"
    echo ""
    echo -e "${BLUE}🔧 Backend:${NC}"
    echo "cd precificapro-api"
    echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 21)"
    echo "mvn spring-boot:run"
    echo ""
    echo -e "${BLUE}🎨 Frontend:${NC}"
    echo "cd precificapro-frontend"
    echo "npm install"
    echo "npm run dev"
    echo ""
elif [ "$BACKEND_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠️  Apenas Backend está PARADO${NC}"
    echo ""
    echo "Para iniciar backend:"
    echo "cd precificapro-api"
    echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 21)"
    echo "mvn spring-boot:run"
    echo ""
else
    echo -e "${YELLOW}⚠️  Apenas Frontend está PARADO${NC}"
    echo ""
    echo "Para iniciar frontend:"
    echo "cd precificapro-frontend"
    echo "npm install"
    echo "npm run dev"
    echo ""
fi

echo "=================================="
echo ""
echo -e "${BLUE}📚 Documentação:${NC}"
echo "   Backend:  precificapro-api/CONFIGURACAO-FINAL-UPLOAD.md"
echo "   Frontend: precificapro-frontend/GUIA-INTEGRACAO-IMAGENS.md"
echo "   Resumo:   RESUMO-UPLOAD-IMAGENS.md"
echo ""
echo -e "${GREEN}🎉 Sistema de Upload de Imagens implementado!${NC}"
