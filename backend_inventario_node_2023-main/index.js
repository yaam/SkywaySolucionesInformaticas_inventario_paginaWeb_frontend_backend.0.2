const express = require('express');
const {getConnection} = require('./db/db-connection-mongo');
require('dotenv').config();
const cors = require ('cors');
const app = express();
const port = process.env.PORT || 4001;
const host = '0.0.0.0'; // Escuchar en todas las interfaces para Render

// Limpiar y verificar MONGO_URI
if (process.env.MONGO_URI) {
    // Limpiar espacios y saltos de línea
    process.env.MONGO_URI = process.env.MONGO_URI.trim();
    console.log('✅ MONGO_URI configurada correctamente');
    console.log('🔗 Longitud:', process.env.MONGO_URI.length, 'caracteres');
    console.log('🔗 Comienza con:', process.env.MONGO_URI.substring(0, 20) + '...');
} else {
    console.error('❌ Error: MONGO_URI no está configurada');
    console.error('📝 En Render: Ve a Dashboard → Environment → Add Environment Variable');
    console.error('📝 En local: Crea un archivo .env con MONGO_URI=tu_connection_string');
    process.exit(1);
}

app.use(cors());
// Parseo JSON
app.use(express.json());
// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Ruta de health check para Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

getConnection();

// middlewares
app.use('/usuario', require('./rutas/usuario'));
app.use('/estadoEquipo', require('./rutas/estadoEquipo'));
app.use('/marca', require('./rutas/marca'));
app.use('/api/tipos', require('./rutas/tipoEquipo'));
app.use('/api/inventarios', require('./rutas/inventarios'));
app.use('/api/agendar-visita', require('./rutas/visitaTecnica')); // <-- Nueva ruta
app.use('/api/contacto', require('./rutas/contacto')); // <-- Nueva ruta

app.listen(port, host, () => {
    console.log(`🚀 Servidor corriendo en ${host}:${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://${host}:${port}/health`);
});