const {Router} = require ('express');
const router = Router();
const { updateEstadoEquipo, createEstadoEquipo, getEstadoEquipo, getEstadoEquipoId } = require('../controllers/estadoEquipo');


router.get('/', getEstadoEquipo)

router.post('/',createEstadoEquipo)

router.put('/:estadoEquipoId', updateEstadoEquipo)

router.get('/:estadoEquipoId', getEstadoEquipoId)

module.exports = router;