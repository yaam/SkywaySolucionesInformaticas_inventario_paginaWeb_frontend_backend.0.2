const sgMail = require('@sendgrid/mail');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// EMAIL_FROM debe ser un remitente verificado en el proveedor (Brevo: Senders; SendGrid: Sender Authentication).
// Si BREVO_API_KEY está definida se usa Brevo; si no, SendGrid.
const obtenerRemitente = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || 'yaam17@outlook.com';
const obtenerDestinatario = () => process.env.EMAIL_TO || 'yeisonangulo61@gmail.com';

const escaparHtml = (valor) => String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const proveedorEmail = () => {
    if (process.env.BREVO_API_KEY) return 'Brevo';
    if (process.env.SENDGRID_API_KEY) return 'SendGrid';
    return null;
};

const enviarConBrevo = async ({ to, subject, html }) => {
    const respuesta = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify({
            sender: { email: obtenerRemitente() },
            to: [{ email: to }],
            subject,
            htmlContent: html
        })
    });
    const cuerpo = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
        const error = new Error(cuerpo.message || `Brevo respondió ${respuesta.status}`);
        error.code = respuesta.status;
        error.proveedor = 'Brevo';
        error.detalle = cuerpo;
        throw error;
    }
    return { to, statusCode: respuesta.status, messageId: cuerpo.messageId };
};

const enviarConSendGrid = async ({ to, subject, html }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const [respuesta] = await sgMail.send({ from: obtenerRemitente(), to, subject, html });
    return {
        to,
        statusCode: respuesta.statusCode,
        messageId: respuesta.headers['x-message-id']
    };
};

const enviarEmail = async ({ to = obtenerDestinatario(), subject, html }) => {
    const proveedor = proveedorEmail();
    if (proveedor === 'Brevo') {
        return enviarConBrevo({ to, subject, html });
    }
    if (proveedor === 'SendGrid') {
        return enviarConSendGrid({ to, subject, html });
    }
    throw new Error('Ningún proveedor de correo configurado (BREVO_API_KEY o SENDGRID_API_KEY)');
};

const registrarErrorEmail = (error) => {
    console.error('❌ Error al enviar correo:', error.message);
    if (error.code) {
        console.error('🔢 Código de error:', error.code);
    }
    if (error.proveedor === 'Brevo') {
        console.error('📝 Respuesta de Brevo:', JSON.stringify(error.detalle));
        if (error.code === 401) {
            console.error('⚠️  BREVO_API_KEY inválida');
        }
        if (error.code === 400) {
            console.error(`⚠️  Verifica que ${obtenerRemitente()} sea un remitente verificado en Brevo (Senders)`);
        }
        return;
    }
    const errores = error.response && error.response.body && error.response.body.errors;
    if (errores) {
        console.error('📝 Respuesta de SendGrid:', JSON.stringify(errores));
    }
    if (error.code === 403) {
        console.error(`⚠️  Verifica que ${obtenerRemitente()} sea un remitente verificado en SendGrid (Settings → Sender Authentication)`);
    }
    if (error.code === 401) {
        console.error('⚠️  SENDGRID_API_KEY inválida o sin permiso "Mail Send"');
    }
};

module.exports = { enviarEmail, proveedorEmail, escaparHtml, registrarErrorEmail, obtenerRemitente, obtenerDestinatario };
