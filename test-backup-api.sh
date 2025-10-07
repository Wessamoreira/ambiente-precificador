#!/bin/bash

# Script de teste para API de Backup
# Autor: Sistema PrecificaPro
# Data: 07/10/2025

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
API_URL="http://localhost:8080/api"
JWT_TOKEN=""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Sistema de Backup - PrecificaPro - Testes    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Solicitar JWT Token
if [ -z "$JWT_TOKEN" ]; then
    echo -e "${YELLOW}Por favor, faça login primeiro:${NC}"
    read -p "Email: " email
    read -sp "Senha: " password
    echo
    
    # Fazer login
    LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$JWT_TOKEN" ]; then
        echo -e "${RED}❌ Erro ao fazer login!${NC}"
        echo "Resposta: $LOGIN_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Login realizado com sucesso!${NC}"
    echo
fi

# Função para fazer requisições
function api_call() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Teste:${NC} $description"
    echo -e "${YELLOW}Endpoint:${NC} $method $endpoint"
    echo
    
    RESPONSE=$(curl -s -X $method "$API_URL$endpoint" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json")
    
    echo -e "${GREEN}Resposta:${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo
    
    # Aguardar Enter para continuar
    read -p "Pressione Enter para continuar..."
    echo
}

# Menu de testes
while true; do
    clear
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}           Menu de Testes - Backup API           ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
    echo "1) Verificar Status do Serviço"
    echo "2) Listar Todos os Backups"
    echo "3) Criar Backup Manual"
    echo "4) Restaurar Backup (por ID)"
    echo "5) Limpar Backups Antigos"
    echo "6) Executar Todos os Testes"
    echo "0) Sair"
    echo
    read -p "Escolha uma opção: " option
    echo
    
    case $option in
        1)
            api_call "GET" "/backups/status" "Verificar Status do Serviço de Backup"
            ;;
        2)
            api_call "GET" "/backups" "Listar Todos os Backups Disponíveis"
            ;;
        3)
            echo -e "${YELLOW}⚠️  Criando backup manual...${NC}"
            echo "Isso pode levar alguns segundos dependendo do tamanho do banco."
            echo
            api_call "POST" "/backups/create" "Criar Backup Manual"
            ;;
        4)
            read -p "Digite o ID do backup para restaurar: " backup_id
            echo
            echo -e "${RED}⚠️  ATENÇÃO: Isso irá SOBRESCREVER todos os dados atuais!${NC}"
            read -p "Tem certeza? (digite 'sim' para confirmar): " confirm
            
            if [ "$confirm" = "sim" ]; then
                api_call "POST" "/backups/$backup_id/restore" "Restaurar Backup ID: $backup_id"
            else
                echo -e "${YELLOW}Operação cancelada.${NC}"
                read -p "Pressione Enter para continuar..."
            fi
            ;;
        5)
            echo -e "${YELLOW}Limpando backups com mais de 30 dias...${NC}"
            echo
            api_call "DELETE" "/backups/cleanup" "Limpar Backups Antigos"
            ;;
        6)
            echo -e "${BLUE}Executando todos os testes...${NC}"
            echo
            
            api_call "GET" "/backups/status" "1/3 - Verificar Status"
            api_call "GET" "/backups" "2/3 - Listar Backups"
            
            echo -e "${YELLOW}Deseja criar um backup manual agora? (s/n)${NC}"
            read -p "> " create_backup
            
            if [ "$create_backup" = "s" ]; then
                api_call "POST" "/backups/create" "3/3 - Criar Backup Manual"
            else
                echo -e "${YELLOW}Backup manual pulado.${NC}"
            fi
            
            echo -e "${GREEN}✅ Todos os testes concluídos!${NC}"
            read -p "Pressione Enter para voltar ao menu..."
            ;;
        0)
            echo -e "${GREEN}Saindo... Até logo!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida!${NC}"
            sleep 2
            ;;
    esac
done
