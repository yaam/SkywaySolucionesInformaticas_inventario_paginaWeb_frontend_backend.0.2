const { Schema, model } = require('mongoose');

const MensajeContactoSchema = Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String },
    lineaLlamada: { type: String },
    whatsapp: { type: String },
    mensaje: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = model('MensajeContacto', MensajeContactoSchema);
