const MensajeContacto = require('../modelos/MensajeContacto');
const { request, response } = require('express');
const { enviarEmail, proveedorEmail, escaparHtml, registrarErrorEmail, obtenerRemitente } = require('../helpers/email');
const { esErrorDeDatos, detalleErrorDeDatos } = require('../helpers/errores');

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

        // Intentar guardar en MongoDB (opcional si hay error de conexión)
        try {
            await mensajeContacto.save();
            console.log('✅ Mensaje guardado en MongoDB');
        } catch (dbError) {
            console.log('⚠️ No se pudo guardar en MongoDB (continuando con envío de email):', dbError.message);
        }

        console.log('📧 Intentando enviar correo desde:', obtenerRemitente());

        // Configurar el contenido del correo
        const mailOptions = {
            subject: '🔔 Nuevo Cliente Solicita Contacto - Skyway Soluciones Informáticas',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #0066cc; text-align: center;">📧 Solicitud de Contacto</h2>
                    <p style="font-size: 16px; color: #333;">Un cliente ha solicitado que el personal de <strong>Skyway Soluciones Informáticas</strong> se ponga en contacto.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">Datos del Cliente:</h3>
                        <p style="margin: 5px 0;"><strong>👤 Nombre:</strong> ${escaparHtml(nombre)}</p>
                        <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${escaparHtml(email)}</p>
                        <p style="margin: 5px 0;"><strong>📞 Teléfono:</strong> ${escaparHtml(telefono || 'No proporcionado')}</p>
                        <p style="margin: 5px 0;"><strong>☎️ Línea de Llamada:</strong> ${escaparHtml(lineaLlamada || 'No proporcionado')}</p>
                        <p style="margin: 5px 0;"><strong>💬 WhatsApp:</strong> ${escaparHtml(whatsapp || 'No proporcionado')}</p>
                    </div>
                    
                    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">💬 Mensaje:</h3>
                        <p style="margin: 5px 0; white-space: pre-wrap;">${escaparHtml(mensaje)}</p>
                    </div>
                    
                    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                        Este mensaje fue enviado desde el formulario de contacto de Skyway Soluciones Informáticas<br>
                        ${new Date().toLocaleString('es-CO')}
                    </p>
                </div>
            `
        };

        // Verificar credenciales antes de enviar
        if (!proveedorEmail()) {
            console.error('❌ ERROR: configura BREVO_API_KEY o SENDGRID_API_KEY');
            return res.status(201).json({ 
                mensaje: 'Mensaje guardado, pero correo no enviado (credenciales faltantes)', 
                mensajeContacto 
            });
        }

        // Intentar enviar el correo
        try {
            const info = await enviarEmail(mailOptions);
            console.log('✅ Correo de notificación enviado exitosamente a', info.to);
            console.log('📬 ID del mensaje:', info.messageId);
            return res.status(201).json({ 
                mensaje: 'Mensaje de contacto recibido con éxito y notificación enviada', 
                mensajeContacto,
                emailEnviado: true
            });
        } catch (emailError) {
            registrarErrorEmail(emailError);
            console.log('⚠️ Mensaje guardado en la base de datos, pero el correo no se pudo enviar');
            return res.status(201).json({ 
                mensaje: 'Mensaje de contacto recibido con éxito (correo no enviado)', 
                mensajeContacto,
                emailEnviado: false
            });
        }

    } catch (error) {
        if (esErrorDeDatos(error)) {
            return res.status(400).json({ mensaje: detalleErrorDeDatos(error) });
        }
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al enviar mensaje de contacto' });
    }
};

module.exports = { crearMensajeContacto };
