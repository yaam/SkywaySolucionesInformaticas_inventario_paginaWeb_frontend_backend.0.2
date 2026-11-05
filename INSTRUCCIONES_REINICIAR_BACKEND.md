# 🚀 Instrucciones para Reiniciar el Backend

Los correos se envían con **SendGrid** (`@sendgrid/mail`, ver `backend_inventario_node_2023-main/helpers/email.js`). `EMAIL_PASS` y la contraseña de aplicación de Outlook ya no se usan. Configuración completa en `CONFIGURACION_EMAIL_SENDGRID.md`.

## Variables de correo

```
SENDGRID_API_KEY=SG.xxxxxxxx         # obligatoria para enviar
EMAIL_FROM=<remitente verificado>    # si falta se usa EMAIL_USER
EMAIL_TO=<destinatario>
```

`EMAIL_FROM` debe estar verificado en SendGrid → Settings → Sender Authentication.

---

## 🔄 Paso 1: Reiniciar el Backend

### Opción A: Local

1. Edita `backend_inventario_node_2023-main/.env` con las variables anteriores.
2. Detén el servidor (`Ctrl + C`) y vuelve a iniciarlo:
   ```powershell
   cd backend_inventario_node_2023-main
   npm start
   ```
3. Comprueba `http://localhost:4001/health` (`"status": "ok"` y `db.state: "connected"`).

### Opción B: Docker

1. Agrega las variables al `.env` de la raíz (ver `env.docker.example`).
2. Recrea el backend para que lea las variables nuevas:
   ```powershell
   docker compose up -d backend
   docker compose logs -f backend
   ```
   `docker compose restart` no recarga el `.env`.

### Opción C: Render (producción)

1. https://dashboard.render.com → servicio de `skywaysolucionesinformaticas-inventario.onrender.com` → **Environment**.
2. Agrega o edita `SENDGRID_API_KEY`, `EMAIL_FROM` y `EMAIL_TO`.
3. Pulsa **Save, rebuild, and deploy** y espera a que el deploy esté **Live** en Events.

---

## 🧪 Paso 2: Probar el Envío de Correos

1. Abre el formulario **Contacto** del frontend y envía un mensaje de prueba.
2. Respuesta esperada de `POST /api/contacto`: `"emailEnviado": true`.
3. Revisa la bandeja de `EMAIL_TO` y, si no llega, SendGrid → **Activity Feed**.

Para visitas técnicas: completa una visita en **Gestión** (requiere login de administrador); el token de confirmación llega a `EMAIL_TO`.

---

## 🐛 Si los Correos NO Llegan

| Síntoma | Causa probable | Solución |
|---|---|---|
| `emailEnviado: false` y log "SENDGRID_API_KEY no configurada" | Falta la key | Agrega `SENDGRID_API_KEY` y redespliega |
| Error 401 / 403 de SendGrid | Key inválida o sin permiso Mail Send | Crea una key nueva con *Mail Send* |
| Error "The from address does not match a verified Sender Identity" | `EMAIL_FROM` no verificado | Verifica el remitente en Sender Authentication |
| Llega a SPAM | Remitente sin dominio autenticado | Autentica el dominio en SendGrid (SPF/DKIM) |

---

## 📊 Checklist Final

- [ ] `SENDGRID_API_KEY`, `EMAIL_FROM` y `EMAIL_TO` configuradas
- [ ] Backend reiniciado / redesplegado
- [ ] Formulario de contacto probado (`emailEnviado: true`)
- [ ] Correo recibido en `EMAIL_TO`
