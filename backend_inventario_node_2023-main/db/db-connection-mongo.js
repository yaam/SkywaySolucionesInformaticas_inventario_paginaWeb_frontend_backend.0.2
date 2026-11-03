const mongoose = require('mongoose');

const ESTADOS_DB = ['disconnected', 'connected', 'connecting', 'disconnecting'];
const INTERVALO_LOG_ESTADO_MS = 60000;
let ultimoErrorDb = null;

const getDbStatus = () => ({
    readyState: mongoose.connection.readyState,
    state: ESTADOS_DB[mongoose.connection.readyState] || 'unknown',
    name: mongoose.connection.name || null,
    lastError: ultimoErrorDb,
});

mongoose.connection.on('connected', () => {
    ultimoErrorDb = null;
    console.log('✅ MongoDB: conectado');
});
mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB: desconectado'));
mongoose.connection.on('error', (error) => {
    ultimoErrorDb = error.message;
    console.error('❌ MongoDB: error de conexión:', error.message);
});

setInterval(() => {
    const { state, lastError } = getDbStatus();
    if (state !== 'connected') {
        console.warn(`⚠️ Estado MongoDB: ${state}${lastError ? ` (último error: ${lastError})` : ''}`);
    }
}, INTERVALO_LOG_ESTADO_MS).unref();

const getConnection = async () =>{
    try {
        console.log('🔄 Inicializando conexión a MongoDB...');
        
        // Obtener el URI y limpiar
        let mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error('MONGO_URI no está configurada en las variables de entorno');
        }
        
        // Limpiar espacios, saltos de línea, tabulaciones
        mongoUri = mongoUri.trim().replace(/\s+/g, '');
        
        // Limpiar prefijos comunes que pueden aparecer por error en Render
        mongoUri = mongoUri.replace(/^MONGO_URI[=:\s]*/i, '');
        mongoUri = mongoUri.replace(/^Key:\s*MONGO_URI\s*Value:\s*/i, '');
        mongoUri = mongoUri.replace(/^Key:\s*MONGO_URI\s*/i, '');
        mongoUri = mongoUri.replace(/^Value:\s*/i, '');
        
        // Verificar que comience correctamente
        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
            console.error('❌ URI inválido. Recibido:', mongoUri.substring(0, 50) + '...');
            throw new Error('MONGO_URI debe comenzar con "mongodb://" o "mongodb+srv://"');
        }
        
        console.log('✅ MONGO_URI limpio y válido');
        console.log('📊 Longitud:', mongoUri.length, 'caracteres');
        console.log('🔗 Comienza con:', mongoUri.substring(0, 20) + '...');
        
        await mongoose.connect(mongoUri);
        
        console.log('✅ Conectado exitosamente a MongoDB');
        console.log('Base de datos:', mongoose.connection.name);
    } catch(error){
        ultimoErrorDb = error.message;
        console.error('❌ Error al conectar a la base de datos:');
        console.error('Tipo de error:', error.name);
        console.error('Mensaje:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.error('🔍 Problema de DNS: No se puede resolver el hostname del cluster');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔍 Conexión rechazada: Verifica la URL y las credenciales');
        } else if (error.name === 'MongoServerError') {
            console.error('🔍 Error del servidor MongoDB:', error.message);
        }
        
        console.log('⚠️ MongoDB no disponible, pero el servidor continuará funcionando');
        console.log('⚠️ Las operaciones de base de datos fallarán hasta que MongoDB esté disponible');
        
        // No terminar la aplicación, solo mostrar el error
        // process.exit(1); // Comentado para permitir que el servidor continúe
    }
}

module.exports = {
    getConnection,
    getDbStatus,
}