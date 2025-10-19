import React, { useState } from 'react';
import axios from 'axios';

export const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        tipoEquipo: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí iría tu endpoint de backend para el formulario de contacto
            const response = await axios.post('http://localhost:4000/api/contacto', formData);
            alert('Mensaje de contacto enviado con éxito: ' + response.data.mensaje);
            // Limpiar el formulario o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al enviar mensaje de contacto:', error);
            alert('Hubo un error al enviar el mensaje de contacto.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Contacto para Soporte</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tipoEquipo" className="form-label">Tipo de Equipo/Servicio</label>
                    <select className="form-select" id="tipoEquipo" name="tipoEquipo" value={formData.tipoEquipo} onChange={handleChange} required>
                        <option value="">Selecciona</option>
                        <option value="Impresora">Impresora</option>
                        <option value="Tableta">Tableta Informática</option>
                        <option value="Portatil">Portátil</option>
                        <option value="Computador de Mesa">Computador de Mesa</option>
                        <option value="Rack Telecomunicaciones">Mantenimiento de Rack de Telecomunicaciones</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label">Mensaje</label>
                    <textarea className="form-control" id="mensaje" name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
            </form>
        </div>
    );
};
