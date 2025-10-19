const {Router} = require ('express');
const { getMarca, createMarca, updateMarca } = require('../controllers/marca');
const router = Router();


router.post('/', createMarca)


router.get('/', getMarca)

router.put('/:marcaId', updateMarca)

module.exports = router;