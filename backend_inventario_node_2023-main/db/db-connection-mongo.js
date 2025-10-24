const mongoose = require('mongoose');

const getConnection = async () =>{
    try {
        console.log('🔄 Inicializando conexión a MongoDB...');
        
        // Limpiar el URI de espacios y saltos de línea
        const mongoUri = process.env.MONGO_URI?.trim();
        
        if (!mongoUri) {
            throw new Error('MONGO_URI no está configurada en las variables de entorno');
        }
        
        console.log('✅ MONGO_URI encontrada');
        console.log('📊 Longitud del URI:', mongoUri.length, 'caracteres');
        console.log('🔗 Formato del URI:', mongoUri.substring(0, 14) + '...' + mongoUri.substring(mongoUri.length - 20));
        
        await mongoose.connect(mongoUri);
        
        console.log('✅ Conectado exitosamente a MongoDB');
        console.log('Base de datos:', mongoose.connection.name);
    } catch(error){
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
}