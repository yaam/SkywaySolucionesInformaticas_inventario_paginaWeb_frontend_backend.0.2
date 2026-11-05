# Correcciones aplicadas (noviembre 2026)

Resumen de los cambios incorporados en `main` mediante los PR #1 y #3, y de la configuración que falta para que producción funcione completa.

## 1. Envío de correo con SendGrid (PR #1)

- Se agregó la dependencia `@sendgrid/mail` al backend. Antes los controladores la importaban sin estar declarada en `package.json`, y el backend no arrancaba (`Cannot find module '@sendgrid/mail'`).
- El envío quedó centralizado en `backend_inventario_node_2023-main/helpers/email.js` (`enviarEmail`, `obtenerRemitente`, `obtenerDestinatario`, `registrarErrorEmail`).
- Se quitó el código de nodemailer/SMTP de Outlook.
- Variables: `SENDGRID_API_KEY`, `EMAIL_FROM` (remitente verificado en SendGrid) y `EMAIL_TO` (destinatario de las notificaciones).

## 2. Estado de MongoDB visible en `/health` (PR #1)

- `db/db-connection-mongo.js` expone `getDbStatus()` y registra los eventos `connected`, `disconnected` y `error` de Mongoose. Mientras la base no esté conectada, escribe su estado en el log cada 60 s.
- `GET /health` devuelve:

  ```json
  {
    "status": "ok | degraded",
    "message": "Server is running",
    "db": { "readyState": 1, "state": "connected", "name": "inventarios", "lastError": null }
  }
  ```

- Responde HTTP 200 aunque la base esté caída (`status: "degraded"`), para que Render no reinicie el servicio en bucle. El campo `db.lastError` muestra el último error, por ejemplo `querySrv ENOTFOUND ...` cuando el URI de Atlas no es válido.

## 3. Correcciones de seguridad (PR #3)

| Problema | Corrección | Archivo |
|---|---|---|
| `POST /visitas-tecnicas/:id/verificar-token` aceptaba la verificación sin token cuando la visita aún no tenía uno (`undefined === undefined`), lo que permitía transferir la visita al inventario sin confirmación | Se valida que ambos tokens sean `string` y tengan la misma longitud; la comparación usa `crypto.timingSafeEqual`, ignora espacios y no distingue mayúsculas. Al completar una visita se reinicia `tokenVerificado = false` | `controllers/visitaTecnica.js` |
| Los datos de los formularios (contacto, visitas) se insertaban sin escapar en el HTML de los correos (inyección de HTML/enlaces) | Nueva función `escaparHtml()`, aplicada a todos los campos del usuario | `helpers/email.js`, `controllers/contacto.js`, `controllers/visitaTecnica.js` |
| Las respuestas de error incluían `error.message` interno | Se devuelve un mensaje genérico; el detalle queda solo en el log | `controllers/contacto.js`, `controllers/visitaTecnica.js` |
| `GET /usuario/:id` fallaba siempre (usaba la variable `inventario`, que no existe) | Ahora usa `usuario` | `controllers/usuario.js` |
| Dependencias sin uso y vulnerables: `mongodb@2` (3 vulnerabilidades críticas) y `multer` en el backend; `nodemailer` en el frontend | Eliminadas (Mongoose ya incluye su propio driver) | `package.json` del backend y del frontend |
| Contraseñas reales de MongoDB Atlas y Outlook escritas en la documentación | Reemplazadas por marcadores `<USUARIO>`, `<PASSWORD>` y `<CONTRASEÑA_DE_APLICACION>` | `RENDER_CONFIG.md`, `DESPLIEGUE_RENDER_PASO_A_PASO.md`, `INSTRUCCIONES_REINICIAR_BACKEND.md`, `PRUEBA_CORREO_OPTIMIZADO.md` |

Resultado de `npm audit --omit=dev` en el backend: de vulnerabilidades críticas a 4 de severidad baja, todas en el árbol de dependencias de `@sendgrid` (`deepmerge`).

## 4. Despliegue del frontend en Vercel

- Se cambió `engines.node` de `20.x` a `22.x` en `frontend_inventario_react-main/package.json`.

## 5. Pendiente (requiere acción del administrador)

1. **Rotar credenciales.** Las contraseñas eliminadas de la documentación siguen en el historial de Git de este repositorio público. Hay que cambiar la contraseña del usuario de base de datos en Atlas → Database Access y revocar la contraseña de aplicación de Outlook.
2. **`MONGO_URI` en Render.** Copiarlo desde Atlas → Connect → Drivers (formato `mongodb+srv://<usuario>:<password>@<cluster>.<id>.mongodb.net/inventarios?...`). El host `ac-xxxx.<id>.mongodb.net` es el de un shard individual y no funciona con `mongodb+srv://`. Para verificarlo, `GET /health` debe mostrar `db.state: "connected"`.
3. **SendGrid.** Configurar `SENDGRID_API_KEY`, `EMAIL_FROM` (verificado) y `EMAIL_TO` en Render.
4. **Riesgos aún abiertos:**
   - La API no tiene autenticación: cualquiera puede leer, crear, editar o borrar datos, incluidos datos personales.
   - CORS acepta cualquier origen.
   - No hay límite de intentos en `verificar-token`: el token tiene 6 caracteres hexadecimales, unos 16 millones de combinaciones.
   - `axios@0.27` en el frontend tiene vulnerabilidades altas; hay que actualizar a la versión 1.x.
