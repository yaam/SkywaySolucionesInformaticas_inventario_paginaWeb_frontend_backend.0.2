const MensajeContacto = require('../modelos/MensajeContacto');
const { request, response } = require('express');

/**
 * Handles incoming contact messages by extracting data from the request body,
 * saving it to the database, and returning a success or error response.
 * 
 * @param {Object} req - The request object containing the contact message data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @returns {Promise<Object>} - A JSON response indicating success or error.
 * @throws {Error} - Throws an error if there is an issue saving the message or processing the request.
 */
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
