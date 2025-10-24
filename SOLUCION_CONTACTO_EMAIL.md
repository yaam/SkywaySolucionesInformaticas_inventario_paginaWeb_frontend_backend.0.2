# 🔧 Solución: Formulario de Contacto no Envía Emails

## ❌ Problema

El formulario de contacto en Vercel no envía emails y no muestra ningún mensaje de error/éxito.

---

## 🔍 Diagnóstico

### Paso 1: Verifica que el Backend Esté Respondiendo

El backend en Render (plan gratuito) se "duerme" después de 15 minutos de inactividad.

**Abre esta URL en tu navegador:**
```
https://skywaysolucionesinformaticas-inventario.onrender.com/health
```

**Deberías ver:**
```json
{"status":"ok","message":"Server is running"}
```

**Si tarda más de 30 segundos o no responde:**
- El backend está dormido
- Espera 60 segundos a que "despierte"
- Refresca la página

---

### Paso 2: Verifica los Logs en la Consola del Navegador

1. **Abre el formulario de contacto** en: https://skyway-soluciones-informaticas-inve.vercel.app/contacto
2. **Presiona F12** para abrir DevTools
3. **Ve a la pestaña "Console"**
4. **Llena el formulario y haz click en "Enviar Mensaje"**
5. **Observa si aparecen errores**

**Errores comunes:**

#### Error: "Network Error" o "ERR_CONNECTION_REFUSED"
```
❌ Error: Network Error
```
**Solución:** El backend está dormido. Abre el health check (paso 1) y espera.

#### Error: "404 Not Found"
```
❌ POST https://skywaysolucionesinformaticas-inventario.onrender.com/api/contacto 404
```
**Solución:** La ruta del backend no está configurada. Verifica que el endpoint exista.

#### Error: "500 Internal Server Error"
```
❌ POST https://skywaysolucionesinformaticas-inventario.onrender.com/api/contacto 500
```
**Solución:** Variables de entorno faltantes en Render (ver Paso 3).

---

### Paso 3: Verifica Variables de Entorno en Render

**El formulario de contacto REQUIERE estas variables en Render:**

1. **Ve a:** https://dashboard.render.com
2. **Selecciona tu servicio:** `skyway-backend` (o similar)
3. **Ve a:** Environment (menú lateral izquierdo)
4. **Verifica que existan:**

```
EMAIL_USER = yaam17@outlook.com
EMAIL_PASS = [tu_contraseña_aplicacion_outlook]
EMAIL_FROM = yaam17@outlook.com
```

**Si faltan, agrégalas:**

#### Variable: EMAIL_USER
```
Key:   EMAIL_USER
Value: yaam17@outlook.com
```

#### Variable: EMAIL_PASS
```
Key:   EMAIL_PASS
Value: [tu_contraseña_aplicacion_outlook]
```

**⚠️ IMPORTANTE:** `EMAIL_PASS` debe ser una **contraseña de aplicación** de Outlook, NO tu contraseña normal.

#### Cómo Crear una Contraseña de Aplicación en Outlook:

1. Ve a: https://account.microsoft.com/security
2. Click en **"Opciones de seguridad avanzadas"**
3. Busca **"Contraseñas de aplicación"** o **"App passwords"**
4. Click en **"Crear una nueva contraseña de aplicación"**
5. Copia la contraseña generada (ejemplo: `abcd efgh ijkl mnop`)
6. **Pégala en Render sin espacios:** `abcdefghijklmnop`

#### Variable: EMAIL_FROM
```
Key:   EMAIL_FROM
Value: yaam17@outlook.com
```

---

### Paso 4: Redesplegar el Backend (Después de Agregar Variables)

**Si agregaste variables de entorno:**

1. En Render Dashboard
2. Ve a la pestaña **"Manual Deploy"**
3. Click en **"Deploy latest commit"**
4. Espera 2-3 minutos
5. Prueba el formulario nuevamente

---

## ✅ Verificación Final

Una vez configurado todo:

### 1. Prueba el Health Check
```
https://skywaysolucionesinformaticas-inventario.onrender.com/health
```
Debe responder en menos de 5 segundos.

### 2. Prueba el Formulario

1. Ve a: https://skyway-soluciones-informaticas-inve.vercel.app/contacto
2. Llena todos los campos
3. Click en **"Enviar Mensaje"**
4. **Deberías ver:**
   ```
   ✅ ¡Mensaje enviado con éxito!
   Hemos recibido tu mensaje. El equipo de Skyway Soluciones Informáticas 
   se pondrá en contacto contigo pronto.
   ```

### 3. Revisa tu Email

Revisa la bandeja de entrada de **yaam17@outlook.com**

Deberías recibir un correo con:
- **Asunto:** 🔔 Nuevo Cliente Solicita Contacto - Skyway Soluciones Informáticas
- **Contenido:** Los datos del cliente y su mensaje

---

## 🔧 Diagnóstico Avanzado: Logs del Backend en Render

Si el formulario sigue sin funcionar:

1. **Ve a Render Dashboard**
2. **Selecciona tu servicio**
3. **Ve a la pestaña "Logs"**
4. **Envía un mensaje desde el formulario**
5. **Observa los logs en tiempo real**

**Logs esperados (exitoso):**
```
📧 Intentando enviar correo desde: yaam17@outlook.com
🔐 Contraseña configurada: ✅ Sí (oculta)
✅ Correo de notificación enviado exitosamente a yaam17@outlook.com
📬 ID del mensaje: <message-id>
```

**Logs con error (credenciales incorrectas):**
```
📧 Intentando enviar correo desde: yaam17@outlook.com
🔐 Contraseña configurada: ❌ NO CONFIGURADA
❌ ERROR: EMAIL_USER o EMAIL_PASS no configurados en .env
```

o

```
📧 Intentando enviar correo desde: yaam17@outlook.com
🔐 Contraseña configurada: ✅ Sí (oculta)
❌ Error al enviar correo: Invalid login: 535 5.7.3 Authentication unsuccessful
⚠️ Verifica que EMAIL_PASS sea la contraseña de aplicación de Outlook
```

---

## 📊 Checklist Completo

- [ ] Backend en Render está activo (health check responde)
- [ ] `EMAIL_USER` configurado en Render
- [ ] `EMAIL_PASS` configurado en Render (contraseña de aplicación)
- [ ] `EMAIL_FROM` configurado en Render
- [ ] Backend redesplegado después de agregar variables
- [ ] Frontend en Vercel carga correctamente
- [ ] Formulario muestra mensaje de éxito al enviar
- [ ] Email recibido en yaam17@outlook.com

---

## 🆘 Si Aún No Funciona

**Contacta con estos datos:**

1. Captura de pantalla del formulario con F12 abierto (pestaña Console)
2. Captura de los logs de Render (después de enviar el formulario)
3. Confirmación de que las variables EMAIL_USER, EMAIL_PASS, EMAIL_FROM existen en Render

---

## 💡 Tip: Mantener el Backend "Despierto"

El backend en Render (plan gratuito) se duerme cada 15 minutos.

**Opciones:**

1. **Upgrade a plan pagado** ($7/mes) - backend siempre activo
2. **Implementar un "ping"** - script que llame al health check cada 10 minutos
3. **Advertir a los usuarios** - "La primera carga puede tardar 30-60 segundos"

---

¡Tu formulario de contacto debería funcionar ahora! 🎉

