# 🚀 Despliegue del Frontend en Vercel

Tu backend ya está funcionando en Render. Ahora vamos a desplegar el frontend en Vercel.

---

## 📋 Información de tu Backend

- **URL del Backend:** `https://skywaysolucionesinformaticas-inventario.onrender.com`
- **Estado:** ✅ Desplegado y funcionando
- **Base de datos:** ✅ Conectado a MongoDB Atlas

---

## 🎯 Pasos para Desplegar en Vercel (5 minutos)

### Paso 1: Accede a Vercel

1. Ve a: https://vercel.com
2. Haz click en **"Sign Up"** o **"Login"**
3. **Opción recomendada:** "Continue with GitHub"

### Paso 2: Importar tu Proyecto

1. Una vez dentro del dashboard, click en **"Add New..."** → **"Project"**
2. Verás tu repositorio de GitHub
3. Busca: **"SkywaySolucionesInformaticas_inventario_paginaWeb_frontend_backend.0.2"**
4. Click en **"Import"**

### Paso 3: Configurar el Proyecto

En la página de configuración:

#### 📁 Project Settings

```
Project Name: skyway-soluciones-informaticas
Framework Preset: Create React App
Root Directory: frontend_inventario_react-main
```

#### ⚙️ Build and Output Settings

```
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

#### 🔧 Environment Variables (MUY IMPORTANTE)

Click en **"Environment Variables"** y agrega:

```
Name: REACT_APP_BASE_URL
Value: https://skywaysolucionesinformaticas-inventario.onrender.com
```

**IMPORTANTE:** NO agregues "/" al final de la URL.

### Paso 4: Desplegar

1. Verifica que todo esté configurado correctamente
2. Click en **"Deploy"**
3. Espera 2-3 minutos mientras Vercel construye y despliega

---

## ✅ Verificación Post-Despliegue

Una vez desplegado, Vercel te mostrará:

```
🎉 Congratulations! Your project has been deployed!
```

Y verás tu URL: `https://tu-proyecto.vercel.app`

### Prueba tu Aplicación

1. Abre la URL en tu navegador
2. Verifica que la página cargue correctamente
3. Prueba iniciar sesión o crear un inventario
4. Si hay errores, verifica la consola del navegador (F12)

---

## 🔧 Solución de Problemas Comunes

### Error: "Network Error" o "Failed to fetch"

**Causa:** El backend en Render está "dormido" (plan gratuito)

**Solución:**
1. Abre tu backend directamente: https://skywaysolucionesinformaticas-inventario.onrender.com/health
2. Espera 30-60 segundos a que "despierte"
3. Refresca tu frontend

### Error: "Cross-Origin Request Blocked" (CORS)

**Ya está solucionado** - El backend ya tiene CORS habilitado

### La página carga pero no muestra datos

**Causa:** Variables de entorno no configuradas

**Solución:**
1. Ve a Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Verifica que `REACT_APP_BASE_URL` esté configurada correctamente
3. Si hiciste cambios, haz un nuevo deploy: Deployments → tres puntos → Redeploy

---

## 🎯 Configuración Automática de Vercel (Alternativa)

Si prefieres usar la CLI de Vercel (más rápido):

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Desplegar

```bash
cd frontend_inventario_react-main
vercel --prod
```

Cuando te pregunte:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta
- **Link to existing project?** → No
- **Project name?** → skyway-soluciones-informaticas
- **Directory?** → ./ (o presiona Enter)
- **Override settings?** → No

### 4. Configurar Variable de Entorno

```bash
vercel env add REACT_APP_BASE_URL
```

Cuando te pregunte el valor, pega:
```
https://skywaysolucionesinformaticas-inventario.onrender.com
```

Luego selecciona: **Production**

### 5. Redesplegar con la Variable

```bash
vercel --prod
```

---

## 🌐 URLs de tu Aplicación Desplegada

- **Frontend (Vercel):** `https://tu-proyecto.vercel.app`
- **Backend (Render):** `https://skywaysolucionesinformaticas-inventario.onrender.com`
- **Base de Datos (MongoDB Atlas):** Cluster ac-mxqbnkm

---

## 📊 Arquitectura Final

```
Usuario (Navegador)
      ↓
Frontend (Vercel)
      ↓ API REST
Backend (Render)
      ↓ MongoDB Driver
MongoDB Atlas
```

---

## 🎉 ¡Listo!

Una vez desplegado, tu aplicación estará completamente en la nube y accesible desde cualquier lugar del mundo. 🌍

**Nota:** La primera carga puede tardar 30-60 segundos si el backend está dormido (plan gratuito de Render).

