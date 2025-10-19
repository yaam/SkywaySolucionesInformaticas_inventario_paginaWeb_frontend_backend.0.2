const {Router} = require('express');  
const router = Router();
const {getUsuario, createUsuario, updateUsuario, getUsuarioId} = require('../controllers/usuario')

router.post('/', createUsuario)

router.get('/', getUsuario)

router.put('/:usuarioId', updateUsuario)

router.get('/:usuarioId', getUsuarioId)

module.exports = router;