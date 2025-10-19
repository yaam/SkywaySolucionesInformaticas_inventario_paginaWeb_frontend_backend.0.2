const {validationResult, check} = require('express-validator');
const TipoEquipo = require('../modelos/TipoEquipo');
const {validarTipoEquipo} = require('../helpers/validar-tipoEquipo');


/**
 * Listar todos
 */
const getTipoEquipo = async (req, res)=>{
    try{
        const tipos = await TipoEquipo.find();
        res.send(tipos);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
};

/**
 * Creación
 */

const createTipoEquipo = ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
],
async (req, res)=>{
    try{ 

        const validaciones = validarTipoEquipo(req);

        if(validaciones.length >0){
            return res.status(400).send(validaciones);
        }
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({messages: erros.array() });
        }
        console.log('Objeto Recibido',req.body);
        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await  tipoEquipo.save();

        res.status(201).send(tipoEquipo);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
        }
});


/**
 * Edición
 */

const updateTipoEquipo = ([
check('nombre', 'nombre.requerido').not().isEmpty(),
check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
],
async (req, res) =>{
try{ 
    let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);

    if(!tipoEquipo){
        return res.send('No existe tipo de equipo');
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    return res.status(400).json({messages: erros.array() });
    }
    console.log('Objeto Recibido',req.body);
    tipoEquipo.nombre = req.body.nombre;
    tipoEquipo.estado = req.body.estado;
    tipoEquipo.fechaActualizacion = new Date();

    tipoEquipo = await  tipoEquipo.save();

    res.send(tipoEquipo);
}catch(error){
    console.log(error);
    res.status(500).send('Ocurrio un error');
    }
});

module.exports = {getTipoEquipo, createTipoEquipo, updateTipoEquipo}