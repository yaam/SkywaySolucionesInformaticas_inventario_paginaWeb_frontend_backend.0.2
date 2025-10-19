const { Router} = require ('express');
const router = Router();
const { updateTipoEquipo, createTipoEquipo, getTipoEquipo } = require('../controllers/tipoEquipo');
router.get('/', getTipoEquipo)


router.post('/', createTipoEquipo)


router.put('/:tipoEquipoId', updateTipoEquipo)

module.exports = router;