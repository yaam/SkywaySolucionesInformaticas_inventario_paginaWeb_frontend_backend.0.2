# ✅ Checklist de Dockerización - Skyway Soluciones Informáticas

## 📋 Checklist de Instalación

### Fase 1: Prerequisitos

- [ ] **Docker instalado**
  ```bash
  docker --version
  # Debe mostrar: Docker version 20.x.x o superior
  ```

- [ ] **Docker Compose instalado**
  ```bash
  docker compose version
  # Debe mostrar: Docker Compose version v2.x.x o superior
  ```

- [ ] **Docker está corriendo**
  ```bash
  docker ps
  # No debe mostrar error
  ```

- [ ] **Puertos disponibles**
  - Puerto 80 (Frontend producción)
  - Puerto 3000 (Frontend desarrollo)
  - Puerto 4001 (Backend)
  - Puerto 27017 (MongoDB local, opcional)

### Fase 2: Configuración

- [ ] **Archivo .env creado**
  ```bash
  # Windows
  copy env.docker.example .env
  
  # Linux/Mac
  cp env.docker.example .env
  ```

- [ ] **Variables configuradas en .env**
  - [ ] `MONGO_URI` configurado (MongoDB Atlas o local)
  - [ ] `EMAIL_USER` configurado
  - [ ] `EMAIL_PASS` configurado (contraseña de aplicación)
  - [ ] `EMAIL_FROM` configurado
  - [ ] `REACT_APP_BASE_URL` configurado

### Fase 3: Primera Ejecución

- [ ] **Construir imágenes**
  ```bash
  docker-compose build
  ```

- [ ] **Iniciar servicios**
  ```bash
  # Desarrollo
  make dev
  # o
  docker-compose -f docker-compose.dev.yml up
  
  # Producción
  make prod
  # o
  docker-compose up -d
  ```

- [ ] **Verificar contenedores activos**
  ```bash
  docker-compose ps
  ```
  Debes ver:
  - ✅ skyway-backend (Up, healthy)
  - ✅ skyway-frontend (Up, healthy)
  - ✅ skyway-mongodb (Up, healthy) - si usas MongoDB local

### Fase 4: Verificación

- [ ] **Frontend accesible**
  - Desarrollo: http://localhost:3000
  - Producción: http://localhost

- [ ] **Backend accesible**
  - http://localhost:4001

- [ ] **Sin errores en logs**
  ```bash
  docker-compose logs backend
  docker-compose logs frontend
  ```

- [ ] **MongoDB conectado**
  - Buscar en logs del backend: "✅ Conectado exitosamente a MongoDB"

### Fase 5: Funcionalidad

- [ ] **Frontend carga correctamente**
  - La página principal se ve bien
  - No hay errores en la consola del navegador

- [ ] **Backend responde**
  - Las APIs funcionan
  - Se pueden listar inventarios, usuarios, etc.

- [ ] **Base de datos funciona**
  - Se pueden crear registros
  - Se pueden leer registros
  - Se pueden actualizar registros
  - Se pueden eliminar registros

- [ ] **Subida de archivos funciona**
  - Las imágenes se suben correctamente
  - Se guardan en `/uploads`

- [ ] **Email funciona** (si está configurado)
  - Se envían notificaciones
  - Se reciben en el correo configurado

## 🔧 Checklist de Desarrollo

### Desarrollo Diario

- [ ] **Iniciar en modo desarrollo**
  ```bash
  make dev
  ```

- [ ] **Hot-reload funciona**
  - [ ] Cambios en el backend se detectan automáticamente
  - [ ] Cambios en el frontend se detectan automáticamente

- [ ] **Ver logs en tiempo real**
  ```bash
  make logs
  ```

### Testing

- [ ] **Probar en modo producción**
  ```bash
  make prod
  ```

- [ ] **Verificar optimizaciones**
  - [ ] Frontend se sirve con nginx
  - [ ] Compresión gzip activa
  - [ ] Archivos estáticos cacheados

### Mantenimiento

- [ ] **Backup de base de datos**
  ```bash
  make db-backup
  ```

- [ ] **Logs no exceden límite**
  ```bash
  docker system df
  ```

- [ ] **Limpiar recursos no usados**
  ```bash
  make clean
  ```

## 🚀 Checklist de Despliegue en Producción

### Pre-Despliegue

- [ ] **Variables de entorno de producción configuradas**
  - [ ] `MONGO_URI` apunta a MongoDB Atlas
  - [ ] Emails configurados correctamente
  - [ ] `REACT_APP_BASE_URL` apunta al dominio real

- [ ] **Secrets configurados**
  - [ ] No usar archivos .env en producción
  - [ ] Usar secrets del proveedor cloud

- [ ] **Dominio configurado**
  - [ ] DNS apunta al servidor
  - [ ] SSL/TLS configurado

### Despliegue

- [ ] **Imágenes construidas**
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
  ```

- [ ] **Servicios iniciados**
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```

- [ ] **Health checks pasando**
  ```bash
  docker inspect --format='{{.State.Health.Status}}' skyway-backend
  docker inspect --format='{{.State.Health.Status}}' skyway-frontend
  ```

### Post-Despliegue

- [ ] **Verificar accesibilidad**
  - [ ] Frontend carga desde el dominio
  - [ ] Backend API responde
  - [ ] MongoDB conectado

