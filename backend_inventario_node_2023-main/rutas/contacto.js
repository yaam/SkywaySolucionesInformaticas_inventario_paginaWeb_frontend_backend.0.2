const { Router } = require('express');
const { crearMensajeContacto } = require('../controllers/contacto');

const router = Router();

router.post('/', crearMensajeContacto);

module.exports = router;
