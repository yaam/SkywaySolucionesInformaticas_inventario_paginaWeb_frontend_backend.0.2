# Configuración de correo con Brevo

El backend envía los correos (contacto y token de visita técnica) desde `backend_inventario_node_2023-main/helpers/email.js`, usando la API HTTP de Brevo. Si `BREVO_API_KEY` está definida, se usa Brevo; si no, SendGrid (`SENDGRID_API_KEY`, ver `CONFIGURACION_EMAIL_SENDGRID.md`).

Plan gratuito: 300 correos al día y sin dominio propio (basta con un remitente verificado).

## 1. Cuenta y remitente

1. Regístrate en https://www.brevo.com.
2. Ve a **Senders, Domains & Dedicated IPs → Senders → Add a sender** y confirma el correo de verificación. Ese correo será `EMAIL_FROM`.

## 2. API key

En **SMTP & API → API Keys → Generate a new API key**. Empieza con `xkeysib-`. No la pegues en chats ni en el repo.

## 3. Variables

| Variable | Valor |
|---|---|
| `BREVO_API_KEY` | `xkeysib-…` |
| `EMAIL_FROM` | remitente verificado en Brevo |
| `EMAIL_TO` | destinatario de las notificaciones |

- **Render:** servicio → Environment → agregar las variables → **Save, rebuild, and deploy**.
- **Local:** `backend_inventario_node_2023-main/.env`.
- **Docker:** `.env` de la raíz y luego `docker compose up -d backend`.

## 4. Prueba

```bash
cd backend_inventario_node_2023-main
node test-email.js destinatario@ejemplo.com
```

Respuestas de error de Brevo: `401` = key inválida; `400` con mensaje de sender = `EMAIL_FROM` no verificado.
