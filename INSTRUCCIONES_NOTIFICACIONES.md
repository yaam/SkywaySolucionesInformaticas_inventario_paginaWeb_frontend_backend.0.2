# Configuración de Notificaciones - Skyway Soluciones Informáticas

## 📧 Configuración de Notificaciones por Correo Electrónico

### Paso 1: Crear una contraseña de aplicación en Gmail

Para que el sistema pueda enviar correos automáticamente a `yaam17@outlook.com`, necesitas configurar una cuenta de Gmail con una contraseña de aplicación:

1. **Inicia sesión en tu cuenta de Gmail** (puedes usar una cuenta corporativa o personal)

2. **Habilita la verificación en dos pasos:**
   - Ve a https://myaccount.google.com/security
   - En "Cómo inicias sesión en Google", haz clic en "Verificación en dos pasos"
   - Sigue los pasos para habilitarla

3. **Crea una contraseña de aplicación:**
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Correo" en el menú desplegable
   - Selecciona "Otro (nombre personalizado)" y escribe "Skyway Notificaciones"
   - Haz clic en "Generar"
   - **Copia la contraseña de 16 caracteres** que aparece (sin espacios)

### Paso 2: Configurar las variables de entorno

1. Abre el archivo `backend_inventario_node_2023-main/.env`

2. Actualiza las siguientes líneas con tu información:
   ```
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=la_contraseña_de_aplicación_de_16_caracteres
   ```

3. Ejemplo:
   ```
   EMAIL_USER=skyway.notificaciones@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

4. Guarda el archivo

### Paso 3: Reiniciar el backend

Después de configurar las variables de entorno, reinicia el backend para que tome los cambios:

```bash
# Detener el backend (si está corriendo)
taskkill /F /IM node.exe

# Iniciar el backend
cd backend_inventario_node_2023-main
node index.js
```

## 💬 Configuración de Notificaciones por WhatsApp

### Actualizar el número de WhatsApp

Por defecto, el sistema está configurado para enviar notificaciones al número `573103040001`.

Para cambiar este número:

1. Abre el archivo `frontend_inventario_react-main/src/components/AgendarVisita.js`

2. Busca la línea 42:
   ```javascript
   const numeroWhatsApp = '573103040001'; // Cambia este número por el tuyo
   ```

3. Reemplaza `573103040001` con tu número de WhatsApp **incluyendo el código de país sin el símbolo +**
   - Ejemplo Colombia: `573001234567`
   - Ejemplo México: `525512345678`
   - Ejemplo España: `34612345678`

4. Guarda el archivo y reinicia el frontend

### Cómo funciona

Cuando un cliente agenda una visita técnica:

1. Se guarda la información en la base de datos MongoDB
2. Se genera automáticamente un mensaje de WhatsApp con todos los detalles
3. Se abre automáticamente una ventana de WhatsApp Web con el mensaje pre-cargado
4. Solo necesitas hacer clic en "Enviar" para notificar al equipo técnico

## 📬 Funcionamiento del Formulario de Contacto

Cuando un cliente completa el formulario de contacto:

1. Se guarda el mensaje en la base de datos MongoDB
2. Se envía automáticamente un correo a `yaam17@outlook.com` con:
   - Nombre del cliente
   - Email del cliente
   - Teléfono
   - Línea preferida para llamadas
   - Número de WhatsApp
   - Mensaje del cliente

## 🔧 Solución de Problemas

### Los correos no se envían

1. Verifica que `EMAIL_USER` y `EMAIL_PASS` estén correctamente configurados en el archivo `.env`
2. Asegúrate de haber creado una **contraseña de aplicación** (no uses tu contraseña normal de Gmail)
3. Verifica que la verificación en dos pasos esté habilitada en tu cuenta de Gmail
4. Revisa los logs del backend - deberían mostrar si hay algún error al enviar correos

### WhatsApp no se abre automáticamente

1. Verifica que tu navegador permita ventanas emergentes (pop-ups) para localhost
2. Asegúrate de tener WhatsApp Web vinculado en tu navegador
3. El número debe estar en formato internacional sin el símbolo + (ejemplo: 573001234567)

### El formulario muestra error al enviar

1. Verifica que el backend esté corriendo en el puerto 4001
2. Verifica que MongoDB esté conectado correctamente
3. Revisa la consola del navegador y los logs del backend para ver el error específico

## 📝 Notas Importantes

- **Seguridad:** Nunca compartas tu archivo `.env` o tu contraseña de aplicación de Gmail
- **Email:** El correo siempre se enviará a `yaam17@outlook.com` (está configurado en el código del backend)
- **WhatsApp:** La notificación de WhatsApp se abre en el navegador del cliente, no se envía automáticamente
- **Base de Datos:** Todos los mensajes de contacto y visitas técnicas se guardan en MongoDB aunque fallen las notificaciones

## 🚀 Resumen de Funcionalidades Implementadas

### ✅ Servicios con Imágenes
- Cada servicio muestra su imagen correspondiente
- Botón "Agendar Visita" en cada tarjeta de servicio
- Al hacer clic, se redirige al formulario con el tipo de servicio pre-seleccionado

### ✅ Formulario de Agendar Visita
- Campo "Tipo de Servicio" (obligatorio)
- Campo "Tipo de Equipo" (opcional)
- Campo "Dirección" donde se realizará la visita (obligatorio)
- Fecha y hora preferidas
- Genera mensaje automático para WhatsApp
- Abre WhatsApp automáticamente al agendar

### ✅ Formulario de Contacto
- Campo de correo electrónico (conectado con el usuario)
- Campo de teléfono
- Campo de línea preferida para llamadas
- Campo de número de WhatsApp
- Envía notificación automática a yaam17@outlook.com con todos los datos del cliente

## 📞 Información de Contacto

Si tienes problemas con la configuración, revisa los logs del backend y frontend para identificar el error específico.









