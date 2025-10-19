const {Router} = require('express');
const router = Router();
const { updateInventario, createInventario, getInventario, getInventarioId } = require('../controllers/inventario');
//http://localhost:4000/inventario
//GET http://localhost:4000/inventario
//POST //http://localhost:4000/inventario
//PUT //http://localhost:4000/inventario

router.get('/', getInventario)

router.post('/', createInventario)

router.put('/:inventarioId', updateInventario)

router.get('/:inventarioId', getInventarioId)

module.exports = router;