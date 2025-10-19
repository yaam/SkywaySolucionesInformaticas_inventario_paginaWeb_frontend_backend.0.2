import React from 'react';

export const Servicios = () => {
    const servicios = [
        {
            titulo: 'Mantenimiento Preventivo',
            descripcion: 'Mantenimiento preventivo para computadoras, tabletas, portátiles e impresoras.',
            precio: '55.000 COP'
        },
        {
            titulo: 'Mantenimiento Correctivo',
            descripcion: 'Mantenimiento correctivo para impresoras, computadoras, portátiles y tabletas. (No incluye el costo de las piezas de repuesto).',
            precio: '85.000 COP'
        },
        {
            titulo: 'Mantenimiento de Rack de Telecomunicaciones',
            descripcion: 'Servicio completo de mantenimiento de rack de telecomunicaciones, incluye monitoreo por 5 meses y garantía.',
            precio: '655.000 COP'
        },
        {
            titulo: 'Desarrollo Web E-commerce',
            descripcion: 'Creación de plataformas de e-commerce y carritos de compras para empresas. (No incluye los costos de la plataforma, estos son asumidos por el cliente).',
            precio: '1\'550.000 COP'
        },
        {
            titulo: 'Desarrollo Web a Medida',
            descripcion: 'Desarrollo web robusto desde cero, sin plataformas de e-commerce. Incluye 5 meses de soporte y diseño exclusivo priorizando las necesidades del cliente.',
            precio: '3\'550.000 COP'
        },
    ];

    return (
        <div className="container mt-4">
            <h2>Nuestros Servicios y Precios</h2>
            <div className="row">
                {servicios.map((servicio, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{servicio.titulo}</h5>
                                <p className="card-text">{servicio.descripcion}</p>
                                <h6 className="card-subtitle mb-2 text-muted">Precio: {servicio.precio}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
