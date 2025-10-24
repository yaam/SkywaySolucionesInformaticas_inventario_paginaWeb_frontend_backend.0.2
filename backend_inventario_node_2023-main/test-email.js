// Script de prueba simple para verificar el envío de emails
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('========================================');
console.log('PRUEBA DE ENVÍO DE EMAIL - OUTLOOK');
console.log('========================================');
console.log('');

console.log('📧 Email configurado:', process.env.EMAIL_USER);
console.log('🔐 Contraseña configurada:', process.env.EMAIL_PASS ? '✅ Sí' : '❌ NO');
console.log('');

// Configuración simple con servicio hotmail
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log('🔄 Verificando credenciales...');
transporter.verify(function(error, success) {
    if (error) {
        console.log('');
        console.log('❌ ERROR AL VERIFICAR CREDENCIALES:');
        console.log(error.message);
        console.log('');
        console.log('Posibles causas:');
        console.log('1. La contraseña de aplicación es incorrecta');
        console.log('2. La contraseña de aplicación expiró');
        console.log('3. La cuenta de Outlook tiene restricciones');
        console.log('');
        console.log('Solución:');
        console.log('1. Ve a: https://account.microsoft.com/security');
        console.log('2. Crea una NUEVA contraseña de aplicación');
        console.log('3. Actualiza el archivo .env con la nueva contraseña');
    } else {
        console.log('✅ CREDENCIALES VÁLIDAS - Servidor listo para enviar');
        console.log('');
        console.log('🚀 Enviando email de prueba...');
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '✅ Prueba Exitosa - Skyway Soluciones Informáticas',
            html: `
                <h2>🎉 ¡Email de Prueba Exitoso!</h2>
                <p>Si recibes este correo, significa que:</p>
                <ul>
                    <li>✅ La configuración de Outlook está correcta</li>
                    <li>✅ La contraseña de aplicación es válida</li>
                    <li>✅ El sistema puede enviar correos correctamente</li>
                </ul>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
                <p><strong>Sistema:</strong> Skyway Soluciones Informáticas</p>
            `
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('❌ Error al enviar:', err.message);
            } else {
                console.log('✅ EMAIL ENVIADO EXITOSAMENTE!');
                console.log('📬 Message ID:', info.messageId);
                console.log('');
                console.log('📧 Revisa tu bandeja de entrada en:', process.env.EMAIL_USER);
                console.log('');
                console.log('🎉 ¡Todo funciona correctamente!');
            }
            process.exit(0);
        });
    }
});

