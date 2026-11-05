import React from 'react';
import { Link } from 'react-router-dom';

export const InventarioCard = (props) => {
    const { inventario } = props;
    return (
        <div className="col-md-4 mb-3">
            <div className="card">
                <img src={inventario.foto} className="card-img-top" alt={inventario.nombre} />
                <div className="card-body">
                    <h5 className="card-title">Activo: {inventario.serial}</h5>
                    <p className="card-text">Marca: {inventario.marca.nombre}</p>
                    <p className="card-text">Usuario: {inventario.usuario.nombre}</p>
                    <p className="card-text">Estado: {inventario.estadoEquipo.nombre}</p>
                    <p className="card-text">Tipo: {inventario.tipoEquipo.nombre}</p>
                    <p className="card-text">Modelo: {inventario.modelo}</p>
                    <p className="card-text">Color: {inventario.color}</p>
                    <p className="card-text">Fecha Compra: {new Date(inventario.fechaCompra).toLocaleDateString()}</p>
                    <p className="card-text">Precio: {inventario.precio}</p>

                    {inventario.tipoInventario && <p className="card-text">Tipo de Inventario: {inventario.tipoInventario}</p>}
                    {inventario.clienteAsociado && <p className="card-text">Cliente Asociado: {inventario.clienteAsociado}</p>}
                    {inventario.fechaMantenimientoProgramado && <p className="card-text">Mantenimiento Programado: {new Date(inventario.fechaMantenimientoProgramado).toLocaleDateString()}</p>}
                    {inventario.detallesMantenimiento && <p className="card-text">Detalles Mantenimiento: {inventario.detallesMantenimiento}</p>}
                    {inventario.tecnologiaWeb && <p className="card-text">Tecnología Web: {inventario.tecnologiaWeb}</p>}
                    {inventario.urlProyecto && <p className="card-text">URL Proyecto: <a href={inventario.urlProyecto} target="_blank" rel="noopener noreferrer">{inventario.urlProyecto}</a></p>}

                    <hr/>
                    <Link to={`inventarios/edit/${inventario._id}`} className="btn btn-warning">Editar</Link>
                </div>
            </div>
        </div>
    )
}
