# 🌐 README - Despliegue en la Nube

Documentación sobre el despliegue de **Skyway Soluciones Informáticas** en Render y Vercel.

---

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
│                    (Navegador Web)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  VERCEL (Frontend)                           │
│        React App + Nginx (Archivos Estáticos)               │
│           https://tu-proyecto.vercel.app                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API REST
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 RENDER (Backend)                             │
│        Node.js + Express (API RESTful)                       │
│        https://skyway-backend.onrender.com                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MongoDB Protocol
                     │
┌────────────────────▼────────────────────────────────────────┐
│              MONGODB ATLAS (Database)                        │
│          Cluster de MongoDB en la nube                       │
│     mongodb+srv://cluster.mongodb.net/inventarios            │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto para Despliegue

```
SkywaySolucionesInformaticas/
├── backend_inventario_node_2023-main/   # Backend → Render
│   ├── .env.production.example          # Ejemplo de variables
│   ├── index.js                         # Punto de entrada
│   ├── package.json                     # Dependencias
│   └── ...
│
├── frontend_inventario_react-main/      # Frontend → Vercel
│   ├── .env.example                     # Ejemplo de variables
│   ├── vercel.json                      # Configuración Vercel
│   ├── package.json                     # Dependencias
│   ├── public/                          # Archivos estáticos
│   └── src/                             # Código fuente React
│
├── render.yaml                          # Config automática Render
├── DEPLOY.md                            # Guía completa de despliegue
└── DEPLOY_QUICK_START.md               # Inicio rápido
```

---

## 🚀 Archivos de Configuración Creados

### 1. `render.yaml`
Configuración automática para Render. Define:
- Tipo de servicio (Web Service)
- Comandos de build y start
- Variables de entorno requeridas
- Región y plan

### 2. `frontend_inventario_react-main/vercel.json`
Configuración de Vercel. Define:
- Rutas y redirects
- Build settings
- Variables de entorno

### 3. `.env.example` files
Plantillas de variables de entorno para:
- Backend (producción)
- Frontend (desarrollo y producción)

---

## 🔑 Variables de Entorno Necesarias

### Backend (Render)
```env
PORT=4001
NODE_ENV=production
MONGO_URI=mongodb+srv://...
EMAIL_USER=correo@outlook.com
EMAIL_PASS=contraseña_app
EMAIL_FROM=correo@outlook.com
```

### Frontend (Vercel)
```env
REACT_APP_BASE_URL=https://tu-backend.onrender.com
```

---

## 🌍 URLs de Despliegue

Después del despliegue, tendrás:

### Frontend (Vercel)
```
Producción: https://tu-proyecto.vercel.app
Preview:    https://tu-proyecto-git-branch.vercel.app
```

### Backend (Render)
```
API: https://skyway-backend.onrender.com
Endpoints:
  - /api/inventarios
  - /api/tipos
  - /marca
  - /estadoEquipo
  - /usuario
  - /api/agendar-visita
  - /api/contacto
```

---

## 📊 Proceso de Despliegue Automático

### Git Push → Auto Deploy

```bash
# 1. Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"

# 2. Push a GitHub
git push origin main

# 3. Automático:
# ├── Render detecta cambios → Rebuild backend
# └── Vercel detecta cambios → Rebuild frontend
```

---

## 🔒 Seguridad

### Variables de Entorno
- ✅ Nunca subir archivos `.env` a GitHub
- ✅ Usar `.gitignore` para excluir `.env`
- ✅ Configurar variables directamente en Render/Vercel Dashboard

### MongoDB Atlas
- ✅ Whitelist IP: 0.0.0.0/0 para servicios cloud
- ✅ Usar credenciales seguras
- ✅ Habilitar autenticación

### API
- ✅ CORS configurado correctamente
- ✅ HTTPS forzado en producción
- ✅ Validación de datos en backend

---

## 💾 Base de Datos

### MongoDB Atlas
```
Free Tier incluye:
- 512 MB de almacenamiento
- Backups automáticos
- Conexiones ilimitadas
- Replicación automática
```

**Configuración necesaria:**
1. Network Access: Permitir 0.0.0.0/0
2. Database User: Crear usuario con permisos
3. Connection String: Obtener y configurar en Render

---

## 🔄 CI/CD Pipeline

```
GitHub (main) → Push
       ↓
   ┌───┴───┐
   │       │
Render   Vercel
   │       │
Build    Build
   │       │
Deploy   Deploy
   │       │
   └───┬───┘
       ↓
  Production Ready
```

---

## 📈 Monitoreo

### Render
- Dashboard: Ver estado del servicio
- Logs: Logs en tiempo real
- Metrics: CPU, memoria, requests

### Vercel
- Analytics: Visitas, performance
- Logs: Build y function logs
- Insights: Core Web Vitals

---

## 💰 Costos (Planes Gratuitos)

| Servicio | Plan Gratuito | Límites |
|----------|---------------|---------|
| **Render** | Free | 750 hrs/mes, duerme después 15 min |
| **Vercel** | Hobby | 100 GB bandwidth, unlimited deploys |
| **MongoDB Atlas** | Free | 512 MB storage |

**Total:** $0/mes para proyectos pequeños 🎉

---

## 📚 Guías de Despliegue

1. **[DEPLOY.md](./DEPLOY.md)** - Guía completa paso a paso
2. **[DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)** - Inicio rápido en 10 minutos

---

## 🆘 Soporte y Troubleshooting

### Logs
```bash
# Ver logs de Render
https://dashboard.render.com → Tu servicio → Logs

# Ver logs de Vercel
https://vercel.com/dashboard → Tu proyecto → Deployments → Logs
```

### Comandos Útiles
```bash
# Verificar backend
curl https://skyway-backend.onrender.com/api/inventarios

# Test local antes de desplegar
npm run build  # En frontend
npm start      # En backend
```

---

## 🎯 Próximos Pasos

Después del despliegue inicial:

1. ✅ Configurar dominio personalizado
2. ✅ Habilitar HTTPS (automático en Vercel/Render)
3. ✅ Configurar notificaciones de email
4. ✅ Monitorear performance
5. ✅ Implementar analytics (Google Analytics, etc.)

---

## 📞 Enlaces Útiles

- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Documentación Render](https://render.com/docs)
- [Documentación Vercel](https://vercel.com/docs)

---

**Desarrollado por:** Skyway Soluciones Informáticas  
**Última actualización:** Octubre 2025  
**Versión:** 2.0

