# Makefile para facilitar comandos de Docker
# Uso: make [comando]

.PHONY: help build up down logs restart clean dev prod

# Comando por defecto
help:
	@echo "=== Comandos Disponibles para Skyway Soluciones Informáticas ==="
	@echo ""
	@echo "Desarrollo:"
	@echo "  make dev           - Iniciar en modo desarrollo (hot-reload)"
	@echo "  make dev-build     - Construir y iniciar en modo desarrollo"
	@echo ""
	@echo "Producción:"
	@echo "  make prod          - Iniciar en modo producción"
	@echo "  make prod-build    - Construir y iniciar en modo producción"
	@echo ""
	@echo "General:"
	@echo "  make build         - Construir todas las imágenes"
	@echo "  make up            - Iniciar todos los servicios"
	@echo "  make down          - Detener todos los servicios"
	@echo "  make restart       - Reiniciar todos los servicios"
	@echo "  make logs          - Ver logs de todos los servicios"
	@echo "  make logs-backend  - Ver logs del backend"
	@echo "  make logs-frontend - Ver logs del frontend"
	@echo ""
	@echo "Limpieza:"
	@echo "  make clean         - Limpiar contenedores y volúmenes"
	@echo "  make clean-all     - Limpiar todo (incluyendo imágenes)"
	@echo ""
	@echo "Base de datos:"
	@echo "  make db-backup     - Hacer backup de MongoDB"
	@echo "  make db-shell      - Acceder a shell de MongoDB"
	@echo ""

# Desarrollo
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml up --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

# Producción
prod:
	docker-compose up -d

prod-build:
	docker-compose up --build -d

# Construcción
build:
	docker-compose build

# Iniciar servicios
up:
	docker-compose up -d

# Detener servicios
down:
	docker-compose down

# Reiniciar servicios
restart:
	docker-compose restart

# Ver logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f mongodb

# Estado de los servicios
status:
	docker-compose ps

# Limpieza
clean:
	docker-compose down -v
	docker system prune -f

clean-all:
	docker-compose down -v
	docker system prune -a -f --volumes

# Base de datos
db-backup:
	docker exec skyway-mongodb mongodump --out=/data/backup/$(shell date +%Y%m%d_%H%M%S)

db-shell:
	docker exec -it skyway-mongodb mongosh

# Acceder a contenedores
shell-backend:
	docker exec -it skyway-backend sh

shell-frontend:
	docker exec -it skyway-frontend sh

# Reconstruir un servicio específico
rebuild-backend:
	docker-compose build --no-cache backend
	docker-compose up -d backend

rebuild-frontend:
	docker-compose build --no-cache frontend
	docker-compose up -d frontend




