const express = require('express');
const {getConnection, getDbStatus} = require('./db/db-connection-mongo');
// Docker Compose pasa como '' las variables no definidas; se eliminan para que dotenv cargue las del .env.
for (const [clave, valor] of Object.entries(process.env)) {
    if (valor === '') delete process.env[clave];
}
require('dotenv').config();
const cors = require ('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { authConfigurada, login, requireAuth, limitadorGeneral, limitadorLogin } = require('./middlewares/seguridad');
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
} else {
    console.error('❌ Error: MONGO_URI no está configurada');
    console.error('📝 En Render: Ve a Dashboard → Environment → Add Environment Variable');
    console.error('📝 En local: Crea un archivo .env con MONGO_URI=tu_connection_string');
    process.exit(1);
}

if (!authConfigurada()) {
    console.warn('⚠️ ADMIN_USER, ADMIN_PASSWORD o JWT_SECRET (>=32 caracteres) no configurados: las rutas de administración responderán 503');
}

// Neutraliza operadores como {"$ne": null} enviados en filtros (inyección NoSQL)
mongoose.set('sanitizeFilter', true);

const ORIGENES_POR_DEFECTO = 'https://skyway-soluciones-informaticas-inve.vercel.app,http://localhost:3000';
const origenesPermitidos = (process.env.ALLOWED_ORIGINS || ORIGENES_POR_DEFECTO)
    .split(',').map((o) => o.trim()).filter(Boolean);

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
    origin: (origin, callback) => callback(null, !origin || origenesPermitidos.includes(origin)),
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(limitadorGeneral);
// Parseo JSON (las visitas incluyen imágenes en base64)
app.use(express.json({ limit: '8mb' }));
// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Ruta de health check para Render
// Responde 200 aunque la DB falle para que Render no reinicie el servicio; el estado real va en `db`
app.get('/health', (req, res) => {
    const db = getDbStatus();
    res.status(200).json({
        status: db.state === 'connected' ? 'ok' : 'degraded',
        message: 'Server is running',
        db,
    });
});

getConnection();

// middlewares
app.post('/api/auth/login', limitadorLogin, login);
app.use('/usuario', requireAuth, require('./rutas/usuario'));
app.use('/estadoEquipo', requireAuth, require('./rutas/estadoEquipo'));
app.use('/marca', requireAuth, require('./rutas/marca'));
app.use('/api/tipos', requireAuth, require('./rutas/tipoEquipo'));
app.use('/api/inventarios', requireAuth, require('./rutas/inventarios'));
app.use('/api/agendar-visita', require('./rutas/visitaTecnica')); // <-- Nueva ruta
app.use('/api/contacto', require('./rutas/contacto')); // <-- Nueva ruta

app.use((req, res) => res.status(404).json({ mensaje: 'Recurso no encontrado' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ mensaje: status >= 500 ? 'Error interno del servidor' : 'Solicitud inválida' });
});

app.listen(port, host, () => {
    console.log(`🚀 Servidor corriendo en ${host}:${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://${host}:${port}/health`);
});