5. **CI.** `.github/workflows/node.js.yml` ejecuta `npm ci` en la raíz, donde no hay `package.json` ni lockfile, por lo que falla siempre.

## Endurecimiento de seguridad (ataques web y bots / agentes de IA)

| Riesgo | Corrección |
|---|---|
| API de administración sin autenticación | Login `POST /api/auth/login` (JWT HS256, 8 h). `/usuario`, `/estadoEquipo`, `/marca`, `/api/tipos`, `/api/inventarios` y la gestión de visitas exigen `Authorization: Bearer`. Sin `ADMIN_USER`, `ADMIN_PASSWORD` o `JWT_SECRET` (≥32 caracteres) responden 503 (falla cerrada). |
| Fuerza bruta (login, token de visita) | `express-rate-limit`: login 5 intentos fallidos / 15 min, verificación de token 5 / 15 min, formularios públicos 10 / hora, general 300 / 15 min por IP. |
| Spam automatizado (bots, agentes de IA) en Contacto y Agendar visita | Campo honeypot oculto `sitioWeb`; validación de tipo y longitud (2000 caracteres) e imágenes solo `data:image/(png|jpeg|gif|webp);base64`. |
| Inyección NoSQL (`{"$ne": null}`) | `mongoose.set('sanitizeFilter', true)` y rechazo de campos no string. |
| Payloads enormes | `express.json({ limit: '8mb' })` → 413. |
| CORS abierto | Solo orígenes de `ALLOWED_ORIGINS` (por defecto el dominio de Vercel y `localhost:3000`). |
| Cabeceras HTTP | `helmet`. |
| Fuga del token de confirmación | `GET /api/agendar-visita` ya no devuelve `tokenConfirmacion`; crear visita ya no devuelve el documento completo. |
| Errores internos | Manejador 404/500 con mensajes genéricos. |
| Axios 0.27 vulnerable | Actualizado a 1.x. |
| Frontend | Página `/login`, rutas de administración protegidas y menú de administración oculto sin sesión. Token en `sessionStorage`. |

La aplicación no usa modelos de IA, así que no hay superficie de *prompt injection*; el riesgo de IA es el abuso automatizado, cubierto con los límites anteriores.

### Variables nuevas en Render

`ADMIN_USER`, `ADMIN_PASSWORD` (larga y única), `JWT_SECRET` (aleatoria, ≥32 caracteres; `render.yaml` la genera) y `ALLOWED_ORIGINS`.

## Docker

- Imágenes en `node:22-alpine` (helmet 8 y el frontend requieren Node ≥18/22).
- `nginx.conf` hace proxy de `/api`, `/usuario`, `/marca`, `/estadoEquipo`, `/uploads` y `/health` al backend: el frontend usa `REACT_APP_BASE_URL=/` (mismo origen, sin CORS) y añade cabeceras `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- `docker-compose.yml`: pasa `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGINS`; healthcheck en `/health`; backend publicado solo en `127.0.0.1`; MongoDB sin puerto publicado y `MONGO_ROOT_PASSWORD` obligatoria (antes `password` por defecto). Si `MONGO_URI` está vacío usa el contenedor `mongodb`.
- Uso: `cp env.docker.example .env`, completar valores y `docker compose up -d --build`; la web queda en `http://localhost`.

## Correos de visita técnica

Todos llegan a `EMAIL_TO`, enviados desde `EMAIL_FROM` (Brevo):

1. **Nueva visita agendada** (`POST /api/agendar-visita`): asunto `📅 Nueva visita técnica: <cliente> - <fecha> <hora>`, con cliente, contacto, dirección, servicio, equipo, fecha, hora, imágenes adjuntas y problema. La respuesta incluye `emailEnviado`. El cliente sigue viendo el enlace de WhatsApp.
2. **Trabajo completado** (`PUT /api/agendar-visita/completar/:id`): correo con observaciones y el token de confirmación. La respuesta incluye `emailEnviado` y ya no devuelve `tokenConfirmacion`. El token solo aparece en los logs si el correo no se pudo enviar, para poder recuperarlo.

Además, `fechaCreacion`/`fechaActualizacion` usan `default: Date.now` (antes `new Date()`, que fijaba la fecha de arranque del servidor en todos los registros).
