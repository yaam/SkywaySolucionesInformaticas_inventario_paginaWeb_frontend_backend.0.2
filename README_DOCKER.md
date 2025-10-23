# 🐳 Skyway Soluciones Informáticas - Versión Dockerizada

Sistema completo de gestión de inventario dockerizado con Node.js, React y MongoDB.

## 📋 Contenido

- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modos de Ejecución](#-modos-de-ejecución)
- [Documentación](#-documentación)
- [Características](#-características)

## 🚀 Inicio Rápido

### 1. Prerequisitos

- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose
- 4GB de RAM disponible
- Puertos disponibles: 80, 4001, 27017 (si usas MongoDB local)

### 2. Configuración en 3 Pasos

```bash
# 1. Copiar archivo de configuración
copy env.docker.example .env   # Windows
cp env.docker.example .env     # Linux/Mac

# 2. Editar .env con tus configuraciones
# (Configurar MONGO_URI, EMAIL_USER, EMAIL_PASS)

# 3. Iniciar con el script de inicio rápido
inicio-rapido.bat    # Windows
./inicio-rapido.sh   # Linux/Mac
```

### 3. Usar Make (Recomendado)

```bash
make help    # Ver todos los comandos
make dev     # Iniciar en desarrollo
make prod    # Iniciar en producción
make logs    # Ver logs
```

## 📁 Estructura del Proyecto

```
SkywaySolucionesInformaticas/
│
├── backend_inventario_node_2023-main/
│   ├── Dockerfile              # Producción
│   ├── Dockerfile.dev          # Desarrollo
│   ├── .dockerignore
│   └── ...
│
├── frontend_inventario_react-main/
│   ├── Dockerfile              # Producción (multi-stage con nginx)
│   ├── Dockerfile.dev          # Desarrollo (hot-reload)
│   ├── nginx.conf
│   ├── .dockerignore
│   └── ...
│
├── docker-compose.yml          # Configuración producción
├── docker-compose.dev.yml      # Configuración desarrollo
├── docker-compose.prod.yml     # Optimizaciones producción
│
├── env.docker.example          # Plantilla de variables de entorno
├── .dockerignore
├── .gitignore
│
├── Makefile                    # Comandos simplificados
├── inicio-rapido.bat           # Script inicio Windows
├── inicio-rapido.sh            # Script inicio Linux/Mac
├── healthcheck.sh              # Script verificación
│
└── Documentación/
    ├── INICIO_RAPIDO.md        # Guía de inicio rápido
    ├── INSTRUCCIONES_DOCKER.md # Guía completa
    └── COMANDOS_DOCKER.md      # Referencia de comandos
```

## 🎯 Modos de Ejecución

### Modo Desarrollo

Con hot-reload para desarrollo activo:

```bash
# Con Make
make dev

# Con Docker Compose
docker-compose -f docker-compose.dev.yml up

# Con script
inicio-rapido.bat  # Opción 1
```

**Características:**
- ✅ Hot-reload en backend y frontend
- ✅ Frontend en puerto 3000
- ✅ Código sincronizado con volúmenes
- ✅ Logs en tiempo real

### Modo Producción

Optimizado para producción:

```bash
# Con Make
make prod

# Con Docker Compose
docker-compose up -d

# Con script
inicio-rapido.bat  # Opción 2
```

**Características:**
- ✅ Frontend optimizado con nginx (puerto 80)
- ✅ Backend en modo producción
- ✅ Imágenes más pequeñas
- ✅ Health checks configurados
- ✅ Limitación de recursos

## 🌐 Acceso a los Servicios

### Desarrollo
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4001
- **MongoDB**: localhost:27017

### Producción
- **Frontend**: http://localhost
- **Backend**: http://localhost:4001
- **MongoDB**: localhost:27017

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Guía de inicio en 3 pasos |
| [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md) | Documentación completa |
| [COMANDOS_DOCKER.md](./COMANDOS_DOCKER.md) | Referencia de comandos |
| [Makefile](./Makefile) | Todos los comandos Make |

## ✨ Características

### Docker
- ✅ Multi-stage builds para optimización
- ✅ Configuración separada dev/prod
- ✅ Health checks automáticos
- ✅ Volúmenes persistentes
- ✅ Red aislada entre servicios
- ✅ Reinicio automático

### Backend
- ✅ Node.js 16 Alpine
- ✅ Hot-reload con nodemon (dev)
- ✅ Variables de entorno configurables
- ✅ Persistencia de uploads

### Frontend
- ✅ React optimizado
- ✅ Nginx con compresión gzip
- ✅ Cache de archivos estáticos
- ✅ SPA routing configurado

### Base de Datos
- ✅ MongoDB 6.0
- ✅ Soporte para MongoDB Atlas
- ✅ MongoDB local opcional
- ✅ Volúmenes persistentes
- ✅ Health checks

## 🔧 Comandos Útiles

### Básicos
```bash
make dev              # Desarrollo
make prod             # Producción
make logs             # Ver logs
make down             # Detener
make restart          # Reiniciar
```

### Mantenimiento
```bash
make clean            # Limpiar contenedores
make clean-all        # Limpieza completa
make rebuild-backend  # Reconstruir backend
make rebuild-frontend # Reconstruir frontend
```

### Base de Datos
```bash
make db-backup        # Backup de MongoDB
make db-shell         # Shell de MongoDB
```

### Debugging
```bash
make logs-backend     # Logs del backend
make logs-frontend    # Logs del frontend
make shell-backend    # Shell del backend
make status           # Estado de servicios
```

## 🐛 Solución de Problemas

### Puerto ocupado
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "8080:80"    # Frontend
  - "4002:4001"  # Backend
```

### No conecta a MongoDB
```bash
# Verificar .env
cat .env | grep MONGO_URI

# Ver logs
make logs-backend

# Si usas Atlas, verifica IP whitelist
```

### Reconstruir desde cero
```bash
make clean-all
make prod-build
```

## 📊 Monitoreo

### Verificar estado
```bash
# Estado de servicios
docker-compose ps

# Recursos
docker stats

# Health check
./healthcheck.sh
```

### Ver logs
```bash
# Todos los servicios
make logs

# Solo backend
make logs-backend

# Solo frontend
make logs-frontend
```

## 🔐 Seguridad

- ✅ Variables de entorno fuera del repositorio
- ✅ .env en .gitignore
- ✅ Red aislada entre contenedores
- ✅ No exponer MongoDB en producción
- ✅ Usar MongoDB Atlas con autenticación

## 🚀 Despliegue en Producción

### Recomendaciones

1. **Variables de Entorno**
   - No incluir .env en el repositorio
   - Usar secretos del proveedor de cloud

2. **MongoDB**
   - Usar MongoDB Atlas en producción
   - Configurar backups automáticos

3. **HTTPS**
   - Configurar reverse proxy (nginx, Traefik)
   - Usar certificados SSL (Let's Encrypt)

4. **Dominio**
   - Configurar DNS
   - Actualizar REACT_APP_BASE_URL

5. **Monitoreo**
   - Configurar logging centralizado
   - Implementar alertas

## 🆘 Soporte

### Verificaciones
1. ✅ Docker está instalado: `docker --version`
2. ✅ Docker está corriendo: `docker ps`
3. ✅ Archivo .env existe y está configurado
4. ✅ Puertos disponibles: 80, 4001, 27017

### Recursos
- [Documentación Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md)

## 📝 Notas

- Los datos de MongoDB local se guardan en volúmenes Docker
- Los archivos uploads se persisten en el host
- Use MongoDB Atlas para producción
- Mantenga sus dependencias actualizadas

## 🎯 Próximos Pasos

- [ ] Configurar dominio personalizado
- [ ] Implementar HTTPS
- [ ] Configurar CI/CD
- [ ] Implementar monitoreo
- [ ] Configurar backups automáticos

---

**Skyway Soluciones Informáticas** - Sistema de Inventario Dockerizado




