// Script de prueba: envía un email usando el mismo helper (Brevo o SendGrid) que usan los controladores.
// Uso: node test-email.js [destinatario]
require('dotenv').config();
const { enviarEmail, proveedorEmail, registrarErrorEmail, obtenerRemitente, obtenerDestinatario } = require('./helpers/email');

const destinatario = process.argv[2] || obtenerDestinatario();

console.log('========================================');
console.log('PRUEBA DE ENVÍO DE EMAIL -', proveedorEmail() || 'SIN PROVEEDOR');
console.log('========================================');
console.log('📤 Remitente (debe estar verificado en el proveedor):', obtenerRemitente());
console.log('📥 Destinatario:', destinatario);
console.log('');

if (!proveedorEmail()) {
    console.log('❌ Agrega BREVO_API_KEY=xkeysib-xxxx (o SENDGRID_API_KEY=SG.xxxx) al archivo .env');
    process.exit(1);
}

enviarEmail({
    to: destinatario,
    subject: '✅ Prueba Exitosa - Skyway Soluciones Informáticas',
    html: `
        <h2>🎉 ¡Email de Prueba Exitoso!</h2>
        <p>Si recibes este correo, significa que:</p>
        <ul>
            <li>✅ La API key del proveedor es válida</li>
            <li>✅ El remitente ${obtenerRemitente()} está verificado en el proveedor</li>
            <li>✅ El sistema puede enviar correos correctamente</li>
        </ul>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
        <p><strong>Sistema:</strong> Skyway Soluciones Informáticas</p>
    `
})
    .then((info) => {
        console.log('✅ EMAIL ACEPTADO POR ' + proveedorEmail() + ' (HTTP ' + info.statusCode + ')');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Revisa la bandeja de entrada (y spam) de:', info.to);
    })
    .catch((error) => {
        registrarErrorEmail(error);
        process.exitCode = 1;
    });
