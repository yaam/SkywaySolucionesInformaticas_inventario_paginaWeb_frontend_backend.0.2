const mongoose = require('mongoose');

const getConnection = async () =>{
    try {
        console.log('Inicializando llamado a bd');
        console.log('MONGO_URI:', process.env.MONGO_URI ? 'Configurada' : 'NO CONFIGURADA');
        
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está configurada en las variables de entorno');
        }
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
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