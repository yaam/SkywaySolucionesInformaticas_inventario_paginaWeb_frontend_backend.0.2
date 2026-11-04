import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../helpers/axios-config';

export const AgendarVisita = () => {
    const location = useLocation();
    const tipoServicioInicial = (location.state && location.state.tipoServicio) ? location.state.tipoServicio : '';

    const [formData, setFormData] = useState({
        nombre: '',
        contacto: '',
        tipoServicio: tipoServicioInicial,
        tipoEquipo: '',
        problema: '',
        direccion: '',
        fecha: '',
        hora: ''
    });

    const [imagenEquipo, setImagenEquipo] = useState(null);
    const [imagenBoceto, setImagenBoceto] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState('');

    useEffect(() => {
        if (tipoServicioInicial) {
            setFormData(prev => ({ ...prev, tipoServicio: tipoServicioInicial }));
        }
    }, [tipoServicioInicial]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImagenEquipoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB
                alert('La imagen es muy grande. Máximo 5MB');
                return;
            }
            setImagenEquipo(file);
        }
    };

    const handleImagenBocetoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10000000) { // 10MB para PDFs
                alert('El archivo es muy grande. Máximo 10MB');
                return;
            }
            setImagenBoceto(file);
        }
    };

    const convertirImagenABase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convertir imágenes a base64
            const dataToSend = { ...formData };
            
            if (imagenEquipo) {
                dataToSend.imagenEquipo = await convertirImagenABase64(imagenEquipo);
            }
            
            if (imagenBoceto) {
                dataToSend.imagenBoceto = await convertirImagenABase64(imagenBoceto);
            }

            const response = await axiosInstance.post('/api/agendar-visita', dataToSend);
            
            setShowSuccess(true);
            setWhatsappMessage(response.data.whatsappMessage);
            
            // Abrir WhatsApp con el mensaje
            const numeroWhatsApp = '573103040001';
            const mensajeWhatsApp = encodeURIComponent(response.data.whatsappMessage);
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
            
            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
            }, 1000);

            // Limpiar el formulario
            setFormData({
                nombre: '',
                contacto: '',
                tipoServicio: '',
                tipoEquipo: '',
                problema: '',
                direccion: '',
                fecha: '',
                hora: ''
            });
            setImagenEquipo(null);
            setImagenBoceto(null);

            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Error al agendar visita:', error);
            alert('Hubo un error al agendar la visita. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Agendar Visita Técnica</h2>
            
            {showSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <h5 className="alert-heading">✅ ¡Visita agendada con éxito!</h5>
                    <p>Se abrirá WhatsApp para confirmar tu visita técnica.</p>
                    <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                                <input type="text" name="sitioWeb" tabIndex="-1" autoComplete="off" aria-hidden="true"
                                    onChange={handleChange} style={{ position: 'absolute', left: '-10000px' }} />
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label fw-bold">Nombre Completo</label>
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
                    <label htmlFor="contacto" className="form-label fw-bold">Contacto (Email o Teléfono)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="contacto" 
                        name="contacto" 
                        value={formData.contacto} 
                        onChange={handleChange} 
                        required 
                        placeholder="ejemplo@correo.com o 3001234567"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="tipoServicio" className="form-label fw-bold">Tipo de Servicio</label>
                    <select 
                        className="form-select" 
                        id="tipoServicio" 
                        name="tipoServicio" 
                        value={formData.tipoServicio} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Selecciona un servicio</option>
                        <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                        <option value="Mantenimiento Correctivo">Mantenimiento Correctivo</option>
                        <option value="Mantenimiento de Rack de Telecomunicaciones">Mantenimiento de Rack de Telecomunicaciones</option>
                        <option value="Desarrollo Web E-commerce">Desarrollo Web E-commerce</option>
                        <option value="Desarrollo Web a Medida">Desarrollo Web a Medida</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="tipoEquipo" className="form-label fw-bold">Tipo de Equipo *</label>
                    <select 
                        className="form-select" 
                        id="tipoEquipo" 
                        name="tipoEquipo" 
                        value={formData.tipoEquipo} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona el tipo de equipo</option>
                        <option value="Computadora">Computadora</option>
                        <option value="Portatil">Portátil</option>
                        <option value="Tablet">Tableta Informática</option>
                        <option value="Impresora">Impresora</option>
                        <option value="Servidor">Servidor</option>
                        <option value="Rack de Telecomunicaciones">Rack de Telecomunicaciones</option>
                        <option value="Switch de Red">Switch de Red</option>
                        <option value="Router">Router</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                {/* Campo de imagen del equipo */}
                <div className="mb-3">
                    <label htmlFor="imagenEquipo" className="form-label fw-bold">
                        📷 Foto del Estado del Equipo (Opcional)
                    </label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="imagenEquipo" 
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImagenEquipoChange}
                    />
                    <div className="form-text">
                        <strong>Para mantenimientos:</strong> Sube una foto clara del equipo que muestre su estado actual. 
                        Formato: PNG o JPG. Máximo 5MB.
                    </div>
                    {imagenEquipo && (
                        <div className="mt-2">
                            <small className="text-success">
                                ✅ Imagen seleccionada: {imagenEquipo.name}
                            </small>
                        </div>
                    )}
                </div>

                {/* Campo de boceto del diseño web */}
                <div className="mb-3">
                    <label htmlFor="imagenBoceto" className="form-label fw-bold">
                        📋 Boceto del Diseño Web (Opcional)
                    </label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="imagenBoceto" 
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        onChange={handleImagenBocetoChange}
                    />
                    <div className="form-text">
                        <strong>Para desarrollo web:</strong> Sube un boceto que incluya la estructura y diseño que deseas para tu página web. 
                        Puede ser un dibujo, mockup o diseño en PDF o imagen (PNG/JPG). Máximo 10MB.
                    </div>
                    {imagenBoceto && (
                        <div className="mt-2">
                            <small className="text-success">
                                ✅ Boceto seleccionado: {imagenBoceto.name}
                            </small>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label fw-bold">Dirección de la Visita Técnica</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="direccion" 
                        name="direccion" 
                        value={formData.direccion} 
                        onChange={handleChange} 
                        required 
                        placeholder="Calle, número, ciudad"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="problema" className="form-label fw-bold">Descripción del Problema/Servicio</label>
                    <textarea 
                        className="form-control" 
                        id="problema" 
                        name="problema" 
                        rows="4" 
                        value={formData.problema} 
                        onChange={handleChange} 
                        required
                        placeholder="Describe detalladamente el servicio que necesitas o el problema que presenta tu equipo"
                    ></textarea>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="fecha" className="form-label fw-bold">Fecha Preferida</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            id="fecha" 
                            name="fecha" 
                            value={formData.fecha} 
                            onChange={handleChange} 
                            required 
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="hora" className="form-label fw-bold">Hora Preferida</label>
                        <input 
                            type="time" 
                            className="form-control" 
                            id="hora" 
                            name="hora" 
                            value={formData.hora} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg">
                        📅 Agendar Visita Técnica
                    </button>
                </div>

                <p className="text-muted text-center mt-3 small">
                    Al agendar, se abrirá WhatsApp para confirmar tu cita con nuestro equipo técnico.
                </p>
            </form>
        </div>
    );
};