- [ ] **Monitoreo configurado**
  - [ ] Logs centralizados
  - [ ] Alertas configuradas
  - [ ] Métricas siendo recolectadas

- [ ] **Backups automáticos**
  - [ ] Configurados en MongoDB Atlas
  - [ ] o configurado cron job para backups

- [ ] **HTTPS funcionando**
  - [ ] Certificado SSL válido
  - [ ] Redirección HTTP -> HTTPS

## 🔒 Checklist de Seguridad

### Archivos y Secretos

- [ ] **.env no está en Git**
  ```bash
  git status
  # .env NO debe aparecer
  ```

- [ ] **Contraseñas seguras**
  - [ ] MongoDB password fuerte
  - [ ] Email app password correcto
  - [ ] No usar contraseñas por defecto

- [ ] **Puertos necesarios**
  - [ ] Solo exponer puertos necesarios
  - [ ] MongoDB NO expuesto en producción

### Contenedores

- [ ] **Imágenes actualizadas**
  ```bash
  docker pull node:16-alpine
  docker pull mongo:6.0
  docker pull nginx:alpine
  ```

- [ ] **Sin vulnerabilidades conocidas**
  ```bash
  docker scan skyway-backend
  docker scan skyway-frontend
  ```

- [ ] **Límites de recursos configurados**
  - Ver `docker-compose.prod.yml`

## 📊 Checklist de Performance

### Optimización

- [ ] **Imágenes optimizadas**
  - [ ] Frontend: < 100MB
  - [ ] Backend: < 250MB

- [ ] **Gzip habilitado** (nginx)
  ```bash
  curl -I http://localhost | grep -i gzip
  ```

- [ ] **Cache configurado**
  - Headers de cache en archivos estáticos

- [ ] **Resource limits en producción**
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 512M
  ```

### Monitoreo

- [ ] **Ver uso de recursos**
  ```bash
  docker stats
  ```

- [ ] **No hay memory leaks**
  - Monitorear uso de memoria a lo largo del tiempo

- [ ] **Tiempos de respuesta aceptables**
  - Frontend: < 2s carga inicial
  - Backend APIs: < 500ms

## 🐛 Checklist de Troubleshooting

### Problemas Comunes

- [ ] **Puerto ocupado**
  - [ ] Cambiar puerto en docker-compose.yml
  - [ ] o detener el proceso que usa el puerto

- [ ] **No conecta a MongoDB**
  - [ ] Verificar MONGO_URI en .env
  - [ ] Verificar whitelist de IPs en Atlas
  - [ ] Ver logs: `docker-compose logs backend`

- [ ] **Frontend no carga**
  - [ ] Verificar logs: `docker-compose logs frontend`
  - [ ] Verificar nginx.conf
  - [ ] Limpiar caché del navegador

- [ ] **Hot-reload no funciona**
  - [ ] Verificar volúmenes en docker-compose.dev.yml
  - [ ] Reconstruir: `docker-compose build --no-cache`

### Comandos de Diagnóstico

- [ ] **Ver estado**
  ```bash
  docker-compose ps
  ```

- [ ] **Ver logs**
  ```bash
  docker-compose logs -f
  ```

- [ ] **Inspeccionar contenedor**
  ```bash
  docker inspect skyway-backend
  ```

- [ ] **Ver redes**
  ```bash
  docker network ls
  docker network inspect skywaysolucionesinformaticas_skyway-network
  ```

- [ ] **Ver volúmenes**
  ```bash
  docker volume ls
  docker volume inspect skywaysolucionesinformaticas_mongodb_data
  ```

## 📝 Checklist de Documentación

- [ ] **README actualizado**
- [ ] **Variables de entorno documentadas**
- [ ] **Comandos comunes documentados**
- [ ] **Arquitectura documentada**
- [ ] **Proceso de despliegue documentado**

## ✅ Checklist Final

### Todo Funcionando

- [x] Docker instalado y configurado
- [x] Archivos Docker creados
- [x] docker-compose.yml configurado
- [x] .env configurado
- [x] Servicios iniciados
- [x] Frontend accesible
- [x] Backend funcionando
- [x] MongoDB conectado
- [x] Logs sin errores
- [x] Hot-reload funcionando (dev)
- [x] Optimizaciones aplicadas (prod)

### Listo para Desarrollo

```bash
✅ make dev
✅ Abrir http://localhost:3000
✅ Hacer cambios
✅ Ver cambios en tiempo real
```

### Listo para Producción

```bash
✅ make prod
✅ Verificar http://localhost
✅ Configurar dominio
✅ Configurar SSL
✅ Configurar monitoreo
✅ Configurar backups
```

## 🎉 ¡Completado!

Si todos los checks están marcados, ¡felicitaciones! 🎊

Tu aplicación está completamente dockerizada y lista para usar.

---

**Próximos pasos:**
1. Empezar a desarrollar
2. Leer la documentación completa
3. Explorar comandos avanzados
4. Configurar para producción

**Recursos:**
- [EMPIEZA_AQUI.md](./EMPIEZA_AQUI.md) - Guía de inicio
- [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md) - Guía completa
- [COMANDOS_DOCKER.md](./COMANDOS_DOCKER.md) - Referencia de comandos





