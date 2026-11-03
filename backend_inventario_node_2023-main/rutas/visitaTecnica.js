const { Router } = require('express');
const { crearVisitaTecnica, listarVisitasTecnicas, completarVisitaTecnica, verificarToken, transferirAInventario } = require('../controllers/visitaTecnica');
const { requireAuth, limitadorFormularios, limitadorToken, rechazarBots, validarCamposPublicos } = require('../middlewares/seguridad');

const router = Router();

router.post('/',
    limitadorFormularios,
    rechazarBots,
    validarCamposPublicos(
        ['nombre', 'contacto', 'tipoServicio', 'tipoEquipo', 'problema', 'direccion', 'fecha', 'hora'],
        ['imagenEquipo', 'imagenBoceto']
    ),
    crearVisitaTecnica);
router.get('/', requireAuth, listarVisitasTecnicas);
router.put('/completar/:visitaId', requireAuth, completarVisitaTecnica);
router.post('/verificar-token/:visitaId', requireAuth, limitadorToken, verificarToken);
router.post('/transferir/:visitaId', requireAuth, transferirAInventario);

module.exports = router;
