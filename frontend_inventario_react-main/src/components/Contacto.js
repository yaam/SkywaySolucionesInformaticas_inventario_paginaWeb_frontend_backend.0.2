import React, { useState } from 'react';
import { axiosInstance } from '../helpers/axios-config';

export const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        lineaLlamada: '',
        whatsapp: '',
        mensaje: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/contacto', formData);
            
            setShowSuccess(true);
            setShowError(false);
            
            // Limpiar el formulario
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                lineaLlamada: '',
                whatsapp: '',
                mensaje: ''
            });

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Error al enviar mensaje de contacto:', error);
            setShowError(true);
            setShowSuccess(false);
            
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Contáctanos</h2>
            
            <div className="row">
                <div className="col-md-8 mx-auto">
                    {showSuccess && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <h5 className="alert-heading">✅ ¡Mensaje enviado con éxito!</h5>
                            <p>Hemos recibido tu mensaje. El equipo de Skyway Soluciones Informáticas se pondrá en contacto contigo pronto.</p>
                            <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
                        </div>
                    )}

                    {showError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <h5 className="alert-heading">❌ Error al enviar mensaje</h5>
                            <p>Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.</p>
                            <button type="button" className="btn-close" onClick={() => setShowError(false)}></button>
                        </div>
                    )}

                    <div className="card shadow">
                        <div className="card-body p-4">
                            <p className="text-muted mb-4">
                                Completa el formulario y nos pondremos en contacto contigo a la brevedad. 
                                Se enviará una notificación a nuestro equipo con tus datos de contacto.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <input type="text" name="sitioWeb" tabIndex="-1" autoComplete="off" aria-hidden="true"
                                    onChange={handleChange} style={{ position: 'absolute', left: '-10000px' }} />
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold">
                                        <i className="bi bi-person"></i> Nombre Completo
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="nombre" 
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Ingresa tu nombre completo"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        <i className="bi bi-envelope"></i> Correo Electrónico
                                    </label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="ejemplo@correo.com"
                                    />
                                    <div className="form-text">
                                        Este correo debe estar conectado con tu usuario registrado en el sistema.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label fw-bold">
                                        <i className="bi bi-telephone"></i> Teléfono
                                    </label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="telefono" 
                                        name="telefono" 
                                        value={formData.telefono} 
                                        onChange={handleChange} 
                                        placeholder="3001234567"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lineaLlamada" className="form-label fw-bold">
                                        <i className="bi bi-phone"></i> Línea Preferida para Llamadas
                                    </label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="lineaLlamada" 
                                        name="lineaLlamada" 
                                        value={formData.lineaLlamada} 
                                        onChange={handleChange} 
                                        placeholder="Número donde prefieres recibir llamadas"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="whatsapp" className="form-label fw-bold">
                                        <i className="bi bi-whatsapp"></i> Número de WhatsApp
                                    </label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="whatsapp" 
                                        name="whatsapp" 
                                        value={formData.whatsapp} 
                                        onChange={handleChange} 
                                        placeholder="3001234567"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="mensaje" className="form-label fw-bold">
                                        <i className="bi bi-chat-text"></i> Mensaje
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="mensaje" 
                                        name="mensaje" 
                                        rows="5" 
                                        value={formData.mensaje} 
                                        onChange={handleChange} 
                                        required
                                        placeholder="Escribe tu mensaje o consulta aquí..."
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        📧 Enviar Mensaje
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-4 bg-light">
                        <div className="card-body">
                            <h5 className="card-title">📞 Información de Contacto</h5>
                            <p className="card-text">
                                <strong>Email:</strong> yaam17@outlook.com<br/>
                                <strong>Atención:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
