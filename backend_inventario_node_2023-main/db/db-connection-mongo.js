const mongoose = require('mongoose');

const getConnection = async () =>{
    try {
        console.log('Inicializando llamado a bd');
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Estoy conectado');
    } catch(error){
        console.log('Fallo la conexión a la base de datos');
    }
}

module.exports = {
    getConnection,
}