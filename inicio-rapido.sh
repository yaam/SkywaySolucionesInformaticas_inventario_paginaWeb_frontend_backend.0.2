#!/bin/bash
# Script de inicio rápido para Linux/Mac - Skyway Soluciones Informáticas
# ========================================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================================"
echo "  SKYWAY SOLUCIONES INFORMATICAS - Docker Setup"
echo "========================================================"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker no está instalado o no está en el PATH"
    echo "Por favor instala Docker desde https://www.docker.com/get-started"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker ps &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker no está corriendo"
    echo "Por favor inicia Docker y vuelve a ejecutar este script"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Docker está instalado y corriendo"
echo ""

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[ADVERTENCIA]${NC} No se encontró el archivo .env"
    echo ""
    if [ -f "env.docker.example" ]; then
        echo "Copiando env.docker.example a .env..."
        cp env.docker.example .env
        echo ""
        echo -e "${YELLOW}[IMPORTANTE]${NC} Por favor edita el archivo .env con tus configuraciones"
        echo "Presiona Enter cuando hayas configurado el archivo .env..."
        read
    else
        echo -e "${RED}[ERROR]${NC} No se encontró el archivo env.docker.example"
        exit 1
    fi
fi

echo ""
echo "Selecciona el modo de ejecución:"
echo ""
echo "1. Desarrollo (con hot-reload en puerto 3000)"
echo "2. Producción (optimizado en puerto 80)"
echo "3. Solo Backend (puerto 4001)"
echo "4. Reconstruir todo desde cero"
echo "5. Ver logs"
echo "6. Detener todos los servicios"
echo "7. Salir"
echo ""

read -p "Ingresa tu opción (1-7): " opcion

case $opcion in
    1)
        echo ""
        echo -e "${BLUE}[INFO]${NC} Iniciando en modo DESARROLLO..."
        echo ""
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo ""
        echo -e "${BLUE}[INFO]${NC} Iniciando en modo PRODUCCIÓN..."
        echo ""
        docker-compose up --build -d
        echo ""
        echo -e "${GREEN}[OK]${NC} Servicios iniciados en segundo plano"
        echo ""
        echo "Frontend: http://localhost"
        echo "Backend: http://localhost:4001"
        echo ""
        echo "Para ver los logs ejecuta: docker-compose logs -f"
        ;;
    3)
        echo ""
        echo -e "${BLUE}[INFO]${NC} Iniciando solo BACKEND..."
        echo ""
        docker-compose up backend --build -d
        echo ""
        echo -e "${GREEN}[OK]${NC} Backend iniciado en http://localhost:4001"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}[ADVERTENCIA]${NC} Esto eliminará todos los contenedores y volúmenes"
        echo "y reconstruirá todo desde cero."
        echo ""
        read -p "¿Estás seguro? (s/N): " confirmar
        if [[ $confirmar == "s" || $confirmar == "S" ]]; then
            echo ""
            echo "Deteniendo servicios..."
            docker-compose down -v
            echo "Limpiando imágenes antiguas..."
            docker-compose build --no-cache
            echo "Iniciando servicios..."
            docker-compose up -d
            echo -e "${GREEN}[OK]${NC} Reconstrucción completada"
        else
            echo "Operación cancelada"
        fi
        ;;
    5)
        echo ""
        echo "Mostrando logs (Ctrl+C para salir)..."
        echo ""
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "Deteniendo todos los servicios..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        echo -e "${GREEN}[OK]${NC} Servicios detenidos"
        ;;
    7)
        echo ""
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""



