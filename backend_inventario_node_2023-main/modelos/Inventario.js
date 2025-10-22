const {Schema, model} = require('mongoose');

const InventarioSchema = Schema ({
    serial: {
        type: String,
        required: true,
        unique: true,
    },
    modelo:{
        type: String,
        required: true,
    
    },
	descripcion: {
        type: String,
        required: true,
        
    },
    color: {
        type: String,
        required: true,
        
    },
    foto:{
        type: String,
        required: true,
    },
    fotoInicial:{
        type: String,
        required: false,
    },
    precio: {
        type: Number,
        required: true,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false,
    },
	marca:{
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: true,
    },
	tipoEquipo:{
        type: Schema.Types.ObjectId,
        ref: 'TipoEquipo',
        required: true,
    },
	estadoEquipo:{
        type: Schema.Types.ObjectId,
        ref: 'EstadoEquipo',
        required: true,
    },
    fechaCompra:{
        type: Date,
        required: true,
    },
	fechaCreacion: {
        type: Date,
        default: new Date(),
    },
	fechaActualizacion: {
        type: Date,
        default: new Date(),
    },
    // Nuevos campos para categorizar el inventario
    tipoInventario: { type: String, required: true, enum: ['Equipo Cliente', 'Rack Telecomunicaciones', 'Proyecto Web', 'Equipo Propio'] }, // Ejemplo de categorías
    clienteAsociado: { type: String }, // Para equipos de clientes o proyectos web
    fechaMantenimientoProgramado: { type: Date }, // Para mantenimiento preventivo
    detallesMantenimiento: { type: String }, // Detalles de mantenimiento realizado
    tecnologiaWeb: { type: String }, // Para proyectos web (ej: React, Node.js, MongoDB)
    urlProyecto: { type: String }, // URL del proyecto web si aplica
    activo: { type: Boolean, default: true }, // Indica si el equipo está activo o inactivo
    seguimiento: { type: String, default: '' } // Seguimiento detallado del estado del equipo
});
 
module.exports = model('Inventario', InventarioSchema);