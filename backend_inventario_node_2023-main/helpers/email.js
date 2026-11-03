const sgMail = require('@sendgrid/mail');

// EMAIL_FROM debe ser un remitente verificado en SendGrid (Single Sender o dominio autenticado);
// de lo contrario SendGrid rechaza el envío con 403 Forbidden.
const obtenerRemitente = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || 'yaam17@outlook.com';
const obtenerDestinatario = () => process.env.EMAIL_TO || 'yeisonangulo61@gmail.com';

const enviarEmail = async ({ to = obtenerDestinatario(), subject, html }) => {
    if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY no configurada');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const [respuesta] = await sgMail.send({ from: obtenerRemitente(), to, subject, html });
    return {
        to,
        statusCode: respuesta.statusCode,
        messageId: respuesta.headers['x-message-id']
    };
};

const registrarErrorEmail = (error) => {
    console.error('❌ Error al enviar correo:', error.message);
    if (error.code) {
        console.error('🔢 Código de error:', error.code);
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

module.exports = { enviarEmail, registrarErrorEmail, obtenerRemitente, obtenerDestinatario };
