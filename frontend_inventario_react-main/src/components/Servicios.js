import React from 'react';
import { Link } from 'react-router-dom';

export const Servicios = () => {
    const servicios = [
        {
            titulo: 'Mantenimiento Preventivo',
            descripcion: 'Mantenimiento preventivo para computadoras, tabletas, portátiles e impresoras.',
            precio: '55.000 COP',
            imagen: '/mantenimiento preventivo.png',
            tipo: 'Mantenimiento Preventivo'
        },
        {
            titulo: 'Mantenimiento Correctivo',
            descripcion: 'Mantenimiento correctivo para impresoras, computadoras, portátiles y tabletas. (No incluye el costo de las piezas de repuesto).',
            precio: '85.000 COP',
            imagen: '/mantenimiento correctivo.png',
            tipo: 'Mantenimiento Correctivo'
        },
        {
            titulo: 'Mantenimiento de Rack de Telecomunicaciones',
            descripcion: 'Servicio completo de mantenimiento de rack de telecomunicaciones, incluye monitoreo por 5 meses y garantía.',
            precio: '655.000 COP',
            imagen: '/mantenimiento preventivo de rack telecomunicaciones.png',
            tipo: 'Mantenimiento de Rack de Telecomunicaciones'
        },
        {
            titulo: 'Desarrollo Web E-commerce',
            descripcion: 'Creación de plataformas de e-commerce y carritos de compras para empresas. (No incluye los costos de la plataforma, estos son asumidos por el cliente).',
            precio: '1\'550.000 COP',
            imagen: '/desarrollo web ecommerce.0.2.png',
            tipo: 'Desarrollo Web E-commerce'
        },
        {
            titulo: 'Desarrollo Web a Medida',
            descripcion: 'Desarrollo web robusto desde cero, sin plataformas de e-commerce. Incluye 5 meses de soporte y diseño exclusivo priorizando las necesidades del cliente.',
            precio: '3\'550.000 COP',
            imagen: '/desarollo web a tu medida.png',
            tipo: 'Desarrollo Web a Medida'
        },
    ];

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Nuestros Servicios y Precios</h2>
            <div className="row">
                {servicios.map((servicio, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100 shadow-sm">
                            <img 
                                src={servicio.imagen} 
                                className="card-img-top" 
                                alt={servicio.titulo}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-primary">{servicio.titulo}</h5>
                                <p className="card-text flex-grow-1">{servicio.descripcion}</p>
                                <h6 className="card-subtitle mb-3 text-success fw-bold">Precio: {servicio.precio}</h6>
                                <Link 
                                    to="/agendar-visita" 
                                    state={{ tipoServicio: servicio.tipo }}
                                    className="btn btn-primary w-100"
                                >
                                    Agendar Visita
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
