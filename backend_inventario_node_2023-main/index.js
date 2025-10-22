const express = require('express');
const {getConnection} = require('./db/db-connection-mongo');
require('dotenv').config();
const cors = require ('cors');
const app = express();
const por = process.env.PORT || 4001;

// Verificar que las variables de entorno estén configuradas
if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI no está configurada en el archivo .env');
    process.exit(1);
}

app.use(cors());
// Parseo JSON
app.use(express.json());
// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));
getConnection();

// middlewares
app.use('/usuario', require('./rutas/usuario'));
app.use('/estadoEquipo', require('./rutas/estadoEquipo'));
app.use('/marca', require('./rutas/marca'));
app.use('/api/tipos', require('./rutas/tipoEquipo'));
app.use('/api/inventarios', require('./rutas/inventarios'));
app.use('/api/agendar-visita', require('./rutas/visitaTecnica')); // <-- Nueva ruta
app.use('/api/contacto', require('./rutas/contacto')); // <-- Nueva ruta

app.listen(por ,()=>{
    console.log(`Servidor Corriendo en el puerto ${por}`);
});