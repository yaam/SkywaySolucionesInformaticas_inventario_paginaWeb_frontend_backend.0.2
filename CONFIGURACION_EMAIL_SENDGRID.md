# 📧 Configuración de Email con SendGrid

El backend envía las notificaciones (formulario de contacto y token de visita técnica completada)
con la API HTTP de SendGrid (`@sendgrid/mail`). Ya no se usa SMTP/Outlook ni `nodemailer`, por lo
que no hay problemas de firewall con el puerto 587.

El envío está centralizado en `backend_inventario_node_2023-main/helpers/email.js`, que usan
`controllers/contacto.js`, `controllers/visitaTecnica.js` y el script `test-email.js`.

---

## 1. Crear una API key

1. Crea una cuenta en https://signup.sendgrid.com (el plan gratuito permite 100 emails/día).
2. Ve a **Settings → API Keys → Create API Key**.
3. Elige **Restricted Access** y habilita solo **Mail Send → Full Access** (o usa *Full Access*).
4. Copia la key (empieza con `SG.`). SendGrid solo la muestra una vez.

## 2. Verificar el remitente (obligatorio)

SendGrid rechaza con **403 Forbidden** cualquier envío cuyo `from` no sea una identidad verificada.

- **Opción rápida – Single Sender:** **Settings → Sender Authentication → Verify a Single Sender**,
  ingresa el correo remitente (por ejemplo `yaam17@outlook.com`) y confirma el enlace que llega a ese buzón.
- **Opción recomendada para producción – Domain Authentication:** autentica tu dominio con los
  registros DNS que indica SendGrid; luego puedes usar cualquier dirección de ese dominio.

> Nota: los remitentes de buzones gratuitos (outlook.com, gmail.com) pueden terminar en spam por
> DMARC aunque estén verificados. Con un dominio propio autenticado la entrega es más confiable.

## 3. Variables de entorno

| Variable | Descripción |
|---|---|
| `SENDGRID_API_KEY` | API key creada en el paso 1 (obligatoria para enviar). |
| `EMAIL_FROM` | Remitente verificado en el paso 2. Si falta se usa `EMAIL_USER`. |
| `EMAIL_TO` | Destinatario de las notificaciones. |

### Local (`backend_inventario_node_2023-main/.env`)

```env
PORT=4001
MONGO_URI=tu_connection_string_de_mongodb
SENDGRID_API_KEY=SG.xxxxxxxx
EMAIL_FROM=tu_email_verificado@outlook.com
EMAIL_TO=destinatario@ejemplo.com
```

`.env` está en `.gitignore`: **nunca subas la API key al repositorio.**

### Render

En el dashboard: **skyway-backend → Environment → Add Environment Variable** y agrega
`SENDGRID_API_KEY`, `EMAIL_FROM` y `EMAIL_TO` (ya están declaradas en `render.yaml` con `sync: false`).
Guarda los cambios; Render redespliega el servicio automáticamente.

### Docker

Agrega las mismas variables al `.env` usado por `docker-compose` (ver `env.docker.example`).

## 4. Probar

```bash
cd backend_inventario_node_2023-main
npm install
node test-email.js                  # envía a EMAIL_TO
node test-email.js otro@correo.com  # o a otra dirección
```

Respuestas de error frecuentes:

- **401 Unauthorized:** API key inválida o sin permiso *Mail Send*.
- **403 Forbidden:** `EMAIL_FROM` no está verificado como remitente en SendGrid.

También puedes revisar cada envío en **Activity Feed** del dashboard de SendGrid.
