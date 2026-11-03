> ⚠️ **OBSOLETO:** el backend ya no usa contraseñas de aplicación de Outlook. Ver [CONFIGURACION_EMAIL_SENDGRID.md](CONFIGURACION_EMAIL_SENDGRID.md).

# 🔐 Guía: Contraseña de Aplicación de Outlook

## ⚠️ IMPORTANTE

Si los correos **se demoran mucho o no llegan**, probablemente estés usando tu **contraseña normal** de Outlook en lugar de una **contraseña de aplicación**.

---

## ❌ Síntoma del Problema

- ✉️ El servidor intenta enviar correos
- ⏳ **Se demora mucho** (más de 30 segundos)
- 📭 **Los correos NO llegan** a la bandeja de entrada
- 🔴 Error común: `Invalid login: 535 5.7.3 Authentication unsuccessful`

---

## ✅ Solución: Crear Contraseña de Aplicación

### Paso 1: Acceder a la Configuración de Seguridad de Microsoft

1. **Abre tu navegador** y ve a:
   ```
   https://account.microsoft.com/security
   ```

2. **Inicia sesión** con tu cuenta de Outlook: `yaam17@outlook.com`

---

### Paso 2: Habilitar Verificación en Dos Pasos (si no está activada)

⚠️ **REQUISITO:** Para crear contraseñas de aplicación, DEBES tener la verificación en dos pasos activada.

1. En la página de seguridad, busca: **"Verificación en dos pasos"** o **"Two-step verification"**
2. Si dice **"Desactivada"**, haz clic en **"Activar"**
3. Sigue el asistente:
   - Elige tu método preferido (SMS, aplicación de autenticación, etc.)
   - Verifica tu identidad
   - Completa la configuración

---

### Paso 3: Crear Contraseña de Aplicación

