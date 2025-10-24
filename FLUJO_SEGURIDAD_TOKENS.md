# 🔐 Sistema de Seguridad con Tokens - Gestión de Visitas

## 📋 Descripción General

El sistema implementa un mecanismo de seguridad basado en tokens para garantizar que solo el técnico autorizado pueda confirmar la finalización de trabajos y transferir equipos al inventario.

---

## 🔄 Flujo Completo del Proceso

### **1️⃣ Cliente Agenda una Visita Técnica**
- El cliente ingresa a "Agendar Visita Técnica"
- Completa el formulario con sus datos y detalles del servicio
- Opcionalmente puede subir:
  - **Imagen del equipo** (para mantenimientos)
  - **Boceto de diseño** (para desarrollo web)
- La visita queda registrada en estado **"Pendiente"**

---

### **2️⃣ Técnico Completa el Trabajo (Gestión de Visitas)**

El técnico accede a **"Gestión de Visitas"** y selecciona la visita pendiente.

**Información requerida:**
- ✅ Imagen final del equipo/proyecto
- ✅ Observaciones del trabajo realizado
- ✅ Usuario/Cliente asociado
- ✅ Marca del equipo
- ✅ Estado del equipo

**Al completar la visita:**
1. Se genera automáticamente un **TOKEN ALEATORIO** de 6 caracteres (Ej: `A1B2C3`)
2. La visita cambia a estado **"Completada"**
3. Se envía un **EMAIL AUTOMÁTICO** a `yaam17@outlook.com` con:
   - ✉️ Detalles de la visita completada
   - ✉️ Observaciones del técnico
   - ✉️ **TOKEN DE CONFIRMACIÓN**
   - ✉️ Instrucciones para el siguiente paso

**🔒 IMPORTANTE:** El token NO se muestra al cliente, solo al técnico por email.

---

### **3️⃣ Técnico Responde al Correo (Opcional)**

El técnico puede responder al email con "FIN DE TAREA" o simplemente conservar el token recibido.

---

### **4️⃣ Verificación del Token y Transferencia al Inventario**

El técnico regresa a **"Gestión de Visitas"** en la sección de **"Visitas Completadas"**.

**Para transferir al inventario, debe:**
1. Hacer clic en **"🔐 Verificar Token y Transferir a Inventario"**
2. **Ingresar el token de 6 caracteres** recibido por email
3. Completar los datos del inventario:
   - Serial
   - Modelo
   - Descripción
   - Color
   - Precio
   - Fecha de compra
   - Tipo de inventario

**El sistema verifica:**
- ✅ Que el token ingresado coincida con el generado
- ✅ Que la visita esté completada
- ✅ Que no haya sido transferida previamente

**Si el token es correcto:**
- ✅ Se marca el token como verificado
- ✅ Se crea el nuevo registro en el inventario
- ✅ Se marca la visita como "Transferida"
- ✅ El equipo queda visible en **"Activos"**

**Si el token es incorrecto:**
- ❌ Se muestra un mensaje de error
- ❌ No se permite la transferencia
- ❌ Se debe verificar el email e intentar nuevamente

---

## 🛡️ Seguridad del Sistema

### **Protecciones Implementadas:**

1. **Token único por visita**: Cada visita genera un token diferente
2. **Verificación obligatoria**: Sin token válido, no se puede transferir
3. **Un solo uso**: Una vez transferida, la visita no puede modificarse
4. **Envío por email seguro**: El token solo llega a `yaam17@outlook.com`
5. **No visible en interfaz**: Los clientes externos no ven el token

### **Ventajas del Sistema:**

✅ **Evita modificaciones no autorizadas** por usuarios externos
✅ **Garantiza que solo el técnico** pueda confirmar trabajos
✅ **Auditoría completa** de quién completó cada visita
✅ **Trazabilidad** del flujo de trabajo
✅ **Protección de datos** del inventario

---

## 📧 Configuración del Email (Importante)

Para que el sistema de tokens funcione correctamente, debes configurar las credenciales de email:

### **Archivo: `backend_inventario_node_2023-main/.env`**

```env
PORT=4001
MONGO_URI=mongodb+srv://...
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación
```

### **Obtener Contraseña de Aplicación (Gmail):**

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (activar si no lo está)
3. Seguridad → Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña de 16 caracteres
6. Pégala en `EMAIL_PASS` en el archivo `.env`

---

## 🎯 Ejemplo de Uso Completo

### **Escenario: Mantenimiento de un Portátil**

1. **Cliente:** Juan Pérez agenda una visita para mantenimiento de su portátil Dell
2. **Sistema:** Crea visita en estado "Pendiente"
3. **Técnico:** Realiza el mantenimiento, sube foto final, observaciones: "Cambio de pasta térmica y limpieza interna"
4. **Sistema:** Genera token `F4A7B2` y lo envía a `yaam17@outlook.com`
5. **Email recibido:**
   ```
   ✅ Trabajo Completado
   
   Cliente: Juan Pérez
   Servicio: Mantenimiento Preventivo
   
   🔐 TOKEN DE CONFIRMACIÓN
   F4A7B2
   
   Ingresa este token en la plataforma para transferir al inventario.
   ```
6. **Técnico:** Ingresa a "Gestión de Visitas" → "Visitas Completadas"
7. **Técnico:** Hace clic en "Verificar Token y Transferir"
8. **Técnico:** Ingresa `F4A7B2` y completa datos del inventario
9. **Sistema:** Verifica token ✅
10. **Sistema:** Transfiere al inventario ✅
11. **Resultado:** El portátil aparece en "Activos" con la imagen final y todos los datos

---

## 🚨 Solución de Problemas

### **"Token incorrecto. Verifica el token recibido por email"**
- Revisa el email enviado a `yaam17@outlook.com`
- Asegúrate de escribir el token exactamente como aparece (mayúsculas)
- El token tiene 6 caracteres alfanuméricos

### **"Debe verificar el token de confirmación antes de transferir al inventario"**
- Primero debes ingresar el token correcto
- Solo después de verificarlo puedes transferir

### **"Esta visita ya fue transferida a inventario"**
- La visita ya se procesó anteriormente
- No se puede transferir dos veces

### **"Error al enviar correo"**
- Verifica que `EMAIL_USER` y `EMAIL_PASS` estén configurados en `.env`
- Si el correo no se envía, el token se muestra en la consola del backend

---

## 📊 Estados de una Visita Técnica

```
Pendiente → En Proceso → Completada (Token Generado) → Token Verificado → Transferida a Inventario
```

---

## 🔍 Visualización en "Activos"

Una vez transferida al inventario, el equipo se muestra en la sección **"Activos"** con:

- 📷 **Imagen final** (la subida al completar la visita)
- 👤 **Cliente asociado**
- 🏷️ **Marca**
- ⚙️ **Estado del equipo**
- 💻 **Tipo de equipo**
- 📝 **Detalles del mantenimiento/servicio**

---

## 📌 Notas Importantes

1. **Conserva los emails con tokens** por si necesitas transferir más tarde
2. **Un token por visita**: Cada trabajo genera su propio token
3. **Seguridad mejorada**: Este sistema evita que terceros modifiquen el inventario
4. **Proceso irreversible**: Una vez transferida, la visita no se puede editar

---

## 🆘 Contacto y Soporte

Para cualquier duda sobre el sistema de tokens:
- Email: yaam17@outlook.com
- Revisa la consola del backend para logs detallados

---

**Fecha de implementación:** Octubre 2025  
**Versión:** 1.0  
**Sistema:** Skyway Soluciones Informáticas










