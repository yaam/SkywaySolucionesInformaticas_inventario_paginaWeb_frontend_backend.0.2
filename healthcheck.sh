#!/bin/bash
# Script de verificación de salud de los servicios
# ================================================

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "  Health Check - Skyway Soluciones"
echo "========================================="
echo ""

# Función para verificar un servicio
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Verificando $name... "
    
    if curl -f -s -o /dev/null "$url"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FALLO${NC}"
        return 1
    fi
}

# Verificar servicios
errors=0

check_service "Frontend" "http://localhost" || ((errors++))
check_service "Backend" "http://localhost:4001" || ((errors++))

# Verificar MongoDB (si está local)
echo -n "Verificando MongoDB... "
if docker exec skyway-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${YELLOW}! No disponible (puede estar usando Atlas)${NC}"
fi

echo ""

# Verificar contenedores
echo "Estado de contenedores:"
docker-compose ps

echo ""

# Verificar recursos
echo "Uso de recursos:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""

# Resultado final
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  ✓ Todos los servicios están OK${NC}"
    echo -e "${GREEN}=========================================${NC}"
    exit 0
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}  ✗ Hay $errors servicio(s) con problemas${NC}"
    echo -e "${RED}=========================================${NC}"
    exit 1
fi




