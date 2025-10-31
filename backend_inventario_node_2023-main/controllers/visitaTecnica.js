const VisitaTecnica = require('../modelos/VisitaTecnica');
const { request, response } = require('express');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generar token aleatorio
const generarToken = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Token de 6 caracteres
};

const crearVisitaTecnica = async (req = request, res = response) => {
    try {
        const { nombre, contacto, tipoServicio, tipoEquipo, problema, direccion, fecha, hora, imagenEquipo, imagenBoceto } = req.body;
        const visitaTecnica = new VisitaTecnica({
            nombre,
            contacto,
            tipoServicio,
            tipoEquipo,
            problema,
            direccion,
            fecha,
            hora,
            imagenEquipo,
            imagenBoceto
        });

        await visitaTecnica.save();

        // Enviar notificación a WhatsApp
        const mensajeWhatsApp = `🔔 *Nueva Visita Técnica Agendada*\n\n` +
            `👤 *Cliente:* ${nombre}\n` +
            `📞 *Contacto:* ${contacto}\n` +
            `🛠️ *Tipo de Servicio:* ${tipoServicio}\n` +
            `💻 *Tipo de Equipo:* ${tipoEquipo}\n` +
            `📍 *Dirección:* ${direccion}\n` +
            `📅 *Fecha:* ${new Date(fecha).toLocaleDateString('es-CO')}\n` +
            `⏰ *Hora:* ${hora}\n` +
            `📝 *Descripción:* ${problema}`;

        // URL de WhatsApp para enviar mensaje (se abre en el navegador del servidor)
        // Nota: Para automatizar completamente, necesitarías usar la API de WhatsApp Business
        console.log('📱 Notificación WhatsApp generada:');
        console.log(mensajeWhatsApp);
        console.log('Para enviar automáticamente, configure la API de WhatsApp Business');

        return res.status(201).json({ 
            mensaje: 'Visita técnica agendada con éxito', 
            visitaTecnica,
            whatsappMessage: mensajeWhatsApp
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al agendar visita' });
    }
};

// Puedes agregar más funciones aquí para listar, actualizar, eliminar visitas
const listarVisitasTecnicas = async (req = request, res = response) => {
    try {
        const visitas = await VisitaTecnica.find();
        return res.json(visitas);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al listar visitas' });
    }
};

// Completar visita técnica y enviar email con token
const completarVisitaTecnica = async (req = request, res = response) => {
    try {
        const { visitaId } = req.params;
        const { imagenFinal, observacionesTecnico, usuario, marca, estadoEquipo } = req.body;

        const visitaTecnica = await VisitaTecnica.findById(visitaId);
        
        if (!visitaTecnica) {
            return res.status(404).json({ mensaje: 'Visita técnica no encontrada' });
        }

        // Generar token de confirmación
        const token = generarToken();

        // Actualizar la visita
        visitaTecnica.imagenFinal = imagenFinal;
        visitaTecnica.observacionesTecnico = observacionesTecnico;
        visitaTecnica.estadoVisita = 'Completada';
        visitaTecnica.fechaCompletado = new Date();
        visitaTecnica.usuario = usuario;
        visitaTecnica.marca = marca;
        visitaTecnica.estadoEquipo = estadoEquipo;
        visitaTecnica.tokenConfirmacion = token;
        visitaTecnica.fechaActualizacion = new Date();

        await visitaTecnica.save();

        // Configurar el transporter de nodemailer para Outlook (optimizado)
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp-mail.outlook.com',
        //     port: 587,
        //     secure: false, // true para puerto 465, false para 587
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     },
        //     tls: {
        //         ciphers: 'SSLv3',
        //         rejectUnauthorized: true
        //     },
        //     // Configuraciones de rendimiento
        //     pool: true, // Usa pool de conexiones para envíos rápidos
        //     maxConnections: 5,
        //     maxMessages: 10,
        //     rateDelta: 1000, // milisegundos
        //     rateLimit: 5, // máximo 5 emails por segundo
        //     // Timeouts para evitar esperas infinitas
        //     connectionTimeout: 10000, // 10 segundos
        //     greetingTimeout: 5000, // 5 segundos
        //     socketTimeout: 15000 // 15 segundos
        // });

        // Verificar configuración
        console.log('📧 Intentando enviar token desde:', process.env.EMAIL_USER);
        // console.log('🔐 Contraseña configurada:', process.env.EMAIL_PASS ? '✅ Sí (oculta)' : '❌ NO CONFIGURADA');

        // Configurar el contenido del correo para el técnico
        const mailOptions = {
            from: process.env.EMAIL_USER || 'yaam17@outlook.com',
            to: 'yaam17@outlook.com',
            subject: '🔧 Trabajo Completado - Skyway Soluciones Informáticas',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #0066cc; text-align: center;">✅ Trabajo Completado</h2>
                    <p style="font-size: 16px; color: #333;">El técnico ha completado el siguiente trabajo:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">Detalles del Servicio:</h3>
                        <p style="margin: 5px 0;"><strong>👤 Cliente:</strong> ${visitaTecnica.nombre}</p>
                        <p style="margin: 5px 0;"><strong>📞 Contacto:</strong> ${visitaTecnica.contacto}</p>
                        <p style="margin: 5px 0;"><strong>🛠️ Tipo de Servicio:</strong> ${visitaTecnica.tipoServicio}</p>
                        <p style="margin: 5px 0;"><strong>💻 Tipo de Equipo:</strong> ${visitaTecnica.tipoEquipo}</p>
                        <p style="margin: 5px 0;"><strong>📍 Dirección:</strong> ${visitaTecnica.direccion}</p>
                        <p style="margin: 5px 0;"><strong>📅 Fecha Completado:</strong> ${new Date().toLocaleString('es-CO')}</p>
                    </div>
                    
                    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0066cc; margin-top: 0;">📝 Observaciones del Técnico:</h3>
                        <p style="margin: 5px 0; white-space: pre-wrap;">${observacionesTecnico}</p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h3 style="color: #856404; margin-top: 0;">🔐 TOKEN DE CONFIRMACIÓN</h3>
                        <p style="font-size: 14px; color: #856404; margin-bottom: 10px;">
                            Para confirmar la transferencia al inventario, responde a este correo indicando "FIN DE TAREA" 
                            y se te proporcionará automáticamente el siguiente token:
                        </p>
                        <div style="background-color: #fff; padding: 15px; text-align: center; border-radius: 5px; margin: 10px 0;">
                            <p style="font-size: 32px; font-weight: bold; color: #0066cc; margin: 0; letter-spacing: 5px;">${token}</p>
                        </div>
                        <p style="font-size: 12px; color: #856404; margin-top: 10px;">
                            Este token debe ser ingresado en la plataforma (Gestión de Visitas) para completar el proceso.
                        </p>
                    </div>
                    
                    <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #155724; margin-top: 0;">📋 Siguiente Paso:</h3>
                        <ol style="color: #155724;">
                            <li>Ingresa a la plataforma</li>
                            <li>Ve a "Gestión de Visitas"</li>
                            <li>Selecciona la visita completada</li>
                            <li>Ingresa el token: <strong>${token}</strong></li>
                            <li>Completa los datos para transferir al inventario</li>
                        </ol>
                    </div>
                    
                    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                        Este mensaje fue generado automáticamente por Skyway Soluciones Informáticas<br>
                        ${new Date().toLocaleString('es-CO')}
                    </p>
                </div>
            `
        };

        // Verificar credenciales antes de enviar
        if (!process.env.SENDGRID_API_KEY) {
            console.error('❌ ERROR: SENDGRID_API_KEY no configurada en .env');
            console.log('═══════════════════════════════════════════════');
            console.log('🔐 TOKEN DE CONFIRMACIÓN GENERADO: ' + token);
            console.log('⚠️  El email NO se envió (credenciales faltantes)');
            console.log('═══════════════════════════════════════════════');
        } else {
            // Intentar enviar el correo
            try {
                const info = await sgMail.send(mailOptions);
                console.log('✅ Email enviado exitosamente a yaam17@outlook.com con token:', token);
                console.log('📬 ID del mensaje:', info.messageId);
                console.log('═══════════════════════════════════════════════');
                console.log('🔐 TOKEN DE CONFIRMACIÓN GENERADO: ' + token);
                console.log('═══════════════════════════════════════════════');
            } catch (emailError) {
                console.error('❌ Error al enviar correo:', emailError.message);
                console.error('📋 Detalles del error:', emailError);
                if (emailError.code) {
                    console.error('🔢 Código de error:', emailError.code);
                }
                if (emailError.response) {
                    console.error('📝 Respuesta del servidor:', emailError.response);
                }
                console.log('═══════════════════════════════════════════════');
                console.log('🔐 TOKEN DE CONFIRMACIÓN GENERADO: ' + token);
                console.log('⚠️  El email no se envió, pero el token está disponible');
                // console.log('⚠️  Verifica que EMAIL_PASS sea la contraseña de aplicación');
                console.log('═══════════════════════════════════════════════');
            }
        }

               return res.status(200).json({ 
                   mensaje: 'Visita técnica completada. Se ha enviado el token por email a yaam17@outlook.com', 
                   visitaTecnica,
                   tokenGenerado: true
                   // NO enviar el token al frontend por seguridad
               });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error al completar la visita técnica' });
    }
};

// Verificar token de confirmación
const verificarToken = async (req = request, res = response) => {
    try {
        const { visitaId } = req.params;
        const { token } = req.body;

        const visitaTecnica = await VisitaTecnica.findById(visitaId);
        
        if (!visitaTecnica) {
            return res.status(404).json({ mensaje: 'Visita técnica no encontrada' });
        }

        if (visitaTecnica.tokenConfirmacion !== token) {
            return res.status(400).json({ mensaje: 'Token incorrecto. Verifica el token recibido por email.' });
        }

        // Marcar token como verificado
        visitaTecnica.tokenVerificado = true;
        await visitaTecnica.save();

        return res.status(200).json({ 
            mensaje: 'Token verificado correctamente. Ahora puedes transferir al inventario.', 
            tokenVerificado: true 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error al verificar el token' });
    }
};

// Transferir visita completada a inventario (requiere token verificado)
const transferirAInventario = async (req = request, res = response) => {
    try {
        const { visitaId } = req.params;
        const { serial, modelo, descripcion, color, precio, fechaCompra, tipoInventario } = req.body;

        const visitaTecnica = await VisitaTecnica.findById(visitaId);
        
        if (!visitaTecnica) {
            return res.status(404).json({ mensaje: 'Visita técnica no encontrada' });
        }

        if (visitaTecnica.estadoVisita !== 'Completada') {
            return res.status(400).json({ mensaje: 'La visita debe estar completada para transferir a inventario' });
        }

        if (!visitaTecnica.tokenVerificado) {
            return res.status(400).json({ mensaje: 'Debe verificar el token de confirmación antes de transferir al inventario' });
        }

        if (visitaTecnica.transferidoAInventario) {
            return res.status(400).json({ mensaje: 'Esta visita ya fue transferida a inventario' });
        }

        // Crear nuevo item en inventario
        const Inventario = require('../modelos/Inventario');
        const TipoEquipo = require('../modelos/TipoEquipo');
        
        // Buscar o crear el tipo de equipo
        let tipoEquipoId;
        if (visitaTecnica.tipoEquipo) {
            // Si tipoEquipo es un string (nombre), buscar el ObjectId correspondiente
            if (typeof visitaTecnica.tipoEquipo === 'string') {
                let tipoEquipoDoc = await TipoEquipo.findOne({ nombre: visitaTecnica.tipoEquipo });
                
                // Si no existe, crearlo
                if (!tipoEquipoDoc) {
                    tipoEquipoDoc = new TipoEquipo({
                        nombre: visitaTecnica.tipoEquipo,
                        estado: 'Activo',
                        fechaCreacion: new Date(),
                        fechaActualizacion: new Date()
                    });
                    await tipoEquipoDoc.save();
                    console.log(`✅ Tipo de equipo "${visitaTecnica.tipoEquipo}" creado automáticamente`);
                }
                
                tipoEquipoId = tipoEquipoDoc._id;
            } else {
                // Si ya es un ObjectId, usarlo directamente
                tipoEquipoId = visitaTecnica.tipoEquipo;
            }
        }
        
        const nuevoInventario = new Inventario({
            serial,
            modelo,
            descripcion: descripcion || visitaTecnica.problema,
            color,
            foto: visitaTecnica.imagenFinal,
            fotoInicial: visitaTecnica.imagenEquipo || visitaTecnica.imagenBoceto,
            precio,
            usuario: visitaTecnica.usuario,
            marca: visitaTecnica.marca,
            tipoEquipo: tipoEquipoId,
            estadoEquipo: visitaTecnica.estadoEquipo,
            fechaCompra: fechaCompra || new Date(),
            tipoInventario: tipoInventario || ((visitaTecnica.tipoServicio && visitaTecnica.tipoServicio.includes('Desarrollo Web')) ? 'Proyecto Web' : 'Equipo Cliente'),
            clienteAsociado: visitaTecnica.nombre,
            detallesMantenimiento: `${visitaTecnica.tipoServicio} - ${visitaTecnica.observacionesTecnico || ''}`,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        await nuevoInventario.save();

        // Marcar como transferido
        visitaTecnica.transferidoAInventario = true;
        await visitaTecnica.save();

        console.log('✅ Visita transferida a inventario');

        return res.status(201).json({ 
            mensaje: 'Equipo agregado al inventario con éxito', 
            inventario: nuevoInventario 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error al transferir a inventario', error: error.message });
    }
};

module.exports = { crearVisitaTecnica, listarVisitasTecnicas, completarVisitaTecnica, verificarToken, transferirAInventario };
