const express = require('express');
const {getConnection, getDbStatus} = require('./db/db-connection-mongo');
require('dotenv').config();
const cors = require ('cors');
const app = express();
const port = process.env.PORT || 4001;
const host = '0.0.0.0'; // Escuchar en todas las interfaces para Render

// Limpiar y verificar MONGO_URI
if (process.env.MONGO_URI) {
    // Limpiar espacios, saltos de línea y prefijos incorrectos
    let mongoUri = process.env.MONGO_URI.trim().replace(/\s+/g, '');
    
    // Limpiar prefijos comunes que pueden aparecer por error
    mongoUri = mongoUri.replace(/^MONGO_URI[=:\s]*/i, '');
    mongoUri = mongoUri.replace(/^Key:\s*MONGO_URI\s*Value:\s*/i, '');
    mongoUri = mongoUri.replace(/^Key:\s*MONGO_URI\s*/i, '');
    mongoUri = mongoUri.replace(/^Value:\s*/i, '');
    
    // Actualizar la variable de entorno con el valor limpio
    process.env.MONGO_URI = mongoUri;
    
    console.log('✅ MONGO_URI configurada correctamente');
    console.log('🔗 Longitud:', mongoUri.length, 'caracteres');
    console.log('🔗 Comienza con:', mongoUri.substring(0, 14) + '...');
    console.log('🔗 Termina con:', '...' + mongoUri.substring(mongoUri.length - 20));
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
// Responde 200 aunque la DB falle para que Render no reinicie el servicio; el estado real va en `db`.
// El nombre de la base y el último error solo se registran en los logs (no se exponen públicamente).
app.get('/health', (req, res) => {
    const { state, readyState } = getDbStatus();
    res.status(200).json({
        status: state === 'connected' ? 'ok' : 'degraded',
        message: 'Server is running',
        db: { state, readyState },
    });
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