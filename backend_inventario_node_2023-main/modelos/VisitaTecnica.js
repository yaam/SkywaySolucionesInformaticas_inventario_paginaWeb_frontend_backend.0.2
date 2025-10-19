const { Schema, model } = require('mongoose');

const VisitaTecnicaSchema = Schema({
    nombre: { type: String, required: true },
    contacto: { type: String, required: true },
    tipoEquipo: { type: String, required: true },
    problema: { type: String, required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    fechaCreacion: { type: Date, default: new Date() },
    fechaActualizacion: { type: Date, default: new Date() }
});

module.exports = model('VisitaTecnica', VisitaTecnicaSchema);
