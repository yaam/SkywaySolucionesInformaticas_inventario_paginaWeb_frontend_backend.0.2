# 🚀 EMPIEZA AQUÍ - Dockerización Skyway

## ¡Bienvenido! 👋

Este proyecto ha sido completamente dockerizado. Sigue estos pasos para ponerlo en marcha.

## ⚡ Inicio en 3 Pasos

### Paso 1: Instalar Docker 🐳

**¿Ya tienes Docker instalado?**

```bash
# Verifica ejecutando:
docker --version
```

Si ves la versión de Docker, ¡perfecto! Salta al Paso 2.

Si no, sigue la guía: 📖 [INSTALACION_DOCKER.md](./INSTALACION_DOCKER.md)

---

### Paso 2: Configurar Variables de Entorno ⚙️

```bash
# Windows
copy env.docker.example .env

# Linux/Mac
cp env.docker.example .env
```

**Edita el archivo `.env` y configura:**

```env
# MongoDB (usa tu connection string de MongoDB Atlas)
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inventarios?retryWrites=true&w=majority

# Email (para notificaciones)
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña_aplicacion_outlook
EMAIL_FROM=tu_email@outlook.com

# Backend
PORT=4001

# Frontend
REACT_APP_BASE_URL=http://localhost:4001
```

> 💡 **Tip**: Si no tienes MongoDB Atlas, puedes crear una cuenta gratuita en https://www.mongodb.com/cloud/atlas

---

### Paso 3: Iniciar el Proyecto 🎬

**Opción A: Script de Inicio Automático (Más Fácil)**

```bash
# Windows
inicio-rapido.bat

# Linux/Mac
chmod +x inicio-rapido.sh
./inicio-rapido.sh
```

Selecciona la opción que desees:
- **1** = Desarrollo (con hot-reload)
- **2** = Producción (optimizado)

**Opción B: Usando Make (Recomendado)**

```bash
# Ver todos los comandos
make help

# Iniciar en modo desarrollo
make dev

# Iniciar en modo producción
make prod
```

**Opción C: Docker Compose Directo**

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up

# Producción
docker-compose up -d
```

---

## ✅ Verificar que Todo Funciona

### Acceder a la Aplicación

**Modo Desarrollo:**
- 🎨 Frontend: http://localhost:3000
- ⚙️ Backend: http://localhost:4001

**Modo Producción:**
- 🎨 Frontend: http://localhost
- ⚙️ Backend: http://localhost:4001

### Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Ver Estado

```bash
docker-compose ps
```

Deberías ver algo como:
```
NAME               STATUS        PORTS
skyway-backend     Up (healthy)  0.0.0.0:4001->4001/tcp
skyway-frontend    Up (healthy)  0.0.0.0:80->80/tcp
skyway-mongodb     Up (healthy)  0.0.0.0:27017->27017/tcp
```

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| 📖 [INSTALACION_DOCKER.md](./INSTALACION_DOCKER.md) | Instalar Docker en Windows/Linux/Mac |
| 🚀 [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Guía rápida de inicio |
| 📘 [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md) | Guía completa y detallada |
| 💻 [COMANDOS_DOCKER.md](./COMANDOS_DOCKER.md) | Referencia de comandos |
| 🏗️ [ARQUITECTURA_DOCKER.md](./ARQUITECTURA_DOCKER.md) | Arquitectura del sistema |
| 📋 [RESUMEN_DOCKERIZACION.md](./RESUMEN_DOCKERIZACION.md) | Resumen de todo lo creado |
| 🔧 [README_DOCKER.md](./README_DOCKER.md) | README completo de Docker |

---

## 🎯 Comandos Más Usados

```bash
# Iniciar en desarrollo
make dev

# Iniciar en producción  
make prod

# Ver logs
make logs

# Detener todo
make down

# Reiniciar
make restart

# Limpiar todo
make clean

# Ver ayuda
make help
```

---

## 🐛 ¿Problemas?

### Puerto ya en uso

Si el puerto 80 o 4001 está ocupado, edita `docker-compose.yml`:

```yaml
ports:
  - "8080:80"    # Frontend ahora en puerto 8080
  - "4002:4001"  # Backend ahora en puerto 4002
