# 🔧 Configuración de Variables de Entorno en Render

## ❌ Error Común: "MONGO_URI no está configurada"

Si ves este error, significa que **no has configurado las variables de entorno en Render**.

---

## ✅ Solución: Configurar Variables en Render Dashboard

### Paso 1: Ve a tu Servicio en Render

1. Abre: https://dashboard.render.com
2. Click en tu servicio: **skyway-backend** (o el nombre que le hayas dado)

### Paso 2: Ir a Environment

1. En el menú lateral izquierdo, click en **"Environment"**
2. O ve a la pestaña superior **"Environment"**

### Paso 3: Agregar Variables de Entorno

Click en **"Add Environment Variable"** y agrega una por una:

#### Variable 1: MONGO_URI
```
Key: MONGO_URI
Value: mongodb+srv://<USUARIO>:<PASSWORD>@<cluster>.<id>.mongodb.net/<base>?retryWrites=true&w=majority
```

#### Variable 2: PORT
```
Key: PORT
Value: 4001
```

#### Variable 3: NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### Variable 4: SENDGRID_API_KEY
```
Key: SENDGRID_API_KEY
Value: SG.xxxxxxxx
```

#### Variable 5: EMAIL_FROM
```
Key: EMAIL_FROM
Value: <remitente verificado en SendGrid>
```

#### Variable 6: EMAIL_TO
```
Key: EMAIL_TO
Value: <correo que recibe las notificaciones>
```

#### Variables 7-10: panel administrador y CORS
```
ADMIN_USER       usuario del panel
ADMIN_PASSWORD   contraseña del panel
JWT_SECRET       texto aleatorio de 32+ caracteres
ALLOWED_ORIGINS  https://skyway-soluciones-informaticas-inve.vercel.app
```

### Paso 4: Guardar y Redesplegar

1. Click en **"Save Changes"** (arriba a la derecha)
2. Render automáticamente **redesplegará** tu servicio
3. Espera 3-5 minutos

---

## 📋 Checklist de Variables Requeridas

Asegúrate de tener **TODAS** estas variables configuradas:

- [ ] `MONGO_URI` - Connection string de MongoDB Atlas
- [ ] `PORT` - Puerto del servidor (4001)
- [ ] `NODE_ENV` - Entorno (production)
- [ ] `SENDGRID_API_KEY` - API key de SendGrid (`SG.…`, permiso Mail Send)
- [ ] `EMAIL_FROM` - Remitente verificado en SendGrid (si falta se usa `EMAIL_USER`)
- [ ] `EMAIL_TO` - Destinatario de las notificaciones
- [ ] `ADMIN_USER`, `ADMIN_PASSWORD` - Acceso al panel
- [ ] `JWT_SECRET` - 32+ caracteres (sin él el panel responde 503)
- [ ] `ALLOWED_ORIGINS` - Dominio del frontend en Vercel

---

## 🔍 Verificar MongoDB Atlas

**IMPORTANTE:** Antes de desplegar, verifica en MongoDB Atlas:

### 1. Permitir Acceso desde Cualquier IP

1. Ve a: https://cloud.mongodb.com
2. Network Access → IP Access List
3. Click **"Add IP Address"**
4. Selecciona **"Allow access from anywhere"**
5. Esto agregará: `0.0.0.0/0`
6. Click **"Confirm"**

### 2. Verificar Credenciales de Base de Datos

1. Database Access → Database Users
2. Asegúrate de que el usuario existe y tiene permisos
3. Usuario actual: `<USUARIO>`

---

## 🎯 Cómo Se Ven las Variables en Render

En el dashboard de Render, deberías ver algo así:

```
MONGO_URI          mongodb+srv://<USUARIO>...  [Edit] [Delete]
PORT               4001                        [Edit] [Delete]
NODE_ENV           production                  [Edit] [Delete]
SENDGRID_API_KEY   ****************            [Edit] [Delete]
EMAIL_FROM         <remitente verificado>      [Edit] [Delete]
EMAIL_TO           <destinatario>              [Edit] [Delete]
ADMIN_USER         ****************            [Edit] [Delete]
ADMIN_PASSWORD     ****************            [Edit] [Delete]
JWT_SECRET         ****************            [Edit] [Delete]
ALLOWED_ORIGINS    https://skyway-...vercel.app [Edit] [Delete]
```

---

## 🚨 Solución de Problemas

### Error: "MONGO_URI no está configurada"
✅ **Solución:** Agrega la variable MONGO_URI en Render → Environment

### Error: "MongoNetworkError: connection timed out"
✅ **Solución:** Configura 0.0.0.0/0 en MongoDB Atlas → Network Access

### Error: "Authentication failed"
✅ **Solución:** Verifica usuario y contraseña en MongoDB Atlas

### El servicio se despliega pero no responde
✅ **Solución:** 
1. Revisa los logs en Render
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que el puerto sea 4001

---

## 🔄 Después de Configurar Variables

Una vez que agregues todas las variables:

1. **Render redesplegará automáticamente**
2. Ve a la pestaña **"Logs"**
3. Deberías ver:
   ```
   ✅ Conectado exitosamente a MongoDB
   Servidor Corriendo en el puerto 4001
   ```

---

## 📸 Capturas de Pantalla de Referencia

### Dónde agregar variables:
```
Dashboard → [Tu Servicio] → Environment → Add Environment Variable
```

### Formato de cada variable:
```
┌─────────────────────────────────────┐
│ Key:   MONGO_URI                    │
│ Value: mongodb+srv://...            │
│                                     │
│ [Cancel]           [Add Variable]  │
└─────────────────────────────────────┘
```

---

## ✅ Verificación Final

Después de configurar todo:

```bash
# Prueba tu API
curl https://tu-backend.onrender.com/api/inventarios

# Deberías recibir un JSON con los inventarios
```

---

## 🆘 ¿Aún Tienes Problemas?

1. **Verifica los logs** en Render Dashboard → Logs
2. **Comprueba que todas las 6 variables** estén configuradas
3. **Asegúrate de que MongoDB Atlas** permita 0.0.0.0/0
4. **Espera 5 minutos** después de guardar las variables

---

**Última actualización:** Octubre 2025  
**Soporte:** Skyway Soluciones Informáticas

