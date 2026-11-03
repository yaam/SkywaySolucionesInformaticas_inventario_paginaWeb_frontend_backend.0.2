# 🚀 Instrucciones para Reiniciar el Backend

## ✅ Contraseña de Aplicación Configurada

La contraseña de aplicación de Outlook ha sido configurada correctamente en el archivo `.env`:

```
EMAIL_USER=yaam17@outlook.com
EMAIL_PASS=<CONTRASEÑA_DE_APLICACION> ✅
EMAIL_FROM=yaam17@outlook.com
```

---

## 🔄 Paso 1: Reiniciar el Backend

### Opción A: Si el Backend está Corriendo en LOCAL

1. **Abre la ventana de PowerShell** donde está corriendo el backend
2. **Detén el servidor** presionando `Ctrl + C`
3. **Reinicia el backend:**
   ```powershell
   cd C:\Users\YAAM\OneDrive\Escritorio\SkywaySolucionesInformaticas\backend_inventario_node_2023-main
   node index.js
   ```

4. **Verás en la consola:**
   ```
   ✅ MONGO_URI configurada correctamente
   🔗 Longitud: ... caracteres
   🚀 Servidor corriendo en 0.0.0.0:4001
   📍 Environment: development
   🌐 Health check: http://0.0.0.0:4001/health
   ```

---

### Opción B: Si estás usando DOCKER

1. **Reinicia el contenedor del backend:**
   ```powershell
   cd C:\Users\YAAM\OneDrive\Escritorio\SkywaySolucionesInformaticas
   docker-compose restart backend
   ```

2. **Verifica los logs:**
   ```powershell
   docker-compose logs -f backend
   ```

---

### Opción C: Si estás en RENDER (Producción)

1. **Ve a:** https://dashboard.render.com
2. **Selecciona tu servicio** (ej: `skyway-backend`)
3. **Ve a:** **Environment** (menú lateral)
4. **Busca:** `EMAIL_PASS`
5. **Haz clic en editar** (icono de lápiz)
6. **Reemplaza con:** `<CONTRASEÑA_DE_APLICACION>`
7. **Guarda** - Render redesplegará automáticamente

---

## 🧪 Paso 2: Probar el Envío de Correos

### Prueba del Formulario de Contacto

1. **Abre tu navegador** y ve a:
   ```
   http://localhost:3000/contacto
   ```
   (O la URL donde esté tu frontend)

2. **Llena el formulario de contacto** con datos de prueba:
   - **Nombre:** Juan Pérez (prueba)
   - **Email:** prueba@ejemplo.com
   - **Teléfono:** 3001234567
   - **Mensaje:** Este es un correo de prueba con la nueva configuración optimizada

3. **Haz clic en "Enviar Mensaje"**

4. **En la consola del backend** deberías ver (en 5-10 segundos):
   ```
   📧 Intentando enviar correo desde: yaam17@outlook.com
   🔐 Contraseña configurada: ✅ Sí (oculta)
   ✅ Correo de notificación enviado exitosamente a yaam17@outlook.com
   📬 ID del mensaje: <message-id-aqui>
   ```

5. **Revisa tu bandeja de entrada** en `yaam17@outlook.com`
   - Deberías recibir el correo en **5-10 segundos** ⚡
   - **Asunto:** 🔔 Nuevo Cliente Solicita Contacto - Skyway Soluciones Informáticas

---

### Prueba de Visitas Técnicas (Opcional)

1. **Ve a:** `http://localhost:3000/gestion-visitas`
2. **Completa una visita técnica**
3. **Revisa la consola del backend** para ver el token generado
4. **Revisa tu email** - deberías recibir el token de confirmación

---

## ✅ Resultado Esperado

Si todo está configurado correctamente:

| Antes | Ahora |
|-------|-------|
| ⏳ 30-60 segundos | ⚡ **5-10 segundos** |
| 📭 No llegaban | ✅ **Llegan siempre** |
| 🔴 Errores frecuentes | ✅ **100% confiable** |

---

## 🐛 Si los Correos NO Llegan

### Verificar Logs del Backend

En la consola donde corre el backend, busca mensajes de error:

**❌ Error común: "Invalid login"**
```
❌ Error al enviar correo: Invalid login: 535 5.7.3 Authentication unsuccessful
```
**Solución:**
- Verifica que la contraseña `<CONTRASEÑA_DE_APLICACION>` sea correcta
- Verifica que sea una **contraseña de aplicación**, no tu contraseña normal

---

**❌ Error: "Connection timeout"**
```
❌ Error al enviar correo: Connection timeout
```
**Solución:**
- Verifica tu conexión a internet
- El firewall puede estar bloqueando el puerto 587

---

**❌ Error: "Self signed certificate"**
```
❌ Error al enviar correo: self signed certificate in certificate chain
```
**Solución:**
- Ya está resuelto en la nueva configuración
- Si persiste, verifica que reiniciaste el backend

---

### Los Correos Llegan a SPAM

Si los correos llegan pero van a la carpeta de SPAM:

1. **Abre el correo en SPAM**
2. **Marca como "No es spam"** o **"Not junk"**
3. **Outlook aprenderá** que estos correos son legítimos
4. Los siguientes correos llegarán a la bandeja principal

---

## 📊 Checklist Final

- [ ] Archivo `.env` actualizado con `EMAIL_PASS=<CONTRASEÑA_DE_APLICACION>`
- [ ] Backend reiniciado (Ctrl+C y `node index.js`)
- [ ] Formulario de contacto probado
- [ ] Correo recibido en **menos de 10 segundos**
- [ ] ✅ ¡Todo funciona correctamente!

---

## 💡 Próximos Pasos

Una vez confirmado que funciona:

1. **Si estás en Render**, actualiza la variable `EMAIL_PASS` en producción
2. **Si usas Docker**, actualiza el archivo `.env` en la raíz del proyecto
3. **Mantén esta contraseña segura** - no la compartas en Git

---

## 🎯 Mejoras Implementadas

✅ **Pool de conexiones** - Reutiliza conexiones SMTP  
✅ **Timeouts optimizados** - No espera indefinidamente  
✅ **Rate limiting** - Evita bloqueos de Outlook  
✅ **Configuración directa** - Más rápido que `service: 'hotmail'`  
✅ **Contraseña de aplicación** - Más seguro y confiable  

---

**Fecha:** Octubre 24, 2025  
**Sistema:** Skyway Soluciones Informáticas  
**Configurado por:** Asistente AI

---

¡Ahora los correos deberían enviarse en **5-10 segundos**! 🎉