```

### No conecta a MongoDB

1. Verifica que tu `MONGO_URI` esté correcta en el archivo `.env`
2. Si usas MongoDB Atlas, verifica que tu IP esté en la whitelist
3. Para desarrollo, puedes usar el MongoDB local incluido

### Docker no está corriendo

**Windows:**
- Abre Docker Desktop desde el menú Inicio
- Espera a que el ícono de Docker en la bandeja del sistema esté verde

**Linux:**
```bash
sudo systemctl start docker
```

**Mac:**
- Abre Docker Desktop desde Applications

### Reconstruir desde cero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 🌟 Características

- ✅ **Hot-reload** en modo desarrollo
- ✅ **Nginx optimizado** en producción
- ✅ **MongoDB** local o Atlas
- ✅ **Persistencia de datos** con volúmenes
- ✅ **Health checks** automáticos
- ✅ **Reinicio automático** de servicios
- ✅ **Logs estructurados**
- ✅ **Variables de entorno** centralizadas

---

## 🎓 Modos de Ejecución

### Desarrollo

```bash
make dev
```

**Características:**
- 🔥 Hot-reload activado
- 📝 Código sincronizado
- 🔍 Logs en tiempo real
- 🌐 Frontend en puerto 3000

**Ideal para:**
- Desarrollo activo
- Debugging
- Testing local

### Producción

```bash
make prod
```

**Características:**
- ⚡ Optimizado para performance
- 📦 Imágenes comprimidas
- 🔒 Más seguro
- 🌐 Frontend en puerto 80

**Ideal para:**
- Despliegue final
- Testing de producción
- Demos

---

## 📦 ¿Qué Incluye Este Setup?

```
┌─────────────────────────────────────────┐
│          APLICACIÓN WEB                 │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (React + Nginx)               │
│  ├─ React 18                            │
│  ├─ React Router                        │
│  ├─ Axios                               │
│  └─ SweetAlert2                         │
│                                         │
│  Backend (Node.js + Express)            │
│  ├─ Express                             │
│  ├─ Mongoose                            │
│  ├─ Nodemailer                          │
│  └─ Multer                              │
│                                         │
│  Base de Datos                          │
│  ├─ MongoDB 6.0 (local)                 │
│  └─ MongoDB Atlas (cloud)               │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✨ Próximos Pasos

1. ✅ Instalar Docker
2. ✅ Configurar `.env`
3. ✅ Ejecutar `inicio-rapido.bat` o `make dev`
4. ✅ Acceder a http://localhost:3000 (dev) o http://localhost (prod)
5. ⬜ Explorar la aplicación
6. ⬜ Leer la documentación completa
7. ⬜ ¡Desarrollar!

---

## 🎉 ¡Listo!

Si seguiste estos pasos, tu aplicación debería estar corriendo.

**¿Todo funcionando?** ¡Genial! Ahora puedes:
- Explorar la aplicación
- Hacer cambios (se actualizan automáticamente en dev)
- Leer la documentación para aprender más

**¿Algo no funciona?** 
- Revisa la sección de problemas arriba
- Consulta [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md)
- Verifica los logs: `make logs`

---

## 💡 Tips Útiles

```bash
# Ver uso de recursos
docker stats

# Acceder al shell del backend
docker exec -it skyway-backend sh

# Hacer backup de MongoDB
make db-backup

# Verificar salud de servicios
./healthcheck.sh   # Linux/Mac
```

---

## 📞 ¿Necesitas Ayuda?

1. 📖 Lee [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md) (guía completa)
2. 💻 Revisa [COMANDOS_DOCKER.md](./COMANDOS_DOCKER.md) (referencia rápida)
3. 🔍 Verifica los logs: `docker-compose logs -f`
4. 🏗️ Revisa la arquitectura: [ARQUITECTURA_DOCKER.md](./ARQUITECTURA_DOCKER.md)

---

**¡Feliz desarrollo!** 🚀

---

**Skyway Soluciones Informáticas**  
Sistema de Gestión de Inventario - Versión Dockerizada





