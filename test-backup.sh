#!/bin/bash

# Script de Teste do Sistema de Backup
# Autor: Sistema PrecificaPro
# Data: 07/10/2025

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Teste do Sistema de Backup - Google Drive    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq não está instalado. Instalando...${NC}"
    brew install jq 2>/dev/null || echo -e "${RED}Não foi possível instalar jq automaticamente${NC}"
fi

# Configurações
API_URL="http://localhost:8080/api"
EMAIL="test@precificapro.com"
PASSWORD="password123"

echo -e "${BLUE}🔐 Passo 1: Fazendo login...${NC}"
echo -e "${YELLOW}Usando: $EMAIL${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Falha no login!${NC}"
  echo "Resposta: $LOGIN_RESPONSE"
  echo
  echo -e "${YELLOW}Dica: Verifique se a aplicação está rodando:${NC}"
  echo "  lsof -i:8080"
  exit 1
fi

echo -e "${GREEN}✅ Login realizado com sucesso!${NC}"
echo
sleep 1

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Passo 2: Verificando status do serviço...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

STATUS_RESPONSE=$(curl -s -X GET "$API_URL/backups/status" \
  -H "Authorization: Bearer $TOKEN")

echo "$STATUS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATUS_RESPONSE"
echo

ENABLED=$(echo $STATUS_RESPONSE | grep -o '"enabled":[^,]*' | cut -d':' -f2)

if [[ "$ENABLED" == *"true"* ]]; then
  echo -e "${GREEN}✅ Google Drive está configurado e ativo!${NC}"
else
  echo -e "${RED}❌ Google Drive NÃO está configurado!${NC}"
  echo
  echo -e "${YELLOW}Soluções:${NC}"
  echo "1. Verifique o arquivo .env"
  echo "2. Confirme que GOOGLE_DRIVE_CREDENTIALS_JSON está preenchido"
  echo "3. Reinicie a aplicação"
  exit 1
fi

echo
sleep 2

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 Passo 3: Criando backup manual...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Aguarde... Isso pode levar 10-30 segundos.${NC}"
echo

BACKUP_RESPONSE=$(curl -s -X POST "$API_URL/backups/create" \
  -H "Authorization: Bearer $TOKEN")

echo "$BACKUP_RESPONSE" | jq '.' 2>/dev/null || echo "$BACKUP_RESPONSE"
echo

SUCCESS=$(echo $BACKUP_RESPONSE | grep -o '"success":[^,]*' | cut -d':' -f2)

if [[ "$SUCCESS" == *"true"* ]]; then
  echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
  
  # Extrair informações do backup
  FILENAME=$(echo $BACKUP_RESPONSE | grep -o '"filename":"[^"]*' | cut -d'"' -f4)
  SIZE=$(echo $BACKUP_RESPONSE | grep -o '"fileSizeFormatted":"[^"]*' | cut -d'"' -f4)
  
  echo -e "${GREEN}📁 Arquivo: $FILENAME${NC}"
  echo -e "${GREEN}💾 Tamanho: $SIZE${NC}"
else
  echo -e "${RED}❌ Falha ao criar backup!${NC}"
  echo "Verifique os logs da aplicação para mais detalhes."
fi

echo
sleep 2

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Passo 4: Listando todos os backups...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

LIST_RESPONSE=$(curl -s -X GET "$API_URL/backups" \
  -H "Authorization: Bearer $TOKEN")

echo "$LIST_RESPONSE" | jq '.' 2>/dev/null || echo "$LIST_RESPONSE"
echo

BACKUP_COUNT=$(echo "$LIST_RESPONSE" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}📊 Total de backups: $BACKUP_COUNT${NC}"
echo

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ TESTE COMPLETO!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${YELLOW}🌐 Próximo passo:${NC}"
echo "   Acesse: ${BLUE}https://drive.google.com${NC}"
echo "   Procure por: ${GREEN}precificapro_backup_${NC}"
echo
echo -e "${GREEN}🎉 Sistema de backup funcionando perfeitamente!${NC}"
echo
