const {validationResult, check} = require('express-validator');
const Usuario = require('../modelos/Usuario');
const {validarUsuario} = require('../helpers/validar-usuario');

/**
 * Listar todos
 */

const getUsuario = async (req, res) =>{
    try{
        const usuarios = await Usuario.find();
        res.status(200).send(usuarios);

    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
};

/**
 * Creación
 */
const createUsuario =  ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('email', 'email.requerido').isEmail(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),    
],
async (req, res) =>{

try{
console.log('objeto recibido',req.body);
const validaciones = validarUsuario(req);

    if(validaciones.length >0){
        return res.status(400).send(validaciones);
    }


const existeUsuario = await Usuario.findOne({email: req.body.email});
console.log('Respuesta existe usuario', existeUsuario);    
if(existeUsuario){
    return res.send('Email ya existe')
}

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({messages: erros.array() });
}

let usuario = new Usuario();
usuario.nombre =req.body.nombre;
usuario.email = req.body.email;
usuario.estado = req.body.estado;
usuario.fechaCreacion = new Date();
usuario.fechaActualizacion = new Date();

usuario= await usuario.save();

res.status(201).send(usuario);
}catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
}

});
/**
 * Edición
 */
const updateUsuario = ([
    check('nombre', 'nombre.requerido').not().isEmpty(),
    check('email', 'email.requerido').isEmail(),
    check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),
],
async (req, res) =>{    
try{
    console.log('Objeto recibido', req.body, req.params);

    let usuario = await Usuario.findById(req.params.usuarioId);

    if (!usuario){
        return res.send('Usuario no existe');
    }

    const existeUsuario = await Usuario
        .findOne({email: req.body.email, _id: {$ne: usuario._id }});
    
    console.log('Respuesta existe usuario', existeUsuario);
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({messages: error.array() });
    }
    if(existeUsuario){

        return res.send('Email ya existe');
    }

    usuario.email = req.body.email;
    usuario.nombre = req.body.nombre;
    usuario.estado = req.body.estado;
    usuario.fechaActualizacion = new Date();
    

    usuario = await usuario.save();
    res.send(usuario);

    }catch(error){
            console.log(error);
            res.status(500).send('Ocurrio un error');
    
}
});
const getUsuarioId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.usuarioId);
        if(!inventario){
            return res.status(404).send('usario no definido ')
        }
        res.send(usuario);       
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
}


module.exports = {getUsuario, createUsuario, updateUsuario, getUsuarioId}