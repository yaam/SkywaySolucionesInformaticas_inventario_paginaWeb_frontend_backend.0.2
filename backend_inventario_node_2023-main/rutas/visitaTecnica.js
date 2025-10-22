const { Router } = require('express');
const { crearVisitaTecnica, listarVisitasTecnicas, completarVisitaTecnica, verificarToken, transferirAInventario } = require('../controllers/visitaTecnica');

const router = Router();

router.post('/', crearVisitaTecnica);
router.get('/', listarVisitasTecnicas);
router.put('/completar/:visitaId', completarVisitaTecnica);
router.post('/verificar-token/:visitaId', verificarToken);
router.post('/transferir/:visitaId', transferirAInventario);

module.exports = router;
