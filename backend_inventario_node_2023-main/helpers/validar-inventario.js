const validarInventario = (req) =>{
    const validaciones = [];

    if(!req.body.serial){
        validaciones.push('serial es requerido');
    }

    if(!req.body.modelo){
        validaciones.push('modelo es requerido');
    }
    if(!req.body.descripcion){
        validaciones.push('Descripcion es requerido');
    }
    if(!req.body.foto){
        validaciones.push('foto es requerido');
    }
    if(!req.body.fechaCompra){
        validaciones.push('fecha compra es requerido');
    }
    if(!req.body.precio){
        validaciones.push('precio es requerido');
    }
    if(!req.body.usuario){
        validaciones.push('usuario es requerido');
    }
    if(!req.body.marca){
        validaciones.push('marca es requerido');
    }
    if(!req.body.tipoEquipo){
        validaciones.push('Tipo Equipo es requerido');
    }
    if(!req.body.estadoEquipo){
        validaciones.push('Estado Equipo es requerido');
    }
    
    if(!req.body.tipoInventario){
        validaciones.push('Tipo de Inventario es requerido');
    }
    // Validaciones condicionales para los nuevos campos
    if(req.body.tipoInventario === 'Equipo Cliente'){
        if(!req.body.clienteAsociado){
            validaciones.push('Cliente Asociado es requerido para Equipo Cliente');
        }
    }
    if(req.body.tipoInventario === 'Rack Telecomunicaciones'){
        if(!req.body.clienteAsociado){
            validaciones.push('Cliente de Rack es requerido para Rack Telecomunicaciones');
        }
    }
    if(req.body.tipoInventario === 'Proyecto Web'){
        if(!req.body.clienteAsociado){
            validaciones.push('Cliente del Proyecto es requerido para Proyecto Web');
        }
        if(!req.body.tecnologiaWeb){
            validaciones.push('Tecnología Web es requerida para Proyecto Web');
        }
    }

    return validaciones;
}
module.exports = {
    validarInventario,
}