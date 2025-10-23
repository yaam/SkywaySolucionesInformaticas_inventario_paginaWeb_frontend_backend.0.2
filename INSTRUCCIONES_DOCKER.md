# 🐳 Guía de Dockerización - Skyway Soluciones Informáticas

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
   - Descarga: https://www.docker.com/get-started
   - Verifica la instalación: `docker --version`

2. **Docker Compose** (generalmente viene incluido con Docker Desktop)
   - Verifica la instalación: `docker-compose --version`

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura tus valores:

```env
# MongoDB Atlas (recomendado)
MONGO_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/inventarios?retryWrites=true&w=majority

# Configuración de Email
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=tu_email@outlook.com

# Frontend
REACT_APP_BASE_URL=http://localhost:4001
```

### 2. Construir y Ejecutar los Contenedores

**Opción A: Usar MongoDB Atlas (Recomendado)**

```bash
# Construir las imágenes
docker-compose build

# Iniciar solo backend y frontend
docker-compose up backend frontend
```

**Opción B: Usar MongoDB Local**

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios (incluyendo MongoDB local)
docker-compose up
```

**Modo detached (segundo plano):**

```bash
docker-compose up -d
```

### 3. Verificar que Todo Funciona

- **Frontend**: http://localhost
- **Backend**: http://localhost:4001
- **MongoDB** (si es local): localhost:27017

### 4. Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del frontend
docker-compose logs -f frontend
```

### 5. Detener los Contenedores

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto borra datos de MongoDB local)
docker-compose down -v
```

## 📦 Estructura de los Contenedores

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │    Backend      │      │    MongoDB      │
│   (React)       │─────▶│   (Node.js)     │─────▶│   (Database)    │
│   Puerto: 80    │      │   Puerto: 4001  │      │   Puerto: 27017 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir un servicio específico
docker-compose build --no-cache backend

# Acceder a un contenedor
docker exec -it skyway-backend sh
docker exec -it skyway-frontend sh
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar todo (contenedores, imágenes, volúmenes, redes)
docker system prune -a --volumes
```

### Monitoreo

```bash
# Ver uso de recursos
docker stats

# Ver información de un contenedor
docker inspect skyway-backend

# Ver redes de Docker
docker network ls

# Ver volúmenes
docker volume ls
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución 1:** Si usas MongoDB Atlas
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Agrega `0.0.0.0/0` para permitir todas las IPs (solo desarrollo)

**Solución 2:** Si usas MongoDB Local
- Asegúrate de que el contenedor de MongoDB esté corriendo:
  ```bash
  docker-compose ps mongodb
  ```
- Verifica los logs de MongoDB:
  ```bash
  docker-compose logs mongodb
  ```

### Error: "Port already in use"

Si el puerto 80 o 4001 ya está en uso:

```bash
# En Windows, verificar qué proceso usa el puerto
netstat -ano | findstr :80

# En Linux/Mac
lsof -i :80
```

**Solución:** Cambia los puertos en `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Frontend ahora en puerto 8080
  - "4002:4001"  # Backend ahora en puerto 4002
```

### Error: "No space left on device"

```bash
# Limpiar recursos de Docker
docker system prune -a --volumes
```

### Los cambios en el código no se reflejan

```bash
# Reconstruir las imágenes sin caché
docker-compose build --no-cache

# Reiniciar los servicios
docker-compose up -d
```

## 🔄 Desarrollo vs Producción

### Desarrollo

Para desarrollo con hot-reload, puedes descomentar los volúmenes en `docker-compose.yml`:

```yaml
volumes:
  - ./backend_inventario_node_2023-main:/usr/src/app
  - /usr/src/app/node_modules
```

### Producción

Para producción, considera:

1. **Usar variables de entorno seguras** (no incluir archivos .env en el repositorio)
2. **Configurar HTTPS** con un reverse proxy (nginx, traefik)
3. **Usar MongoDB Atlas** en lugar de MongoDB local
4. **Configurar backups** automáticos de la base de datos
5. **Implementar monitoreo** (Prometheus, Grafana)

## 📚 Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Best practices de Dockerfile](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 Ayuda

Si tienes problemas, revisa:

1. Los logs de los contenedores: `docker-compose logs -f`
2. El estado de los contenedores: `docker-compose ps`
3. Las variables de entorno en el archivo `.env`
4. La conectividad a MongoDB

## 📝 Notas Importantes

- **NO** incluyas el archivo `.env` en el control de versiones (ya está en `.gitignore`)
- Cambia las contraseñas predeterminadas en producción
- Mantén tus dependencias actualizadas
- Haz backups regulares de la base de datos
- Monitorea el uso de recursos de los contenedores

## 🎯 Próximos Pasos

1. ✅ Configurar el archivo `.env`
2. ✅ Construir y ejecutar los contenedores
3. ✅ Verificar que todo funciona correctamente
4. ⬜ Configurar un dominio personalizado
5. ⬜ Implementar HTTPS con SSL/TLS
6. ⬜ Configurar un sistema de CI/CD
7. ⬜ Implementar monitoreo y alertas




