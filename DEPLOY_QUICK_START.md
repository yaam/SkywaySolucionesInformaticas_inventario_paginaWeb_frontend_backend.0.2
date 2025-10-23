# ⚡ Inicio Rápido - Despliegue en 10 Minutos

Guía express para desplegar rápidamente en Render y Vercel.

---

## 🎯 Paso 1: Preparación (2 minutos)

### Asegúrate de tener:
- ✅ Repositorio en GitHub
- ✅ MongoDB Atlas configurado con IP 0.0.0.0/0 permitida
- ✅ Credenciales de email (Outlook)

---

## 🟦 Paso 2: Desplegar Backend en Render (4 minutos)

1. **Ve a:** https://dashboard.render.com/

2. **Nuevo servicio:**
   - Click "New +" → "Web Service"
   - Conecta GitHub → Selecciona tu repo

3. **Configuración rápida:**
   ```
   Name: skyway-backend
   Root Directory: backend_inventario_node_2023-main
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variables de entorno (Critical!):**
   ```env
   PORT=4001
   NODE_ENV=production
   MONGO_URI=tu_mongodb_atlas_connection_string
   EMAIL_USER=tu_email@outlook.com
   EMAIL_PASS=tu_contraseña_aplicacion
   EMAIL_FROM=tu_email@outlook.com
   ```

5. **Deploy** → Espera 5 min → Copia tu URL: `https://tu-backend.onrender.com`

---

## 🔷 Paso 3: Desplegar Frontend en Vercel (4 minutos)

1. **Ve a:** https://vercel.com/new

2. **Importar proyecto:**
   - Conecta GitHub → Selecciona tu repo
   - Root Directory: `frontend_inventario_react-main`

3. **Build Settings:**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install --legacy-peer-deps
   ```

4. **Environment Variables:**
   ```env
   REACT_APP_BASE_URL=https://tu-backend.onrender.com
   ```
   (Usa la URL de Render del paso anterior)

5. **Deploy** → Espera 3 min → ¡Listo!

---

## ✅ Paso 4: Verificar

1. **Abre tu URL de Vercel**
2. **Prueba:** Ver inventarios, crear un activo
3. **Si funciona:** ¡Felicitaciones! 🎉

---

## 🐛 Problemas Comunes

### Frontend en blanco
- Verifica `REACT_APP_BASE_URL` en Vercel
- Sin barra al final: ✅ `https://api.com` ❌ `https://api.com/`

### Error de conexión MongoDB
- MongoDB Atlas → Network Access → Permitir 0.0.0.0/0
- Verifica connection string en Render

### Error CORS
- Ya está configurado, pero verifica que Render esté funcionando

---

## 📖 Documentación Completa

Para más detalles, consulta: [DEPLOY.md](./DEPLOY.md)

---

**Tiempo total:** ~10 minutos ⏱️  
**Costo:** $0 (planes gratuitos) 💰

