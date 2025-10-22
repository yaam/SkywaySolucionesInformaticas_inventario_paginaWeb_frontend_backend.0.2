const { Schema, model } = require('mongoose');

const VisitaTecnicaSchema = Schema({
    nombre: { type: String, required: true },
    contacto: { type: String, required: true },
    tipoServicio: { type: String, required: true },
    tipoEquipo: { type: String, required: true },
    problema: { type: String, required: true },
    direccion: { type: String, required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    imagenEquipo: { type: String, required: false }, // Imagen del estado inicial del equipo
    imagenBoceto: { type: String, required: false }, // Boceto del diseño web
    imagenFinal: { type: String, required: false }, // Imagen del estado final después del trabajo
    estadoVisita: { 
        type: String, 
        enum: ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'], 
        default: 'Pendiente' 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: false
    },
    estadoEquipo: {
        type: Schema.Types.ObjectId,
        ref: 'EstadoEquipo',
        required: false
    },
    observacionesTecnico: { type: String, required: false }, // Observaciones del técnico al completar
    fechaCompletado: { type: Date, required: false },
    transferidoAInventario: { type: Boolean, default: false },
    tokenConfirmacion: { type: String, required: false }, // Token para verificar confirmación
    tokenVerificado: { type: Boolean, default: false },
    fechaCreacion: { type: Date, default: new Date() },
    fechaActualizacion: { type: Date, default: new Date() }
});

module.exports = model('VisitaTecnica', VisitaTecnicaSchema);
