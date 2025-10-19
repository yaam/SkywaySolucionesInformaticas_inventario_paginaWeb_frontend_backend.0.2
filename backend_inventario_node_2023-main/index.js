const express = require('express');
const {getConnection} = require('./db/db-connection-mongo');
require('dotenv').config();
const cors = require ('cors');
const app = express();
const por = process.env.PORT;

app.use(cors());
getConnection();


// Parseo JSON
app.use(express.json());
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