1. En la misma página de seguridad (https://account.microsoft.com/security)
2. Busca la sección: **"Opciones de seguridad avanzadas"** o **"Advanced security options"**
3. Haz clic en **"Ver"** o **"Go to advanced security options"**
4. Busca: **"Contraseñas de aplicación"** o **"App passwords"**
5. Haz clic en **"Crear una nueva contraseña de aplicación"** o **"Create a new app password"**
6. **Nombre sugerido:** `Skyway Backend Emails`
7. Microsoft generará una contraseña de 16 caracteres, algo como:
   ```
   abcd efgh ijkl mnop
   ```

8. **COPIA LA CONTRASEÑA** (la necesitarás en el siguiente paso)

⚠️ **IMPORTANTE:** Esta contraseña se muestra **una sola vez**. Si la pierdes, tendrás que crear una nueva.

---

### Paso 4: Configurar la Contraseña en el Backend

#### Si estás trabajando en LOCAL:

1. **Abre el archivo:** `backend_inventario_node_2023-main/.env`
2. **Busca la línea:** `EMAIL_PASS=`
3. **Pega la contraseña SIN ESPACIOS:**
   ```env
   EMAIL_USER=yaam17@outlook.com
   EMAIL_PASS=abcdefghijklmnop
   ```
   (Elimina los espacios: `abcd efgh ijkl mnop` → `abcdefghijklmnop`)

4. **Guarda el archivo**
5. **Reinicia el backend:**
   ```bash
   # Detén el servidor (Ctrl + C)
   # Vuelve a iniciar:
   cd backend_inventario_node_2023-main
   node index.js
   ```

---

#### Si estás en RENDER (producción):

1. **Ve a:** https://dashboard.render.com
2. **Selecciona tu servicio** (ej: `skyway-backend`)
3. **Ve a:** **Environment** (menú lateral izquierdo)
4. **Busca la variable:** `EMAIL_PASS`
5. **Haz clic en editar** (icono de lápiz)
6. **Pega la contraseña SIN ESPACIOS:**
   ```
   abcdefghijklmnop
   ```
7. **Guarda los cambios**
8. **Render redesplegará automáticamente** (espera 2-3 minutos)

---

#### Si estás en DOCKER:

1. **Abre el archivo:** `.env` (en la raíz del proyecto)
2. **Busca la línea:** `EMAIL_PASS=`
3. **Pega la contraseña SIN ESPACIOS:**
   ```env
   EMAIL_USER=yaam17@outlook.com
   EMAIL_PASS=abcdefghijklmnop
   ```

4. **Reinicia los contenedores:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## 🧪 Paso 5: Probar el Envío de Correos

### Opción A: Probar Formulario de Contacto

1. **Abre tu aplicación** en el navegador
2. **Ve a la sección de contacto**
3. **Llena el formulario** con tus datos de prueba
4. **Haz clic en "Enviar Mensaje"**
5. **Revisa la consola del backend**, deberías ver:
   ```
   📧 Intentando enviar correo desde: yaam17@outlook.com
   🔐 Contraseña configurada: ✅ Sí (oculta)
   ✅ Correo de notificación enviado exitosamente a yaam17@outlook.com
   📬 ID del mensaje: <message-id>
   ```

6. **Revisa tu bandeja de entrada** en `yaam17@outlook.com`
   - El email debería llegar en **5-10 segundos**

---

### Opción B: Probar Visitas Técnicas

1. **Completa una visita técnica** en la plataforma
2. **Revisa la consola del backend** para ver el token generado
3. **Revisa tu email** en `yaam17@outlook.com`
   - Deberías recibir un email con el token de confirmación

---

## 🐛 Solución de Problemas

### Error: "Invalid login: 535 5.7.3"
**Causa:** Contraseña incorrecta o usando contraseña normal en vez de contraseña de aplicación.

**Solución:**
1. Verifica que copiaste la contraseña **sin espacios**
2. Verifica que estés usando la **contraseña de aplicación**, NO tu contraseña normal
3. Crea una **nueva contraseña de aplicación** si es necesario

---

### Error: "Connection timeout" o "ETIMEDOUT"
**Causa:** Firewall bloqueando el puerto 587 de Outlook.

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que el firewall permita conexiones salientes al puerto 587
3. Si estás en una red corporativa, puede que esté bloqueado

---

### Los correos se envían pero llegan a SPAM
**Solución:**
1. Abre el correo en SPAM
2. Marca como **"No es spam"** o **"Not junk"**
3. Outlook aprenderá que estos correos son legítimos

---

### Los correos NO llegan (sin errores en la consola)
**Causa:** Outlook puede estar bloqueando emails por "actividad sospechosa".

**Solución:**
1. Ve a: https://outlook.live.com
2. Inicia sesión con `yaam17@outlook.com`
3. Busca notificaciones sobre "actividad sospechosa"
4. Si hay alertas, confirma que eres tú quien está enviando correos
5. Intenta enviar un correo de prueba nuevamente

---

## 📊 Checklist de Verificación

- [ ] Verificación en dos pasos **activada** en Microsoft
- [ ] Contraseña de aplicación **creada**
- [ ] Contraseña copiada **sin espacios**
- [ ] `EMAIL_USER` configurado: `yaam17@outlook.com`
- [ ] `EMAIL_PASS` configurado con la contraseña de aplicación
- [ ] Backend **reiniciado** después de configurar
- [ ] Email de prueba **enviado exitosamente**
- [ ] Email **recibido en menos de 10 segundos**

---

## 💡 Ventajas de la Contraseña de Aplicación

✅ **Más segura** que usar tu contraseña principal  
✅ **Más rápida** - Outlook no aplica rate limiting tan estricto  
✅ **Más confiable** - Menos probabilidad de ser bloqueado  
✅ **Revocable** - Puedes eliminarla sin cambiar tu contraseña principal  

---

## 🔄 Rotar Contraseñas (Recomendado cada 6 meses)

1. Ve a: https://account.microsoft.com/security
2. En **"Contraseñas de aplicación"**, elimina la antigua
3. Crea una nueva contraseña de aplicación
4. Actualiza el `.env` o las variables de entorno en Render
5. Reinicia el backend

---

**Fecha de creación:** Octubre 24, 2025  
**Sistema:** Skyway Soluciones Informáticas  
**Email configurado:** yaam17@outlook.com

---

## 🆘 ¿Aún No Funciona?

Si después de seguir todos los pasos los correos **aún no llegan**:

1. Verifica los logs del backend en tiempo real
2. Captura los errores exactos que aparecen
3. Verifica que las variables de entorno estén correctamente configuradas
4. Contacta al soporte de Microsoft para verificar el estado de tu cuenta

---

¡Con esta configuración optimizada, los correos deberían llegar en **5-10 segundos**! 🎉

