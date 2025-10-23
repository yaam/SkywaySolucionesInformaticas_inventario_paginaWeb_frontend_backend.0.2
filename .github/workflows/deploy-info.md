# 🔄 Información de CI/CD

Este repositorio está configurado para despliegue automático:

## 🚀 Despliegue Automático

### Backend (Render)
- **Trigger:** Push a rama `main`
- **Servicio:** Web Service en Render
- **Tiempo:** ~5-7 minutos
- **URL:** https://skyway-backend.onrender.com

### Frontend (Vercel)
- **Trigger:** Push a cualquier rama
- **Servicio:** Vercel
- **Tiempo:** ~2-3 minutos  
- **URL:** https://tu-proyecto.vercel.app

## 📋 Proceso

```
git push origin main
     ↓
  GitHub
     ↓
┌────┴────┐
│         │
Render  Vercel
│         │
Build   Build
│         │
Deploy  Deploy
```

## ✅ Verificación

Después de cada push, verifica:
- [ ] Render dashboard muestra "Live"
- [ ] Vercel dashboard muestra "Ready"
- [ ] Frontend carga correctamente
- [ ] API responde correctamente

---

Para más información: [DEPLOY.md](../../DEPLOY.md)

