const {validationResult, check} = require('express-validator');
const Marca = require('../modelos/Marca');
const {validarMarca} = require('../helpers/validar-marca');
const { route } = require('../rutas/usuario');

/**
 * Listar todos
 */
const getMarca = async (req, res) =>{
    try{
        const marcas = await Marca.find();
        res.status(200).send(marcas);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
};
/**
 * Creación
 */
const createMarca = ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
],
async  (req, res) =>{
    try{ 
        console.log('Objeto Recibido',req.body);
        
        const validaciones = validarMarca(req);

        if(validaciones.length >0){
            return res.status(400).send(validaciones);
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({messages: erros.array() });
        }

        
        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await  marca.save();

        res.status(201).send(marca);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
        }

});


/**
 * Edición
 */

const updateMarca =  
([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
],
async (req, res) =>{
    try{ 
        console.log('Objeto Recibido',req.body);
        let marca = await Marca.findById(req.params.marcaId);

        if(!marca){
            return res.send('Marca no existe');
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({messages: erros.array() });
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await  marca.save();

        res.send(marca);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
        }
});

module.exports = {updateMarca, createMarca, getMarca };