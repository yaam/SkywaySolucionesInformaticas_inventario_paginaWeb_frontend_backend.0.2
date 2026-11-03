// Script de prueba: envía un email usando el mismo helper (SendGrid) que usan los controladores.
// Uso: node test-email.js [destinatario]
require('dotenv').config();
const { enviarEmail, registrarErrorEmail, obtenerRemitente, obtenerDestinatario } = require('./helpers/email');

const destinatario = process.argv[2] || obtenerDestinatario();

console.log('========================================');
console.log('PRUEBA DE ENVÍO DE EMAIL - SENDGRID');
console.log('========================================');
console.log('🔐 SENDGRID_API_KEY configurada:', process.env.SENDGRID_API_KEY ? '✅ Sí' : '❌ NO');
console.log('📤 Remitente (debe estar verificado en SendGrid):', obtenerRemitente());
console.log('📥 Destinatario:', destinatario);
console.log('');

if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ Agrega SENDGRID_API_KEY=SG.xxxx al archivo .env');
    process.exit(1);
}

enviarEmail({
    to: destinatario,
    subject: '✅ Prueba Exitosa - Skyway Soluciones Informáticas',
    html: `
        <h2>🎉 ¡Email de Prueba Exitoso!</h2>
        <p>Si recibes este correo, significa que:</p>
        <ul>
            <li>✅ La API key de SendGrid es válida</li>
            <li>✅ El remitente ${obtenerRemitente()} está verificado en SendGrid</li>
            <li>✅ El sistema puede enviar correos correctamente</li>
        </ul>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
        <p><strong>Sistema:</strong> Skyway Soluciones Informáticas</p>
    `
})
    .then((info) => {
        console.log('✅ EMAIL ACEPTADO POR SENDGRID (HTTP ' + info.statusCode + ')');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Revisa la bandeja de entrada (y spam) de:', info.to);
    })
    .catch((error) => {
        registrarErrorEmail(error);
        process.exitCode = 1;
    });
