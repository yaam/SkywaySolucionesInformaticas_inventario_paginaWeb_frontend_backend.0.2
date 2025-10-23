# 🚀 Guía de Despliegue - Skyway Soluciones Informáticas

Esta guía te llevará paso a paso para desplegar la aplicación en **Render** (backend) y **Vercel** (frontend).

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Despliegue del Backend en Render](#despliegue-del-backend-en-render)
3. [Despliegue del Frontend en Vercel](#despliegue-del-frontend-en-vercel)
4. [Configuración Post-Despliegue](#configuración-post-despliegue)
5. [Verificación](#verificación)
6. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [GitHub](https://github.com) con el repositorio del proyecto
- ✅ Cuenta en [Render](https://render.com) (gratis)
- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Base de datos MongoDB Atlas configurada
- ✅ Credenciales de email (Outlook/Gmail) para notificaciones

---

## 🟦 Despliegue del Backend en Render

### Paso 1: Preparar el Repositorio

El proyecto ya incluye el archivo `render.yaml` en la raíz que Render detectará automáticamente.

### Paso 2: Crear el Servicio en Render

1. **Ve a [Render Dashboard](https://dashboard.render.com/)**

2. **Haz clic en "New +" → "Web Service"**

3. **Conecta tu repositorio de GitHub:**
   - Autoriza a Render a acceder a tu GitHub
   - Selecciona el repositorio: `SkywaySolucionesInformaticas_inventario_paginaWeb_frontend_backend.0.2`

4. **Configuración del Servicio:**
   ```
   Name: skyway-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend_inventario_node_2023-main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### Paso 3: Configurar Variables de Entorno

En la sección "Environment" de Render, agrega las siguientes variables:

```env
PORT=4001
NODE_ENV=production
MONGO_URI=tu_connection_string_de_mongodb_atlas
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=tu_email@outlook.com
```

**⚠️ IMPORTANTE:** 
- Usa el **connection string completo** de MongoDB Atlas
- La contraseña de email debe ser una **contraseña de aplicación** si usas 2FA

### Paso 4: Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu backend
3. Espera aproximadamente 5-10 minutos
4. Una vez completado, recibirás una URL como: `https://skyway-backend.onrender.com`

**🔍 Verificar el Backend:**
```
https://skyway-backend.onrender.com/api/inventarios
```
Deberías recibir una respuesta JSON con los inventarios.

---

## 🔷 Despliegue del Frontend en Vercel

### Paso 1: Preparar Variables de Entorno Locales

Antes de desplegar, crea un archivo `.env` en `frontend_inventario_react-main/`:

```env
REACT_APP_BASE_URL=https://skyway-backend.onrender.com
```

**⚠️ Reemplaza** `skyway-backend.onrender.com` con la URL real de tu backend en Render.

### Paso 2: Subir Cambios a GitHub

```bash
cd frontend_inventario_react-main
# Asegúrate de que .env esté en .gitignore
git add .
git commit -m "feat: Configurar para despliegue en Vercel"
git push origin main
```

### Paso 3: Crear el Proyecto en Vercel

1. **Ve a [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Haz clic en "Add New..." → "Project"**

3. **Importar el Repositorio:**
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Busca y selecciona tu repositorio
   - Haz clic en "Import"

4. **Configuración del Proyecto:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend_inventario_react-main
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install --legacy-peer-deps
   ```

### Paso 4: Configurar Variables de Entorno en Vercel

En la sección "Environment Variables", agrega:

```
Variable Name: REACT_APP_BASE_URL
Value: https://skyway-backend.onrender.com
Environment: Production, Preview, Development
```

### Paso 5: Desplegar

1. Haz clic en **"Deploy"**
2. Vercel construirá y desplegará tu frontend
3. Espera aproximadamente 2-5 minutos
4. Recibirás una URL como: `https://tu-proyecto.vercel.app`

---

## ⚙️ Configuración Post-Despliegue

### 1. Actualizar CORS en el Backend

Si experimentas errores de CORS, asegúrate de que tu backend permita solicitudes desde tu dominio de Vercel.

En `backend_inventario_node_2023-main/index.js`, el CORS ya está configurado para aceptar todas las solicitudes:

```javascript
app.use(cors());
```

Para producción, puedes restringirlo:

```javascript
const corsOptions = {
  origin: [
    'https://tu-proyecto.vercel.app',
    'http://localhost:3000' // Para desarrollo local
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### 2. Configurar Dominio Personalizado (Opcional)

**En Vercel:**
- Ve a "Settings" → "Domains"
- Agrega tu dominio personalizado
- Sigue las instrucciones para configurar DNS

**En Render:**
- Ve a "Settings" → "Custom Domain"
- Agrega tu dominio personalizado
- Configura los registros DNS según las instrucciones

---

## ✅ Verificación

### Backend (Render)

Verifica que el backend esté funcionando:

```bash
# Obtener inventarios
curl https://skyway-backend.onrender.com/api/inventarios

# Obtener tipos de equipo
curl https://skyway-backend.onrender.com/api/tipos

# Obtener marcas
curl https://skyway-backend.onrender.com/marca
```

### Frontend (Vercel)

1. Abre tu URL de Vercel en el navegador
2. Verifica que la página cargue correctamente
3. Prueba las siguientes funcionalidades:
   - ✅ Ver inventarios
   - ✅ Ver activos
   - ✅ Agendar visita técnica
   - ✅ Gestión de visitas
   - ✅ Formulario de contacto

### Integración Completa

1. **Crear un nuevo inventario** desde el frontend
2. **Verificar** que se guarde correctamente en MongoDB
3. **Probar notificaciones de email** completando una visita técnica
4. **Verificar** que el token se envíe correctamente

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Causa:** String de conexión incorrecto o IP no permitida en MongoDB Atlas

**Solución:**
1. Ve a MongoDB Atlas
2. Network Access → Add IP Address
3. Permite acceso desde cualquier lugar (0.0.0.0/0) para servicios cloud
4. Verifica que el connection string sea correcto

### Error: "CORS policy blocked"

**Causa:** El backend no permite solicitudes desde el dominio del frontend

**Solución:**
1. Actualiza la configuración de CORS en `index.js`
2. Redespliega el backend en Render

### Error: "API returns 404"

**Causa:** La URL del backend está incorrecta en el frontend

**Solución:**
1. Verifica la variable `REACT_APP_BASE_URL` en Vercel
2. Asegúrate de que no tenga una barra al final: ❌ `https://api.com/` ✅ `https://api.com`
3. Redespliega en Vercel

### Error: "Build failed on Vercel"

**Causa:** Dependencias incompatibles o errores de compilación

**Solución:**
1. Asegúrate de usar `npm install --legacy-peer-deps` como comando de instalación
2. Revisa los logs de build en Vercel para identificar el error específico
3. Corrige los errores localmente y vuelve a desplegar

### Render: "Service is slow to start"

**Causa:** Los servicios gratuitos de Render se "duermen" después de inactividad

**Solución:**
- Es normal en el plan gratuito
- La primera solicitud después de inactividad tomará ~30 segundos
- Considera usar un servicio de "keep-alive" o actualizar al plan pago

---

## 📊 Monitoreo y Logs

### Render

Para ver logs del backend:
1. Ve a tu servicio en Render Dashboard
2. Click en "Logs"
3. Verás logs en tiempo real de tu aplicación

### Vercel

Para ver logs del frontend:
1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Deployments"
3. Selecciona un deployment
4. Click en "View Function Logs"

---

## 🔄 Redespliegue Automático

Ambos servicios están configurados para **redespliegue automático**:

- **Render**: Se redespliegará automáticamente cuando hagas `git push` a la rama `main`
- **Vercel**: Se redespliegará automáticamente con cada push a cualquier rama

---

## 💰 Costos

### Plan Gratuito - Render
- 750 horas/mes de servicio
- Servicio se duerme después de 15 minutos de inactividad
- 0.1 CPU / 512 MB RAM

### Plan Gratuito - Vercel
- 100 GB bandwidth/mes
- Despliegues ilimitados
- Dominio personalizado gratuito

**💡 Ambos servicios son suficientes para desarrollo y proyectos pequeños.**

---

## 🔗 Enlaces Útiles

- [Documentación de Render](https://render.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## 📞 Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Revisa los logs en Render y Vercel
2. Verifica que todas las variables de entorno estén configuradas correctamente
3. Asegúrate de que MongoDB Atlas permita conexiones desde Render
4. Verifica que el CORS esté configurado correctamente

---

**Última actualización:** Octubre 2025  
**Autor:** Skyway Soluciones Informáticas

