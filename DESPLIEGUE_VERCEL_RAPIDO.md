# ⚡ Despliegue Rápido en Vercel (2 minutos)

## 🎯 Opción 1: Usando la Web (Recomendado para Principiantes)

### 1. Ve a Vercel

Abre: https://vercel.com/new

### 2. Conecta GitHub y Selecciona el Repo

- Login con GitHub
- Busca tu repositorio: `SkywaySolucionesInformaticas_inventario_paginaWeb_frontend_backend.0.2`
- Click en **Import**

### 3. Configura el Proyecto

**En la página de configuración, asegúrate de:**

```
Framework Preset: Create React App
Root Directory: frontend_inventario_react-main  ← IMPORTANTE
Build Command: npm run build
Output Directory: build
```

### 4. Agrega Variable de Entorno

Click en **"Environment Variables"**:

```
Name:  REACT_APP_BASE_URL
Value: https://skywaysolucionesinformaticas-inventario.onrender.com
```

### 5. Deploy

Click en **Deploy** y espera 2-3 minutos. ¡Listo! 🎉

---

## 🎯 Opción 2: Usando Vercel CLI (Más Rápido)

### Paso 1: Navega al Frontend

```bash
cd frontend_inventario_react-main
```

### Paso 2: Instala Vercel CLI (si no lo tienes)

```bash
npm install -g vercel
```

### Paso 3: Login en Vercel

```bash
vercel login
```

### Paso 4: Despliega

```bash
vercel
```

Responde las preguntas:
- Set up and deploy? **Y**
- Which scope? **[Tu cuenta]**
- Link to existing project? **N**
- Project name? **skyway-soluciones** (o presiona Enter)
- Directory? **Enter** (usar ./)
- Override settings? **N**

### Paso 5: Configura Variable de Entorno

```bash
vercel env add REACT_APP_BASE_URL production
```

Pega este valor cuando te lo pida:
```
https://skywaysolucionesinformaticas-inventario.onrender.com
```

### Paso 6: Deploy a Producción

```bash
vercel --prod
```

**¡Listo!** Tu URL aparecerá en la terminal. 🎉

---

## ✅ Verificación

Una vez desplegado:

1. Abre la URL que Vercel te dio
2. La aplicación debería cargar
3. Si ves "Network Error", espera 30 segundos (el backend en Render está "despertando")
4. Refresca la página

---

## 🔧 Si Algo Sale Mal

### Error: "Failed to fetch" o "Network Error"

1. Abre en tu navegador: https://skywaysolucionesinformaticas-inventario.onrender.com/health
2. Espera a que responda (puede tardar 30-60 segundos la primera vez)
3. Vuelve a tu frontend y refresca

### Error: La página está en blanco

1. Verifica que la **Root Directory** sea `frontend_inventario_react-main`
2. Ve a Vercel Dashboard → Settings → General → Root Directory
3. Si está incorrecta, corrígela y haz **Redeploy**

### Error: Variables de entorno no funcionan

1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que `REACT_APP_BASE_URL` esté configurada
3. Debe estar asignada a: **Production, Preview, Development** (todas)
4. Haz **Redeploy** desde la pestaña Deployments

---

## 📊 Tu Aplicación Desplegada

```
Frontend:  https://[tu-proyecto].vercel.app
Backend:   https://skywaysolucionesinformaticas-inventario.onrender.com
Database:  MongoDB Atlas
```

**¡Todo en la nube!** 🌍☁️

---

## 💡 Próximos Pasos

- Personaliza tu dominio en Vercel (Settings → Domains)
- Configura HTTPS (ya viene habilitado por defecto)
- Monitorea tus deploys en el Dashboard de Vercel
- Cada push a `main` redesplegará automáticamente

¡Disfruta tu aplicación en producción! 🚀

