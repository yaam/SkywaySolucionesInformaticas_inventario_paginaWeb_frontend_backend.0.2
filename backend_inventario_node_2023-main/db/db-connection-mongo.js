const mongoose = require('mongodb+srv://yeisonandresangulomoreno1_db_user:<SbOE4PVV9GVs3B4e>@cluster0.2brq7mt.mongodb.net/');

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