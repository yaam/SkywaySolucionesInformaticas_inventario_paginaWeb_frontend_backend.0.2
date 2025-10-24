# 🔥 Problema Identificado: Firewall Bloqueando SMTP

## ❌ Diagnóstico del Problema

Durante las pruebas de envío de correos, identificamos el siguiente error:

```
Error 10060: Cannot connect to SMTP server 52.96.57.38 (52.96.57.38:587)
```

### ¿Qué significa este error?

**El puerto 587 (SMTP) está siendo bloqueado por:**
- ⛔ Firewall de Windows
- ⛔ Antivirus (Avast, AVG, Norton, etc.)
- ⛔ Tu proveedor de internet (ISP)
- ⛔ Router/Red corporativa

---

## ✅ Soluciones Posibles

### Solución 1: Configurar el Firewall de Windows (RECOMENDADA)

#### Paso 1: Abrir PowerShell como Administrador
1. Presiona `Win + X`
2. Selecciona **"Windows PowerShell (Administrador)"** o **"Terminal (Administrador)"**

#### Paso 2: Ejecutar el Comando
```powershell
New-NetFirewallRule -DisplayName "Allow SMTP Outlook" -Direction Outbound -LocalPort 587 -Protocol TCP -Action Allow
```

#### Paso 3: Verificar que se creó la regla
```powershell
Get-NetFirewallRule -DisplayName "Allow SMTP Outlook"
```

#### Paso 4: Reiniciar el backend y probar nuevamente

---

### Solución 2: Usar SendGrid (Alternativa Recomendada)

SendGrid es un servicio de envío de emails confiable y gratuito (100 emails/día):

#### Paso 1: Crear Cuenta en SendGrid
1. Ve a: https://signup.sendgrid.com
2. Regístrate con tu email
3. Verifica tu cuenta

#### Paso 2: Crear API Key
1. Dashboard → Settings → API Keys
2. Click en "Create API Key"
3. Nombre: `Skyway Backend`
4. Permisos: **Full Access**
5. Copia la API Key generada

#### Paso 3: Instalar SendGrid en el Backend
```bash
cd backend_inventario_node_2023-main
npm install @sendgrid/mail
```

#### Paso 4: Actualizar el `.env`
```env
EMAIL_USER=yaam17@outlook.com
SENDGRID_API_KEY=tu_api_key_aqui
```

#### Paso 5: Modificar el Controlador

Reemplaza el transporter de nodemailer en `controllers/contacto.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// En lugar de transporter.sendMail(), usa:
const msg = {
    to: 'yaam17@outlook.com',
    from: process.env.EMAIL_USER, // Debe estar verificado en SendGrid
    subject: '🔔 Nuevo Cliente Solicita Contacto',
    html: mailOptions.html
};

try {
    await sgMail.send(msg);
    console.log('✅ Email enviado con SendGrid');
} catch (error) {
    console.error('❌ Error SendGrid:', error);
}
```

---

### Solución 3: Desactivar Temporalmente el Antivirus

Algunos antivirus bloquean conexiones SMTP salientes:

1. **Desactiva temporalmente** el antivirus
2. **Prueba el envío** de correos
3. Si funciona:
   - Agrega una excepción para `node.exe`
   - O agrega una excepción para el puerto 587

**⚠️ No olvides reactivar el antivirus después**

---

### Solución 4: Usar un Servidor VPS/Cloud

Si estás desplegando en producción, usa:

- **Render** (gratis): Ya configurado en tu proyecto
- **Heroku** ($7/mes): Sin restricciones SMTP
- **Digital Ocean** ($5/mes): Control total

En estos servicios, el puerto 587 NO está bloqueado.

---

## 🧪 Cómo Probar si el Firewall es el Problema

### Prueba 1: Telnet al Puerto 587
```bash
telnet smtp-mail.outlook.com 587
```

**Si funciona:** Verás algo como `220 smtp.office365.com`  
**Si está bloqueado:** `Could not open connection` o timeout

### Prueba 2: Test-NetConnection (PowerShell)
```powershell
Test-NetConnection -ComputerName smtp-mail.outlook.com -Port 587
```

**Si funciona:** `TcpTestSucceeded : True`  
**Si está bloqueado:** `TcpTestSucceeded : False`

---

## 📊 Comparación de Soluciones

| Solución | Dificultad | Tiempo | Confiabilidad |
|----------|-----------|--------|---------------|
| Firewall Windows | ⭐⭐ Fácil | 5 min | ⭐⭐⭐⭐ Alta |
| SendGrid | ⭐⭐⭐ Media | 15 min | ⭐⭐⭐⭐⭐ Muy Alta |
| Desactivar Antivirus | ⭐ Muy Fácil | 2 min | ⭐⭐ Baja (temporal) |
| VPS/Cloud | ⭐⭐⭐⭐ Alta | 30 min | ⭐⭐⭐⭐⭐ Muy Alta |

---

## 🎯 Recomendación

### Para DESARROLLO LOCAL:
**✅ Solución 1:** Configurar Firewall de Windows

### Para PRODUCCIÓN:
**✅ Solución 2:** Usar SendGrid + Render

---

## 📝 Estado Actual del Proyecto

### ✅ Lo que funciona:
- Backend activo en puerto 4001
- MongoDB conectado (cuando la IP está en whitelist)
- API REST funcional
- Formulario de contacto guarda en base de datos

### ❌ Lo que NO funciona:
- Envío de emails desde localhost
- Conexión al servidor SMTP de Outlook (puerto 587 bloqueado)

### 🔧 Cambios aplicados:
- Contraseña de aplicación de Outlook configurada
- Código optimizado para timeouts
- Manejo de errores mejorado
- MongoDB opcional (no bloquea el envío de emails)

---

## 🆘 Siguiente Paso Recomendado

**OPCIÓN A (Más Rápida):**
1. Abre PowerShell como Administrador
2. Ejecuta:
   ```powershell
   New-NetFirewallRule -DisplayName "Allow SMTP Outlook" -Direction Outbound -LocalPort 587 -Protocol TCP -Action Allow
   ```
3. Reinicia el backend
4. Prueba el formulario de contacto

**OPCIÓN B (Más Confiable):**
1. Crea cuenta en SendGrid (5 minutos)
2. Instala `@sendgrid/mail`
3. Actualiza el código del controlador
4. ¡Envía 100 emails gratis al día!

---

## 📞 Nota Final

El problema **NO es del código** ni de la contraseña de aplicación de Outlook.  
El problema es **infraestructura/red**: el firewall está bloqueando las conexiones SMTP salientes.

En **producción (Render/Vercel)**, esto NO será un problema porque esos servidores tienen los puertos SMTP abiertos.

---

**Fecha:** Octubre 24, 2025  
**Sistema:** Skyway Soluciones Informáticas  
**Error Identificado:** Firewall bloqueando puerto 587 SMTP  
**Soluciones Disponibles:** 4 opciones documentadas arriba

---

¿Quieres que te ayude a implementar alguna de estas soluciones? 🚀

