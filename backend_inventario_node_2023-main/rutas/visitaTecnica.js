const { Router } = require('express');
const { crearVisitaTecnica, listarVisitasTecnicas } = require('../controllers/visitaTecnica');

const router = Router();

router.post('/', crearVisitaTecnica);
router.get('/', listarVisitasTecnicas); // Opcional: para que puedas ver las visitas agendadas desde un panel de administración

module.exports = router;
