# 🏗️ Arquitectura Docker - Skyway Soluciones Informáticas

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP
                         │
         ┌───────────────▼────────────────┐
         │    PUERTO 80 (Producción)      │
         │    PUERTO 3000 (Desarrollo)    │
         └───────────────┬────────────────┘
                         │
         ┌───────────────▼────────────────────────────────┐
         │         Docker Network: skyway-network         │
         │                                                 │
         │  ┌──────────────────────────────────────────┐  │
         │  │      FRONTEND CONTAINER                  │  │
         │  │  - React App                             │  │
         │  │  - Nginx (Prod) / Dev Server (Dev)       │  │
         │  │  - Puerto: 80 / 3000                     │  │
         │  └──────────────┬───────────────────────────┘  │
         │                 │                               │
         │                 │ API Calls                     │
         │                 │ http://backend:4001           │
         │                 │                               │
         │  ┌──────────────▼───────────────────────────┐  │
         │  │      BACKEND CONTAINER                   │  │
         │  │  - Node.js + Express                     │  │
         │  │  - API REST                              │  │
         │  │  - Puerto: 4001                          │  │
         │  │  - Volumen: uploads/                     │  │
         │  └──────────────┬───────────────────────────┘  │
         │                 │                               │
         │                 │ MongoDB Connection            │
         │                 │                               │
         │  ┌──────────────▼───────────────────────────┐  │
         │  │      DATABASE                            │  │
         │  │                                          │  │
         │  │  Opción 1: MongoDB Atlas (Cloud)        │  │
         │  │  - Internet connection                  │  │
         │  │  - Managed service                      │  │
         │  │                                          │  │
         │  │  Opción 2: MongoDB Local (Container)    │  │
         │  │  - MongoDB 6.0                          │  │
         │  │  - Puerto: 27017                        │  │
         │  │  - Volumen: mongodb_data                │  │
         │  └──────────────────────────────────────────┘  │
         │                                                 │
         └─────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Modo Producción

```
Usuario → Navegador (localhost:80)
         ↓
    Frontend (Nginx)
         ↓ API Request
    Backend (Node.js:4001)
         ↓ Query
    MongoDB (Atlas/Local)
         ↓ Response
    Backend (procesa)
         ↓ JSON
    Frontend (renderiza)
         ↓
    Usuario (ve resultado)
```

### Modo Desarrollo

```
Desarrollador → Edita código
                ↓
    Volumen Docker sincroniza
                ↓
    Nodemon/React detecta cambios
                ↓
    Auto-reload
                ↓
    Navegador actualiza (localhost:3000)
```

## 📦 Contenedores

### Frontend Container

**Producción:**
```dockerfile
Stage 1 (Build):
- Base: node:16-alpine
- Instala dependencias
- Build React app
- Output: /app/build

Stage 2 (Serve):
- Base: nginx:alpine
- Copia build artifacts
- Configura nginx
- Tamaño final: ~50MB
```

**Desarrollo:**
```dockerfile
- Base: node:16-alpine
- Instala dependencias
- Monta volumen
- React Dev Server
- Hot Module Reload
```

### Backend Container

**Producción:**
```dockerfile
- Base: node:16-alpine
- Instala dependencias (--production)
- Copia código
- Expone puerto 4001
- CMD: node index.js
- Tamaño: ~200MB
```

**Desarrollo:**
```dockerfile
- Base: node:16-alpine
- Instala todas las dependencias
- Monta volumen
- Instala nodemon
- CMD: nodemon index.js
```

### MongoDB Container

```dockerfile
- Base: mongo:6.0
- Puerto: 27017
- Volúmenes:
  - mongodb_data (persistencia)
  - mongodb_config (configuración)
- Variables:
  - MONGO_INITDB_ROOT_USERNAME
  - MONGO_INITDB_ROOT_PASSWORD
```

## 🌐 Redes

### Skyway Network (Bridge)

```
Tipo: Bridge
Driver: bridge
Subnet: 172.18.0.0/16 (ejemplo)

Contenedores conectados:
- frontend    → 172.18.0.2
- backend     → 172.18.0.3
- mongodb     → 172.18.0.4

Comunicación interna por nombre:
- backend puede acceder a mongodb://mongodb:27017
- frontend puede acceder a http://backend:4001
```

## 💾 Volúmenes

### Persistencia de Datos

```
1. mongodb_data
   - Tipo: Named Volume
   - Path: /data/db
   - Persistencia: Base de datos MongoDB
   - Backup: Importante

2. mongodb_config
   - Tipo: Named Volume
   - Path: /data/configdb
   - Persistencia: Configuración MongoDB

3. uploads (Bind Mount)
   - Tipo: Bind
   - Host: ./backend_inventario_node_2023-main/uploads
   - Container: /usr/src/app/uploads
   - Persistencia: Archivos subidos por usuarios
```

### Desarrollo (Bind Mounts)

```
Backend:
- ./backend_inventario_node_2023-main → /usr/src/app
- Excluye: node_modules (volumen anónimo)

Frontend:
- ./frontend_inventario_react-main → /app
- Excluye: node_modules (volumen anónimo)
```

