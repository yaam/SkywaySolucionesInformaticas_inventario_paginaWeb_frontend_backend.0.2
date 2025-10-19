import React, { useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios configurado

export const AgendarVisita = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        contacto: '',
        tipoEquipo: '',
        problema: '',
        fecha: '',
        hora: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí iría tu endpoint de backend para agendar visitas
            const response = await axios.post('http://localhost:4000/api/agendar-visita', formData);
            alert('Visita agendada con éxito: ' + response.data.mensaje);
            // Limpiar el formulario o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al agendar visita:', error);
            alert('Hubo un error al agendar la visita.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agendar Visita Técnica</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="contacto" className="form-label">Contacto (Email o Teléfono)</label>
                    <input type="text" className="form-control" id="contacto" name="contacto" value={formData.contacto} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tipoEquipo" className="form-label">Tipo de Equipo</label>
                    <select className="form-select" id="tipoEquipo" name="tipoEquipo" value={formData.tipoEquipo} onChange={handleChange} required>
                        <option value="">Selecciona</option>
                        <option value="Computadora">Computadora</option>
                        <option value="Portatil">Portátil</option>
                        <option value="Tablet">Tableta Informática</option>
                        <option value="Impresora">Impresora</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="problema" className="form-label">Descripción del Problema/Mantenimiento</label>
                    <textarea className="form-control" id="problema" name="problema" rows="3" value={formData.problema} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha Preferida</label>
                    <input type="date" className="form-control" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="hora" className="form-label">Hora Preferida</label>
                    <input type="time" className="form-control" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Agendar Visita</button>
            </form>
        </div>
    );
};
