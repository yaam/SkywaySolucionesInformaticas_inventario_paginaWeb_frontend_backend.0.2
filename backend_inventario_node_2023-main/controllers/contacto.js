const MensajeContacto = require('../modelos/MensajeContacto');
const { request, response } = require('express');
const nodemailer = require('nodemailer');

/**
 * Handles incoming contact messages by extracting data from the request body,
 * saving it to the database, sending an email notification, and returning a success or error response.
 * 
 * @param {Object} req - The request object containing the contact message data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @returns {Promise<Object>} - A JSON response indicating success or error.
 * @throws {Error} - Throws an error if there is an issue saving the message or processing the request.
 */
const crearMensajeContacto = async (req = request, res = response) => {
    try {
        const { nombre, email, telefono, lineaLlamada, whatsapp, mensaje } = req.body;
        const mensajeContacto = new MensajeContacto({
            nombre,
            email,
            telefono,
            lineaLlamada,
            whatsapp,
            mensaje
        });

        await mensajeContacto.save();

        // Configurar el transporter de nodemailer para Outlook
        const transporter = nodemailer.createTransport({
            service: 'hotmail', // Outlook/Hotmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Soluciona el error de certificado SSL
            }
        });

        // Verificar configuración
        console.log('📧 Intentando enviar correo desde:', process.env.EMAIL_USER);
        console.log('🔐 Contraseña configurada:', process.env.EMAIL_PASS ? '✅ Sí (oculta)' : '❌ NO CONFIGURADA');

        // Configurar el contenido del correo
        const mailOptions = {
            from: process.env.EMAIL_USER || 'yaam17@outlook.com',
            to: 'yaam17@outlook.com',
            subject: '🔔 Nuevo Cliente Solicita Contacto - Skyway Soluciones Informáticas',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #0066cc; text-align: center;">📧 Solicitud de Contacto</h2>
                    <p style="font-size: 16px; color: #333;">Un cliente ha solicitado que el personal de <strong>Skyway Soluciones Informáticas</strong> se ponga en contacto.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">Datos del Cliente:</h3>
                        <p style="margin: 5px 0;"><strong>👤 Nombre:</strong> ${nombre}</p>
                        <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>📞 Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
                        <p style="margin: 5px 0;"><strong>☎️ Línea de Llamada:</strong> ${lineaLlamada || 'No proporcionado'}</p>
                        <p style="margin: 5px 0;"><strong>💬 WhatsApp:</strong> ${whatsapp || 'No proporcionado'}</p>
                    </div>
                    
                    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">💬 Mensaje:</h3>
                        <p style="margin: 5px 0; white-space: pre-wrap;">${mensaje}</p>
                    </div>
                    
                    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                        Este mensaje fue enviado desde el formulario de contacto de Skyway Soluciones Informáticas<br>
                        ${new Date().toLocaleString('es-CO')}
                    </p>
                </div>
            `
        };

        // Verificar credenciales antes de enviar
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ ERROR: EMAIL_USER o EMAIL_PASS no configurados en .env');
            return res.status(201).json({ 
                mensaje: 'Mensaje guardado, pero correo no enviado (credenciales faltantes)', 
                mensajeContacto 
            });
        }

        // Intentar enviar el correo
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Correo de notificación enviado exitosamente a yaam17@outlook.com');
            console.log('📬 ID del mensaje:', info.messageId);
            return res.status(201).json({ 
                mensaje: 'Mensaje de contacto recibido con éxito y notificación enviada', 
                mensajeContacto,
                emailEnviado: true
            });
        } catch (emailError) {
            console.error('❌ Error al enviar correo:', emailError.message);
            console.error('📋 Detalles del error:', emailError);
            if (emailError.code) {
                console.error('🔢 Código de error:', emailError.code);
            }
            if (emailError.response) {
                console.error('📝 Respuesta del servidor:', emailError.response);
            }
            console.log('⚠️ Mensaje guardado en la base de datos, pero el correo no se pudo enviar');
            console.log('⚠️ Verifica que EMAIL_PASS sea la contraseña de aplicación de Outlook');
            return res.status(201).json({ 
                mensaje: 'Mensaje de contacto recibido con éxito (correo no enviado)', 
                mensajeContacto,
                emailEnviado: false,
                error: emailError.message
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al enviar mensaje de contacto' });
    }
};

module.exports = { crearMensajeContacto };