## 🔐 Variables de Entorno

### Flujo de Configuración

```
1. env.docker.example (Plantilla)
   ↓ copiar
2. .env (Configuración local)
   ↓ leer
3. docker-compose.yml
   ↓ inyectar
4. Contenedores
```

### Variables por Servicio

**Backend:**
- `PORT` → Puerto del servidor
- `MONGO_URI` → Connection string de MongoDB
- `EMAIL_USER` → Usuario de email
- `EMAIL_PASS` → Contraseña de email
- `EMAIL_FROM` → Email remitente
- `NODE_ENV` → production/development

**Frontend:**
- `REACT_APP_BASE_URL` → URL del backend

**MongoDB:**
- `MONGO_INITDB_ROOT_USERNAME` → Usuario admin
- `MONGO_INITDB_ROOT_PASSWORD` → Contraseña admin
- `MONGO_INITDB_DATABASE` → Base de datos inicial

## 🔄 Health Checks

### Backend
```yaml
test: wget --quiet --tries=1 --spider http://localhost:4001/
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

### Frontend
```yaml
test: wget --quiet --tries=1 --spider http://localhost:80/
interval: 30s
timeout: 10s
retries: 3
```

### MongoDB
```yaml
test: mongosh --eval "db.adminCommand('ping')"
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

## 🚀 Estrategias de Despliegue

### Desarrollo Local

```
Características:
- Hot-reload habilitado
- Volúmenes sincronizados
- Logs verbose
- Sin optimizaciones
- Fácil debugging

Comando:
docker-compose -f docker-compose.dev.yml up
```

### Staging/Testing

```
Características:
- Build optimizado
- Sin hot-reload
- Logs moderados
- Health checks habilitados

Comando:
docker-compose up -d
```

### Producción

```
Características:
- Multi-stage builds
- Imágenes optimizadas
- Resource limits
- Auto-restart
- Logging estructurado

Comando:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📈 Escalabilidad

### Escalar Servicios

```bash
# Escalar backend
docker-compose up -d --scale backend=3

# Requiere configurar load balancer
# Ejemplo con nginx como reverse proxy
```

### Load Balancer (Futuro)

```
            Nginx Reverse Proxy
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    backend-1   backend-2   backend-3
        ↓           ↓           ↓
            MongoDB (Shared)
```

## 🔒 Seguridad

### Capas de Seguridad

```
1. Red Aislada
   - Contenedores en red privada
   - Solo puertos necesarios expuestos

2. Variables de Entorno
   - Secretos fuera del código
   - .env no versionado

3. Usuario No-Root
   - Alpine Linux (menor superficie)
   - Node.js no root

4. Updates
   - Imágenes base actualizadas
   - Dependencias actualizadas

5. Firewall
   - Solo puertos necesarios
   - Reverse proxy en producción
```

## 📊 Recursos por Servicio

### Límites (Producción)

```yaml
Backend:
  Límite: 512MB RAM, 1 CPU
  Reserva: 256MB RAM, 0.5 CPU

Frontend:
  Límite: 256MB RAM, 0.5 CPU
  Reserva: 128MB RAM, 0.25 CPU

MongoDB:
  Límite: 1GB RAM, 1 CPU
  Reserva: 512MB RAM, 0.5 CPU
```

## 🎯 Optimizaciones

### Tamaño de Imágenes

**Frontend:**
- Build inicial: ~1.2GB
- Imagen final (multi-stage): ~50MB
- Reducción: ~96%

**Backend:**
- Con node: ~900MB
- Con node:alpine: ~200MB
- Reducción: ~78%

### Tiempo de Build

**Sin Caché:**
- Frontend: ~3-5 minutos
- Backend: ~1-2 minutos

**Con Caché:**
- Frontend: ~30 segundos
- Backend: ~10 segundos

### Estrategias

1. **Layer Caching**
   - COPY package.json primero
   - RUN npm install
   - COPY código después

2. **.dockerignore**
   - Excluir node_modules
   - Excluir archivos de desarrollo

3. **Multi-stage Builds**
   - Separar build de runtime
   - Solo incluir artifacts necesarios

## 📝 Convenciones

### Nombres de Contenedores
```
skyway-backend
skyway-frontend
skyway-mongodb
```

### Nombres de Volúmenes
```
skywaysolucionesinformaticas_mongodb_data
skywaysolucionesinformaticas_mongodb_config
```

### Nombres de Redes
```
skywaysolucionesinformaticas_skyway-network
```

## 🔄 Ciclo de Vida

```
1. docker-compose build
   ↓ Construye imágenes
   
2. docker-compose up
   ↓ Crea contenedores
   ↓ Crea redes
   ↓ Crea volúmenes
   ↓ Inicia servicios
   
3. Health checks
   ↓ Verifica salud
   
4. Running
   ↓ Servicios activos
   
5. docker-compose down
   ↓ Detiene contenedores
   ↓ Elimina contenedores
   ↓ Elimina redes
   ↓ Preserva volúmenes
```

---

**Última actualización**: Octubre 2025
**Versión**: 1.0
**Autor**: Skyway Soluciones Informáticas





