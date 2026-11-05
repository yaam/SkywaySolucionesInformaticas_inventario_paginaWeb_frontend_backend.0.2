const { Router } = require('express');
const { crearMensajeContacto } = require('../controllers/contacto');
const { limitadorFormularios, rechazarBots, validarCamposPublicos } = require('../middlewares/seguridad');

const router = Router();

router.post('/',
    limitadorFormularios,
    rechazarBots,
    validarCamposPublicos(
        ['nombre', 'email', 'telefono', 'lineaLlamada', 'whatsapp', 'mensaje'],
        [],
        ['nombre', 'email', 'mensaje']
    ),
    crearMensajeContacto);

module.exports = router;
