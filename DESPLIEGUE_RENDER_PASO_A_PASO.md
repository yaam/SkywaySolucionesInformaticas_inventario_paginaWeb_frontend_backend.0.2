# 🚀 Despliegue en Render - Paso a Paso

## 🎯 Objetivo

Desplegar el backend en Render para que los correos funcionen correctamente en producción.

**Problema en local:** Tu ISP bloquea las conexiones SMTP  
**Solución:** Render NO tiene este problema ✅

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta de GitHub
- ✅ Repositorio en GitHub con tu código
- ✅ Cuenta de Render (gratis: https://render.com)
- ✅ Cuenta de MongoDB Atlas configurada
- ✅ Contraseña de aplicación de Outlook: `<CONTRASEÑA_DE_APLICACION>`

---

## 🔥 PASO 1: Preparar MongoDB Atlas

### 1.1 Permitir Acceso desde Render

1. **Ve a:** https://cloud.mongodb.com
2. **Inicia sesión** con tu cuenta
3. **Selecciona tu cluster** (Skyway-Soluciones-Informaticas)
4. **Ve a:** **Network Access** (menú lateral)
5. **Click en:** **"Add IP Address"**
6. **Selecciona:** **"Allow access from anywhere"**
7. **Se agregará:** `0.0.0.0/0`
8. **Click en:** **"Confirm"**

### 1.2 Verificar Connection String

1. **Ve a:** **Database** → **Connect**
2. **Click en:** **"Connect your application"**
3. **Copia el connection string:** 
   ```
   mongodb+srv://User_mongoDB_user:Password_MongoDB@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
   ```
4. **Guárdalo** para el siguiente paso

---

## 🚀 PASO 2: Subir Código a GitHub

### 2.1 Verificar que el Código Esté Actualizado

```bash
cd C:\Users\YAAM\OneDrive\Escritorio\SkywaySolucionesInformaticas
```

### 2.2 Verificar Estado de Git

```bash
git status
```

### 2.3 Agregar Cambios

```bash
git add .
```

### 2.4 Hacer Commit

```bash
git commit -m "feat: optimización de envío de emails con Outlook"
```

### 2.5 Subir a GitHub

```bash
git push origin main
```

**⚠️ IMPORTANTE:** El archivo `.env` NO debe subirse a GitHub (está en .gitignore)

---

## 🌐 PASO 3: Crear Servicio en Render

### 3.1 Ir a Render Dashboard

1. **Ve a:** https://dashboard.render.com
2. **Inicia sesión** con tu cuenta
3. **Click en:** **"New +"** (arriba a la derecha)
4. **Selecciona:** **"Web Service"**

### 3.2 Conectar Repositorio

1. **Conecta tu cuenta de GitHub** (si no lo has hecho)
2. **Busca tu repositorio:** `SkywaySolucionesInformaticas`
3. **Click en:** **"Connect"**

### 3.3 Configurar el Servicio

**Name:**
```
skyway-backend
```

**Region:**
```
Oregon (US West)
```

**Branch:**
```
main
```

**Root Directory:**
```
(dejar vacío)
```

**Runtime:**
```
Node
```

**Build Command:**
```
cd backend_inventario_node_2023-main && npm install
```

**Start Command:**
```
cd backend_inventario_node_2023-main && npm start
```

**Plan:**
```
Free
```

### 3.4 NO Hacer Click en "Create Web Service" Todavía

Primero configuraremos las variables de entorno ⬇️

---

## 🔐 PASO 4: Configurar Variables de Entorno

**ANTES de crear el servicio**, baja hasta **"Environment Variables"**

### Variable 1: NODE_ENV
```
Key:   NODE_ENV
Value: production
```
**Click:** "Add Environment Variable"

### Variable 2: PORT
```
Key:   PORT
Value: 4001
```
**Click:** "Add Environment Variable"

### Variable 3: MONGO_URI
```
Key:   MONGO_URI
Value: mongodb+srv://User_mongoDB_user:Password_MongoDB@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
```
**⚠️ IMPORTANTE:** Copia EXACTAMENTE el connection string de MongoDB Atlas  
**Click:** "Add Environment Variable"

### Variable 4: EMAIL_USER
```
Key:   EMAIL_USER
Value: yaam17@outlook.com
```
**Click:** "Add Environment Variable"

### Variable 5: EMAIL_PASS
```
Key:   EMAIL_PASS
Value: <CONTRASEÑA_DE_APLICACION>
```
**⚠️ IMPORTANTE:** Esta es tu contraseña de aplicación de Outlook  
**Click:** "Add Environment Variable"

### Variable 6: EMAIL_FROM
```
Key:   EMAIL_FROM
Value: yaam17@outlook.com
```
**Click:** "Add Environment Variable"

---

## ✅ PASO 5: Crear el Servicio

1. **Verifica que tengas las 6 variables configuradas:**
   - NODE_ENV
   - PORT
   - MONGO_URI
   - EMAIL_USER
   - EMAIL_PASS
   - EMAIL_FROM

2. **Scroll hacia arriba**

3. **Click en:** **"Create Web Service"**

4. **Espera 5-7 minutos** mientras Render despliega tu aplicación

---

## 📊 PASO 6: Verificar el Despliegue

### 6.1 Observar los Logs

1. En el dashboard de Render, ve a la pestaña **"Logs"**
2. **Deberías ver:**
   ```
   Installing dependencies...
   npm install
   Building...
   Starting service...
   ✅ MONGO_URI configurada correctamente
   🚀 Servidor corriendo en 0.0.0.0:4001
   📍 Environment: production
   ✅ Conectado exitosamente a MongoDB
   ```

### 6.2 Verificar el Health Check

1. **Copia la URL** de tu servicio (algo como):
   ```
   https://skyway-backend.onrender.com
   ```

2. **Abre en el navegador:**
   ```
   https://skyway-backend.onrender.com/health
   ```

3. **Deberías ver:**
   ```json
   {
     "status": "ok",
     "message": "Server is running"
   }
   ```

---

## 🧪 PASO 7: Probar el Envío de Correos

### 7.1 Probar el Endpoint de Contacto

Usa PowerShell para probar:

```powershell
$body = '{"nombre":"Prueba desde Render","email":"test@test.com","telefono":"123","mensaje":"Probando emails desde producción"}';
Invoke-RestMethod -Uri "https://skyway-backend.onrender.com/api/contacto" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json
```

### 7.2 Resultado Esperado

```json
{
  "mensaje": "Mensaje de contacto recibido con éxito y notificación enviada",
  "emailEnviado": true,
  "mensajeContacto": { ... }
}
```

### 7.3 Verificar el Email

1. **Abre:** https://outlook.live.com
2. **Inicia sesión** con: `yaam17@outlook.com`
3. **Deberías recibir** el email en **5-10 segundos** ⚡
4. **Asunto:** 🔔 Nuevo Cliente Solicita Contacto - Skyway Soluciones Informáticas

---

## 🌐 PASO 8: Actualizar el Frontend

### 8.1 Actualizar la URL del Backend en Vercel

1. **Ve a:** https://vercel.com/dashboard
2. **Selecciona tu proyecto** del frontend
3. **Ve a:** **Settings** → **Environment Variables**
4. **Busca:** `REACT_APP_BASE_URL`
5. **Actualiza el valor a:**
   ```
   https://skyway-backend.onrender.com
   ```
6. **Guarda los cambios**
7. **Redeployes** el frontend

### 8.2 O Actualiza Localmente

Si quieres probar localmente primero:

1. **Abre:** `frontend_inventario_react-main/src/helpers/axios-config.js`
2. **Actualiza la baseURL:**
   ```javascript
   const baseURL = 'https://skyway-backend.onrender.com';
   ```
3. **Reinicia el frontend**

---

## 🎉 ¡LISTO! Tu Sistema Está en Producción

### ✅ Checklist Final

- [ ] Backend desplegado en Render
- [ ] MongoDB Atlas con IP 0.0.0.0/0
- [ ] 6 variables de entorno configuradas
- [ ] Health check respondiendo
- [ ] Email de prueba enviado y recibido
- [ ] Frontend apuntando al backend de Render

---

## 📊 URLs de tu Sistema

### Backend (Render)
```
https://skyway-backend.onrender.com
```

**Endpoints:**
- Health: `/health`
- Contacto: `/api/contacto` (POST)
- Inventarios: `/api/inventarios` (GET)
- Visitas: `/api/agendar-visita` (POST)

### Frontend (Vercel)
```
https://skyway-soluciones-informaticas-inve.vercel.app
```

### MongoDB Atlas
```
https://cloud.mongodb.com
```

---

## 🐛 Solución de Problemas

### El servicio se queda "deploying" por mucho tiempo

**Solución:**
1. Ve a los logs
2. Busca errores de npm install
3. Verifica que el `package.json` esté correcto

### Error: "MONGO_URI no está configurada"

**Solución:**
1. Ve a Environment en Render
2. Verifica que MONGO_URI exista
3. Redeployea manualmente

### Los correos siguen sin enviarse

**Solución:**
1. Verifica que EMAIL_PASS sea: `<CONTRASEÑA_DE_APLICACION>`
2. Revisa los logs para ver el error exacto
3. Asegúrate de que la contraseña de aplicación sea válida

### El backend se "duerme" después de 15 minutos

**Esto es normal en el plan Free de Render:**
- Se duerme tras 15 minutos de inactividad
- Se "despierta" cuando recibe una petición (tarda 30-60 segundos)
- **Solución:** Upgrade a plan pagado ($7/mes) para 24/7

---

## 💡 Mejoras Futuras

### Mantener el Backend Activo (Plan Free)

Crea un servicio de "ping" que llame al health check cada 10 minutos:

- UptimeRobot (gratis): https://uptimerobot.com
- Cron-job.org (gratis): https://cron-job.org

### Upgrade a Plan Pagado

**$7/mes por servicio** - Beneficios:
- ✅ Siempre activo (24/7)
- ✅ Más memoria y CPU
- ✅ SSL automático
- ✅ Logs persistentes

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en Render Dashboard
2. **Verifica las variables** de entorno
3. **Prueba el health check** primero
4. **Revisa MongoDB Atlas** Network Access

---

**Fecha:** Octubre 24, 2025  
**Sistema:** Skyway Soluciones Informáticas  
**Backend:** Render (Node.js + Express)  
**Frontend:** Vercel (React)  
**Base de Datos:** MongoDB Atlas  
**Email:** Outlook con contraseña de aplicación

---

¡Tu sistema está listo para producción con envío de correos funcionando! 🎉⚡

