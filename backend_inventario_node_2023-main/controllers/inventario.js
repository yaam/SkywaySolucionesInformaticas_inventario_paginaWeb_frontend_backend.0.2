const {Router} = require('express');
const Inventario = require('../modelos/Inventario');
const {validarInventario} = require('../helpers/validar-inventario');
const { esErrorDeDatos, detalleErrorDeDatos } = require('../helpers/errores');

// Acepta el objeto poblado ({ _id, ... }) o el ID directamente.
const idDe = (valor) => (valor && typeof valor === 'object' ? valor._id : valor);

/**
 * Listar todos
 */
    const getInventario =  async (req, res) =>{
    // req.param.id
    // req.body
    // console.log(req,params);
    try {
        const inventarios = await Inventario.find().populate([
        {
            path: 'usuario', select: 'nombre email estado'
        },
        {
            path: 'marca', select: 'nombre estado'
        },
        {
            path: 'tipoEquipo', select : 'nombre estado'
        },
        {
            path: 'estadoEquipo', select : 'nombre estado'
        }    
        ]);
        res.send(inventarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
};

/**
* Creación
 */

const createInventario = async (req, res) =>{
    //console.log(req,body);
    try{
        const validaciones = validarInventario(req);

        if(validaciones.length >0){
            return res.status(400).send(validaciones);
        }
        
        
            let inventario = await Inventario.findOne({serial: req.body.serial});
            if(inventario){
                return res.status(400).send('El serial ya existe');
            }
            // const fechaActual = new Date(); // Eliminada, ya que las fechas tienen default en el esquema

            inventario = new Inventario();
            inventario.serial = req.body.serial;
            inventario.modelo = req.body.modelo;
            inventario.descripcion = req.body.descripcion;
            inventario.foto = req.body.foto;
            inventario.color = req.body.color;
            inventario.precio = req.body.precio;
            inventario.usuario = idDe(req.body.usuario);
            inventario.tipoEquipo = idDe(req.body.tipoEquipo);
            inventario.estadoEquipo = idDe(req.body.estadoEquipo);
            inventario.marca = idDe(req.body.marca);
            inventario.fechaCompra = req.body.fechaCompra;
            // inventario.fechaCreacion =new Date(); // Manejado por el default del esquema
            // inventario.fechaActualizacion = new Date(); // Manejado por el default del esquema

            // Nuevos campos
            inventario.tipoInventario = req.body.tipoInventario;
            inventario.clienteAsociado = req.body.clienteAsociado;
            inventario.fechaMantenimientoProgramado = req.body.fechaMantenimientoProgramado;
            inventario.detallesMantenimiento = req.body.detallesMantenimiento;
            inventario.tecnologiaWeb = req.body.tecnologiaWeb;
            inventario.urlProyecto = req.body.urlProyecto;
            inventario.activo = req.body.activo !== undefined ? req.body.activo : true; // Campo activo/inactivo
            inventario.seguimiento = req.body.seguimiento || ''; // Campo seguimiento


            inventario = await inventario.save();
            res.status(201).send(inventario); 

    }catch(error){
        if (esErrorDeDatos(error)) {
            return res.status(400).send(detalleErrorDeDatos(error));
        }
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }

};



/**
 * Edición
 */
 
const updateInventario = async (req, res)=>{
    try{
        let inventario = await Inventario.findById(req.params.inventarioId);
        // si no existe inventario no actualizo
        if(!inventario){
                return res.status(404).send('No existe el inventario');
            }
            
            //Buscame por serial pero distinto al inventario que estoy actualizando
            // sanitizeFilter bloquea operadores como $ne; se compara el _id en código.
            const inventarioConSerial = await Inventario.findOne({serial: req.body.serial});
            if(inventarioConSerial && !inventarioConSerial._id.equals(inventario._id)){
                return res.status(400).send('El serial ya existe');
            }
            // const fechaActual = new Date(); // Eliminada

            
            inventario.serial = req.body.serial;
            inventario.modelo = req.body.modelo;
            inventario.descripcion = req.body.descripcion;
            inventario.foto = req.body.foto;
            inventario.color = req.body.color;
            inventario.precio = req.body.precio;
            inventario.usuario = idDe(req.body.usuario);
            inventario.tipoEquipo = idDe(req.body.tipoEquipo);
            inventario.estadoEquipo = idDe(req.body.estadoEquipo);
            inventario.marca = idDe(req.body.marca);
            inventario.fechaCompra = req.body.fechaCompra;
            //Datos transacionales
            inventario.fechaActualizacion = new Date();

            // Nuevos campos
            inventario.tipoInventario = req.body.tipoInventario;
            inventario.clienteAsociado = req.body.clienteAsociado;
            inventario.fechaMantenimientoProgramado = req.body.fechaMantenimientoProgramado;
            inventario.detallesMantenimiento = req.body.detallesMantenimiento;
            inventario.tecnologiaWeb = req.body.tecnologiaWeb;
            inventario.urlProyecto = req.body.urlProyecto;
            inventario.activo = req.body.activo !== undefined ? req.body.activo : inventario.activo; // Campo activo/inactivo
            inventario.seguimiento = req.body.seguimiento !== undefined ? req.body.seguimiento : inventario.seguimiento; // Campo seguimiento


            inventario = await inventario.save();
            res.send(inventario); 

    }catch(error){
        if (esErrorDeDatos(error)) {
            return res.status(400).send(detalleErrorDeDatos(error));
        }
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
};

const getInventarioId = async (req, res) => {
    try {
        const inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario){
            return res.status(404).send('inventario no definido ')
        }
        res.send(inventario);       
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
}

/**
 * Eliminación
 */
const deleteInventario = async (req, res) => {
    try {
        const inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario){
            return res.status(404).send('Inventario no encontrado');
        }
        
        await Inventario.findByIdAndDelete(req.params.inventarioId);
        res.send('Inventario eliminado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en el servidor');
    }
}

module.exports = {getInventario, createInventario, updateInventario, getInventarioId, deleteInventario}