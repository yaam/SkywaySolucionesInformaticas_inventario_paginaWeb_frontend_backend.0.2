# 📖 Comandos Docker - Guía de Referencia Rápida

## 🎯 Comandos Básicos

### Inicio y Detención

```bash
# Iniciar todos los servicios en modo producción
docker-compose up -d

# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina datos)
docker-compose down -v
```

### Ver Estado y Logs

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Ver últimas 100 líneas de logs
docker-compose logs --tail=100 backend
```

### Reconstruir y Reiniciar

```bash
# Reconstruir todas las imágenes
docker-compose build

# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir un servicio específico
docker-compose build backend

# Reiniciar un servicio
docker-compose restart backend

# Reiniciar todos los servicios
docker-compose restart
```

## 🔧 Comandos de Mantenimiento

### Acceder a Contenedores

```bash
# Acceder al shell del backend
docker exec -it skyway-backend sh

# Acceder al shell del frontend
docker exec -it skyway-frontend sh

# Acceder a MongoDB shell
docker exec -it skyway-mongodb mongosh

# Ejecutar un comando específico
docker exec skyway-backend npm list
```

### Inspección y Debugging

```bash
# Ver detalles de un contenedor
docker inspect skyway-backend

# Ver recursos utilizados (CPU, RAM)
docker stats

# Ver redes de Docker
docker network ls

# Ver volúmenes
docker volume ls

# Inspeccionar un volumen
docker volume inspect <nombre_volumen>
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar volúmenes sin usar
docker volume prune

# Eliminar redes sin usar
docker network prune

# Limpieza completa (¡CUIDADO!)
docker system prune -a --volumes
```

## 💾 Base de Datos

### Backup de MongoDB

```bash
# Backup de la base de datos
docker exec skyway-mongodb mongodump --out=/data/backup

# Copiar backup al host
docker cp skyway-mongodb:/data/backup ./backup

# Backup con fecha
docker exec skyway-mongodb mongodump --out=/data/backup/$(date +%Y%m%d_%H%M%S)
```

### Restaurar MongoDB

```bash
# Copiar backup al contenedor
docker cp ./backup skyway-mongodb:/data/backup

# Restaurar desde backup
docker exec skyway-mongodb mongorestore /data/backup
```

### Acceder a MongoDB

```bash
# Shell de MongoDB
docker exec -it skyway-mongodb mongosh

# Comandos dentro de mongosh:
> show dbs                        # Ver bases de datos
> use inventarios                 # Usar base de datos
> show collections                # Ver colecciones
> db.inventarios.find().pretty()  # Ver documentos
> db.inventarios.countDocuments() # Contar documentos
> exit                            # Salir
```

## 🔍 Diagnóstico

### Verificar Conectividad

```bash
# Ping entre contenedores
docker exec skyway-backend ping mongodb

# Verificar puertos
docker exec skyway-backend netstat -tlnp

# Ver variables de entorno
docker exec skyway-backend env

# Verificar conexión a MongoDB
docker exec skyway-backend node -e "console.log(process.env.MONGO_URI)"
```

### Problemas Comunes

```bash
# Si un puerto está ocupado, encontrar el proceso
# Windows
netstat -ano | findstr :4001

# Linux/Mac
lsof -i :4001

# Ver logs de errores
docker-compose logs --tail=100 backend | grep -i error

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📦 Gestión de Imágenes

### Ver y Administrar Imágenes

```bash
# Listar imágenes
docker images

# Eliminar una imagen específica
docker rmi <imagen_id>

# Eliminar imágenes sin nombre
docker rmi $(docker images -f "dangling=true" -q)

# Ver historial de una imagen
docker history skyway-backend

# Etiquetar una imagen
docker tag skyway-backend:latest skyway-backend:v1.0
```

## 🌐 Redes

### Gestión de Redes

```bash
# Listar redes
docker network ls

# Inspeccionar red
docker network inspect skyway_skyway-network

# Ver contenedores en una red
docker network inspect skyway_skyway-network | grep Name
```

## 📊 Monitoreo

### Recursos

```bash
# Ver uso de recursos en tiempo real
docker stats

# Ver uso de recursos de un contenedor específico
docker stats skyway-backend

# Ver uso de disco
docker system df

# Ver información detallada de uso
docker system df -v
```

## 🔐 Seguridad

### Verificación de Seguridad

```bash
# Ver puertos expuestos
docker port skyway-backend

# Ver procesos en un contenedor
docker top skyway-backend

# Escanear vulnerabilidades (requiere Docker Desktop)
docker scan skyway-backend
```

## 🚀 Producción

### Despliegue en Producción

```bash
# Iniciar en modo producción
docker-compose up -d

# Escalar un servicio (si es necesario)
docker-compose up -d --scale backend=3

# Ver logs en producción
docker-compose logs -f --tail=100

# Actualizar un servicio sin downtime
docker-compose build backend
docker-compose up -d --no-deps backend
```

## 🎓 Comandos Avanzados

### Docker Compose Override

```bash
# Crear archivo de override local
# docker-compose.override.yml se carga automáticamente

# Usar múltiples archivos compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Health Checks

```bash
# Ver estado de health checks
docker inspect --format='{{.State.Health.Status}}' skyway-backend

# Ver últimos health checks
docker inspect --format='{{json .State.Health}}' skyway-backend | jq
```

## 📝 Notas

- Los comandos con `-d` ejecutan en segundo plano (detached mode)
- Los comandos con `-f` siguen los logs en tiempo real (follow mode)
- Usa `--help` con cualquier comando para más información
- Usa `Ctrl+C` para detener comandos en ejecución

## 🆘 Ayuda

Para más información:
- Docker: `docker --help`
- Docker Compose: `docker-compose --help`
- Comando específico: `docker-compose <comando> --help`

---

**Tip Pro**: Crea alias en tu shell para comandos frecuentes:

```bash
# Bash/Zsh (.bashrc o .zshrc)
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
```




