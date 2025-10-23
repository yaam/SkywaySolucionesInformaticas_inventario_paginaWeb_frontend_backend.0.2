# 📧 Configuración de Email con Outlook para Notificaciones

## 🎯 Objetivo
Configurar el sistema para enviar emails con tokens de confirmación a `yaam17@outlook.com`

---

## 📝 Paso 1: Crear el archivo .env

1. **Abre el explorador de archivos**
2. **Navega a:** `C:\Users\YAAM\OneDrive\Escritorio\SkywaySolucionesInformaticas\backend_inventario_node_2023-main`
3. **Crea un archivo llamado:** `.env` (sin extensión)
4. **Abre el archivo con Notepad** y pega lo siguiente:

```env
PORT=4001
MONGO_URI=mongodb+srv://faludni_db_user:MczT7pU2B4sJzLDc@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
EMAIL_USER=yaam17@outlook.com
EMAIL_PASS=tu_contraseña_de_outlook
```

⚠️ **IMPORTANTE:** Reemplaza `tu_contraseña_de_outlook` con tu contraseña real de Outlook.

---

## 🔐 Paso 2: Configurar la Contraseña de Aplicación (Outlook)

### **Opción A: Contraseña Normal (Más Simple)**

Si tu cuenta de Outlook **NO** tiene verificación en 2 pasos activada:

1. Usa tu **contraseña normal** de Outlook en el campo `EMAIL_PASS`

### **Opción B: Contraseña de Aplicación (Más Seguro)**

Si tu cuenta **SÍ** tiene verificación en 2 pasos:

1. **Ve a:** https://account.microsoft.com/security
2. **Inicia sesión** con `yaam17@outlook.com`
3. **Busca:** "Contraseñas de aplicación" o "App passwords"
4. **Haz clic en:** "Crear una nueva contraseña de aplicación"
5. **Nombre sugerido:** "Skyway Notificaciones"
6. **Copia la contraseña** generada (16 caracteres)
7. **Pégala en** el archivo `.env` en el campo `EMAIL_PASS`

---

## 📝 Paso 3: Actualizar el Código del Backend

El sistema actualmente usa Gmail. Necesitamos cambiarlo a Outlook:

**Archivo a modificar:** `backend_inventario_node_2023-main/controllers/visitaTecnica.js`

**Busca esta sección (aproximadamente línea 98):**
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu_contraseña_de_aplicación'
    }
});
```

**Reemplázala por:**
```javascript
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

---

## 🔧 SOLUCIÓN RÁPIDA: Sin Contraseña de Aplicación

Si tienes problemas con las contraseñas de aplicación, puedes usar la configuración manual:

**Reemplaza el `transporter` por:**

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
```

---

## ✅ Paso 4: Reiniciar el Backend

Después de hacer los cambios:

1. **Cierra la ventana PowerShell** del backend
2. **Abre una nueva terminal PowerShell**
3. **Ejecuta:**
   ```powershell
   cd C:\Users\YAAM\OneDrive\Escritorio\SkywaySolucionesInformaticas\backend_inventario_node_2023-main
   node index.js
   ```

---

## 🧪 Paso 5: Probar el Envío de Email

1. **Abre:** http://localhost:3000/gestion-visitas
2. **Completa una visita** haciendo clic en "Completar Visita"
3. **Revisa la consola del backend** para ver:
   - ✅ `Email enviado a yaam17@outlook.com con token: A1B2C3`
   - ❌ Si hay error, verás el mensaje de error

4. **Revisa tu bandeja de entrada** en `yaam17@outlook.com`

---

## 🐛 Solución de Problemas

### **Error: "Invalid login"**
- Verifica que la contraseña sea correcta
- Si tienes 2FA, usa una contraseña de aplicación

### **Error: "Self signed certificate"**
- Agrega al transporter:
  ```javascript
  tls: {
      rejectUnauthorized: false
  }
  ```

### **Error: "Connection timeout"**
- Verifica tu conexión a internet
- Outlook podría estar bloqueado por el firewall

### **El token se genera pero el email no llega**
- Revisa la carpeta de **Spam** en Outlook
- Verifica que `EMAIL_USER` sea `yaam17@outlook.com`
- Revisa la consola del backend para ver errores específicos

---

## 📌 Ejemplo Completo del .env

```env
PORT=4001
MONGO_URI=mongodb+srv://faludni_db_user:MczT7pU2B4sJzLDc@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
EMAIL_USER=yaam17@outlook.com
EMAIL_PASS=MiContraseñaSegura123
```

---

## 🎯 Alternativa: Ver el Token en la Consola

**Mientras configuras el email**, el token SIEMPRE se muestra en la consola del backend:

1. **Ve a la ventana PowerShell** del backend
2. **Después de completar una visita**, verás:
   ```
   ✅ Email enviado a yaam17@outlook.com con token: A1B2C3
   ```
   O si el email falla:
   ```
   ❌ Error al enviar correo: [mensaje de error]
   ⚠️ Token generado (no enviado por correo): A1B2C3
   ```

3. **Copia el token** de 6 caracteres (ej: `A1B2C3`)
4. **Úsalo en** "Gestión de Visitas" para transferir al inventario

---

## ✅ Resumen de Archivos a Modificar

1. **Crear:** `backend_inventario_node_2023-main/.env`
   - Agregar `EMAIL_USER` y `EMAIL_PASS`

2. **Modificar:** `backend_inventario_node_2023-main/controllers/visitaTecnica.js`
   - Cambiar `service: 'gmail'` a `service: 'outlook'`
   - O usar configuración manual con `host: 'smtp-mail.outlook.com'`

3. **Modificar:** `backend_inventario_node_2023-main/controllers/contacto.js`
   - Igual que visitaTecnica.js, cambiar a Outlook

---

**Fecha:** Octubre 21, 2025  
**Sistema:** Skyway Soluciones Informáticas  
**Email Destino:** yaam17@outlook.com









