# ✅ Configuración del Campo Activo/Inactivo y Correo Electrónico

## 🎯 CAMBIOS REALIZADOS

### 1. Campo Activo/Inactivo para Equipos

Se ha agregado exitosamente el campo **"activo/inactivo"** en el sistema de inventario:

#### ✅ Cambios en el Backend:
- **Modelo** (`backend_inventario_node_2023-main/modelos/Inventario.js`): 
  - Agregado campo `activo: { type: Boolean, default: true }`
  
- **Controlador** (`backend_inventario_node_2023-main/controllers/inventario.js`):
  - Agregada lógica para manejar el campo en crear y actualizar inventario

#### ✅ Cambios en el Frontend:
- **Formulario de Edición** (`frontend_inventario_react-main/src/components/inventarios/InventarioUpdate.js`):
  - Agregado selector desplegable con opciones:
    - ✅ Activo (En Servicio)
    - ❌ Inactivo (Fuera de Servicio)
  - Incluye texto de ayuda explicativo

- **Vista de Inventarios** (`frontend_inventario_react-main/src/components/inventarios/InventarioView.js`):
  - Muestra badge verde (✅ Activo) o rojo (❌ Inactivo)
  - Mensaje de advertencia para equipos inactivos

#### 📝 Uso del Campo:
- **Activo**: Equipo en uso y funcionamiento
- **Inactivo**: Equipo fuera de servicio (ejemplos):
  - Computador viejo y malo guardado
  - Equipo viejo pero bueno, sin uso
  - Equipo reemplazado por otro

#### 📊 Vista de Inventarios:
✅ **Muestra TODOS los equipos** (activos e inactivos) por defecto, como solicitaste.

---

## 📧 SOLUCIÓN: Problema de Envío de Correos

### ⚠️ PROBLEMA DETECTADO:
El archivo `.env` **NO EXISTE** en el directorio del backend, por lo que el sistema no puede enviar correos electrónicos.

### 🔧 SOLUCIÓN PASO A PASO:

#### Paso 1: Crear archivo .env
1. Ve a la carpeta: `backend_inventario_node_2023-main/`
2. Crea un nuevo archivo llamado exactamente: `.env` (con el punto al inicio)

#### Paso 2: Agregar contenido al .env
Copia EXACTAMENTE estas 4 líneas en el archivo `.env`:

```
PORT=4001
MONGO_URI=mongodb+srv://User_MongoDB:Password_MongoDB@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
EMAIL_USER=yaam17@outlook.com
EMAIL_PASS=TU_CONTRASEÑA_DE_OUTLOOK_AQUI
```

#### Paso 3: Configurar la contraseña
⚠️ **IMPORTANTE**: Reemplaza `TU_CONTRASEÑA_DE_OUTLOOK_AQUI` con tu contraseña real de Outlook

**Opciones:**
1. **Contraseña normal de Outlook**: Si no tienes autenticación de dos factores
2. **Contraseña de aplicación**: Si tienes autenticación de dos factores activada (RECOMENDADO)

#### Paso 4: Crear Contraseña de Aplicación (Si usas 2FA)

Si tienes verificación en dos pasos activada en Outlook, necesitas una contraseña de aplicación:

1. Ve a: https://account.microsoft.com/security
2. Inicia sesión con tu cuenta `yaam17@outlook.com`
3. Busca "Contraseñas de aplicación" o "App passwords"
4. Haz clic en "Crear una nueva contraseña de aplicación"
5. Selecciona "Correo electrónico" como tipo de aplicación
6. Copia la contraseña generada (ej: `abcd efgh ijkl mnop`)
7. Pégala en el archivo `.env` **SIN ESPACIOS**:
   ```
   EMAIL_PASS=abcdefghijklmnop
   ```

#### Paso 5: Verificar el archivo .env

El archivo debe quedar así (con tu contraseña real):

```
PORT=4001
MONGO_URI=mongodb+srv://user_db_user:Password_MongoDB@ac-mxqbnkm.2f0zz9u.mongodb.net/inventarios?retryWrites=true&w=majority&appName=Skyway-Soluciones-Informaticas
EMAIL_USER=yaam17@outlook.com
EMAIL_PASS=miContraseñaReal123
```

⚠️ **IMPORTANTE**:
- NO uses comillas
- NO dejes espacios antes o después del `=`
- Guarda el archivo con `Ctrl+S`

#### Paso 6: Reiniciar el Backend

Después de guardar el `.env`, **REINICIA** el servidor backend:

1. Detén el servidor actual (Ctrl+C en la terminal del backend)
2. Vuelve a iniciar con: `npm start` o `node index.js`

---

## ✅ VERIFICAR QUE FUNCIONE

### Probar el envío de correo:
1. Ve al frontend de la aplicación
2. Rellena el formulario de contacto
3. Envía un mensaje de prueba
4. Verifica en la consola del backend que aparezca:
   ```
   ✅ Correo de notificación enviado a yaam17@outlook.com
   ```
5. Revisa tu bandeja de entrada en `yaam17@outlook.com`

### Probar el campo activo/inactivo:
1. Ve a "Editar Equipo" en el frontend
2. Busca el campo "Estado del Equipo en Servicio"
3. Cambia entre "Activo" e "Inactivo"
4. Guarda los cambios
5. Verifica en "Inventarios" que se muestre el badge correcto (verde o rojo)

---

## 🆘 SI AÚN NO FUNCIONA EL CORREO

### Posibles causas:

1. **Contraseña incorrecta**:
   - Verifica que copiaste bien la contraseña
   - Sin espacios ni caracteres extra

2. **Cuenta Outlook con 2FA**:
   - Debes usar una contraseña de aplicación
   - La contraseña normal no funcionará

3. **Firewall o antivirus**:
   - Puede estar bloqueando el puerto 587 (SMTP)
   - Desactiva temporalmente para probar

4. **Cuenta bloqueada**:
   - Microsoft puede bloquear intentos de inicio de sesión "menos seguros"
   - Ve a: https://account.live.com/activity
   - Revisa si hay actividad sospechosa bloqueada

---

## 📋 RESUMEN

✅ Campo activo/inactivo: **IMPLEMENTADO**
✅ Muestra todos los equipos: **IMPLEMENTADO**
⚠️ Envío de correos: **REQUIERE CONFIGURAR .env CON CONTRASEÑA**

**Próximos pasos:**
1. Crear archivo `.env` con la contraseña de Outlook
2. Reiniciar el backend
3. Probar envío de correo desde el formulario de contacto
4. Probar edición de equipos con el nuevo campo activo/inactivo

---

🎉 **¡Todo listo!** Una vez configures el archivo `.env`, el sistema estará completamente funcional.


