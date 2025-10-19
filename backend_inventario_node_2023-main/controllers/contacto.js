const MensajeContacto = require('../modelos/MensajeContacto');
const { request, response } = require('express');

const crearMensajeContacto = async (req = request, res = response) => {
    try {
        const { nombre, email, telefono, tipoEquipo, mensaje } = req.body;
        const mensajeContacto = new MensajeContacto({
            nombre,
            email,
            telefono,
            tipoEquipo,
            mensaje
        });

        await mensajeContacto.save();
        return res.status(201).json({ mensaje: 'Mensaje de contacto recibido con éxito', mensajeContacto });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al enviar mensaje de contacto' });
    }
};

module.exports = { crearMensajeContacto };
