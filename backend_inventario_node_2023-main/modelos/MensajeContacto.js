const { Schema, model } = require('mongoose');

const MensajeContactoSchema = Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String },
    tipoEquipo: { type: String, required: true },
    mensaje: { type: String, required: true },
    fechaCreacion: { type: Date, default: new Date() }
});

module.exports = model('MensajeContacto', MensajeContactoSchema);
