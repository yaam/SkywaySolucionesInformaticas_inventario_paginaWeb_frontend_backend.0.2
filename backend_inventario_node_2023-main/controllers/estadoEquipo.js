const {Router} = require('express');
const {validationResult, check} = require('express-validator');
const EstadoEquipo = require('../modelos/EstadoEquipo');
const {validarEstadoEquipo} = require('../helpers/validar-estadoEquipo');

/**
 * Listar todos
 */


const getEstadoEquipo = async (req, res)=>{
    try{
        const tipos = await EstadoEquipo.find();
        res.send(tipos);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
};
/**
 * Creación
 */
const createEstadoEquipo = ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
    ],
    async (req,res)=>{ 
    try{ 

        const validaciones = validarEstadoEquipo(req);

        if(validaciones.length >0){
            return res.status(400).send(validaciones);
        }
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({messages: erros.array() });
        }

        

        console.log('Objeto Recibido',req.body);
        let estadoEquipo = new EstadoEquipo ();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await  estadoEquipo.save();

        res.status(201).send(estadoEquipo);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
        }
});

/**
 * Edición
 */

const updateEstadoEquipo = ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']), 
    ],
    async (req, res) =>{
    try{ 
        console.log('Objeto Recibido',req.body);
        
        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        
        if(!estadoEquipo){
            return res.send('No existe estado');
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({messages: erros.array() });
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await  estadoEquipo.save();

        res.send(estadoEquipo);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
        }
});
const getEstadoEquipoId = async (req, res) => {
    try {
        const estadoEquipo = await estadoEquipo.findById(req.params.estadoId);
        if(!inventario){
            return res.status(404).send('estado no definido ')
        }
        res.send(usuario);       
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
}

module.exports = {getEstadoEquipo, createEstadoEquipo, updateEstadoEquipo, getEstadoEquipoId}