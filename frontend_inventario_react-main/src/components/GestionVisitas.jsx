import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../helpers/axios-config';
import swal from 'sweetalert2';

export const GestionVisitas = () => {
    const [visitas, setVisitas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [visitaSeleccionada, setVisitaSeleccionada] = useState(null);
    const [mostrarModalCompletar, setMostrarModalCompletar] = useState(false);
    const [mostrarModalTransferir, setMostrarModalTransferir] = useState(false);
    const [imagenFinal, setImagenFinal] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [datosAsociacion, setDatosAsociacion] = useState({
        usuario: '',
        marca: '',
        estadoEquipo: ''
    });
    const [tokenIngresado, setTokenIngresado] = useState('');
    const [datosTransferencia, setDatosTransferencia] = useState({
        serial: '',
        modelo: '',
        descripcion: '',
        color: '',
        precio: '',
        fechaCompra: '',
        tipoInventario: 'Equipo Cliente'
    });

    useEffect(() => {
        cargarVisitas();
        cargarDatos();
    }, []);

    const cargarVisitas = async () => {
        try {
            const { data } = await axiosInstance.get('/api/agendar-visita');
            setVisitas(data);
        } catch (error) {
            console.error('Error al cargar visitas:', error);
        }
    };

    const cargarDatos = async () => {
        try {
            const [usuariosRes, marcasRes, estadosRes] = await Promise.all([
                axiosInstance.get('/usuario'),
                axiosInstance.get('/marca'),
                axiosInstance.get('/estadoEquipo')
            ]);
            setUsuarios(usuariosRes.data);
            setMarcas(marcasRes.data);
            setEstados(estadosRes.data);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    const handleImagenFinalChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5000000) {
            setImagenFinal(file);
        } else {
            alert('La imagen es muy grande. Máximo 5MB');
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

    const abrirModalCompletar = (visita) => {
        setVisitaSeleccionada(visita);
        setMostrarModalCompletar(true);
        setImagenFinal(null);
        setObservaciones('');
        setDatosAsociacion({
            usuario: (visita.usuario && visita.usuario._id) ? visita.usuario._id : '',
            marca: (visita.marca && visita.marca._id) ? visita.marca._id : '',
            estadoEquipo: (visita.estadoEquipo && visita.estadoEquipo._id) ? visita.estadoEquipo._id : ''
        });
    };

    const cerrarModalCompletar = () => {
        setMostrarModalCompletar(false);
        setVisitaSeleccionada(null);
        setImagenFinal(null);
        setObservaciones('');
        setDatosAsociacion({ usuario: '', marca: '', estadoEquipo: '' });
    };

    const abrirModalTransferir = (visita) => {
        setVisitaSeleccionada(visita);
        setMostrarModalTransferir(true);
        setTokenIngresado('');
        setDatosTransferencia({
            serial: '',
            modelo: '',
            descripcion: visita.problema || '',
            color: '',
            precio: '',
            fechaCompra: new Date().toISOString().split('T')[0],
            tipoInventario: (visita.tipoServicio && visita.tipoServicio.includes('Desarrollo Web')) ? 'Proyecto Web' : 'Equipo Cliente'
        });
    };

    const cerrarModalTransferir = () => {
        setMostrarModalTransferir(false);
        setVisitaSeleccionada(null);
        setTokenIngresado('');
        setDatosTransferencia({
            serial: '',
            modelo: '',
            descripcion: '',
            color: '',
            precio: '',
            fechaCompra: '',
            tipoInventario: 'Equipo Cliente'
        });
    };

    const completarVisita = async (e) => {
        e.preventDefault();
        
        if (!visitaSeleccionada) return;

        if (!imagenFinal || !observaciones || !datosAsociacion.usuario || !datosAsociacion.marca || !datosAsociacion.estadoEquipo) {
            swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        try {
            swal.fire({
                title: 'Completando visita...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => swal.showLoading()
            });

            const imagenFinalBase64 = await convertirImagenABase64(imagenFinal);

            await axiosInstance.put(`/api/agendar-visita/completar/${visitaSeleccionada._id}`, {
                imagenFinal: imagenFinalBase64,
                observacionesTecnico: observaciones,
                usuario: datosAsociacion.usuario,
                marca: datosAsociacion.marca,
                estadoEquipo: datosAsociacion.estadoEquipo
            });

            swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                html: `
                    <p>Visita técnica completada exitosamente.</p>
                    <p><strong>Se ha enviado un email a yeisonangulo61@gmail.com con el token de confirmación.</strong></p>
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 15px;">
                        <h5 style="color: #856404; margin: 0 0 10px 0;">🔐 Seguridad del Token</h5>
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            Por seguridad, el token SOLO está visible en la consola del backend (PowerShell).
                            El token fue enviado a yeisonangulo61@gmail.com y debe ser ingresado para transferir al inventario.
                        </p>
                    </div>
                    <p class="text-muted mt-2">Revisa la consola del backend para ver el token generado.</p>
                `
            });
            
            cerrarModalCompletar();
            cargarVisitas();

        } catch (error) {
            console.error('Error al completar visita:', error);
            swal.fire('Error', (error.response && error.response.data && error.response.data.mensaje) ? error.response.data.mensaje : 'Error al completar la visita', 'error');
        }
    };

    const verificarYTransferir = async (e) => {
        e.preventDefault();
        
        if (!visitaSeleccionada) return;

        // Validar que todos los campos estén completos
        if (!tokenIngresado.trim()) {
            swal.fire('Error', 'Por favor ingresa el token de confirmación recibido por email', 'error');
            return;
        }

        if (!datosTransferencia.serial || !datosTransferencia.modelo || !datosTransferencia.color || !datosTransferencia.precio) {
            swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        try {
            swal.fire({
                title: 'Verificando token...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => swal.showLoading()
            });

            // Verificar token
            await axiosInstance.post(`/api/agendar-visita/verificar-token/${visitaSeleccionada._id}`, {
                token: tokenIngresado.trim().toUpperCase()
            });

            // Si el token es correcto, proceder a transferir
            swal.fire({
                title: 'Transfiriendo al inventario...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => swal.showLoading()
            });

            await axiosInstance.post(`/api/agendar-visita/transferir/${visitaSeleccionada._id}`, datosTransferencia);

            swal.fire({
                icon: 'success',
                title: '¡Transferido!',
                html: `
                    <p>El equipo ha sido agregado al inventario exitosamente.</p>
                    <p><strong>Ahora puede visualizarlo en la sección "Activos".</strong></p>
                `
            });
            
            cerrarModalTransferir();
            cargarVisitas();

        } catch (error) {
            console.error('Error:', error);
            swal.fire('Error', (error.response && error.response.data && error.response.data.mensaje) ? error.response.data.mensaje : 'Error en la verificación o transferencia', 'error');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🛠️ Gestión de Visitas Técnicas</h2>
            
            <div className="alert alert-info">
                <h5>ℹ️ Flujo de Trabajo:</h5>
                <ol className="mb-0">
                    <li><strong>Completar Visita:</strong> El técnico sube la imagen final y observaciones. Se genera un token y se envía por email a yeisonangulo61@gmail.com.</li>
                    <li><strong>Verificar Token:</strong> El técnico ingresa el token recibido en el email para autorizar la transferencia.</li>
                    <li><strong>Transferir a Inventario:</strong> Una vez verificado el token, el equipo se agrega al inventario.</li>
                </ol>
            </div>

            {/* Visitas Pendientes */}
            <h3 className="mt-5 mb-3">📋 Visitas Pendientes / En Proceso</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {visitas.filter(v => v.estadoVisita === 'Pendiente' || v.estadoVisita === 'En Proceso').length > 0 ? (
                    visitas.filter(v => v.estadoVisita === 'Pendiente' || v.estadoVisita === 'En Proceso').map(visita => (
                        <div className="col" key={visita._id}>
                            <div className="card h-100 shadow-sm border-warning">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <span className={`badge ${visita.estadoVisita === 'Pendiente' ? 'bg-warning text-dark' : 'bg-info'} float-end`}>
                                            {visita.estadoVisita}
                                        </span>
                                        {visita.nombre}
                                    </h5>
                                    <hr />
                                    <p className="card-text mb-1"><strong>📞 Contacto:</strong> {visita.contacto}</p>
                                    <p className="card-text mb-1"><strong>🛠️ Servicio:</strong> {visita.tipoServicio}</p>
                                    <p className="card-text mb-1"><strong>💻 Equipo:</strong> {visita.tipoEquipo}</p>
                                    <p className="card-text mb-1"><strong>📍 Dirección:</strong> {visita.direccion}</p>
                                    <p className="card-text mb-1"><strong>📅 Fecha:</strong> {new Date(visita.fecha).toLocaleDateString('es-CO')}</p>
                                    <p className="card-text mb-1"><strong>⏰ Hora:</strong> {visita.hora}</p>
                                    <p className="card-text mb-3"><strong>📝 Problema:</strong> {visita.problema}</p>
                                    
                                    {visita.imagenEquipo && (
                                        <div className="mb-2">
                                            <p className="mb-1"><strong>Imagen Inicial:</strong></p>
                                            <img src={visita.imagenEquipo} alt="Equipo inicial" className="img-fluid rounded" style={{ maxHeight: '150px' }} />
                                        </div>
                                    )}
                                    
                                    {visita.imagenBoceto && (
                                        <div className="mb-2">
                                            <p className="mb-1"><strong>Boceto:</strong></p>
                                            <img src={visita.imagenBoceto} alt="Boceto diseño" className="img-fluid rounded" style={{ maxHeight: '150px' }} />
                                        </div>
                                    )}
                                    
                                    <button 
                                        className="btn btn-success btn-sm w-100 mt-3"
                                        onClick={() => abrirModalCompletar(visita)}
                                    >
                                        ✅ Completar Visita
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-secondary text-center">
                            No hay visitas pendientes o en proceso.
                        </div>
                    </div>
                )}
            </div>

            {/* Visitas Completadas (No Transferidas) */}
            <h3 className="mt-5 mb-3">✅ Visitas Completadas (Pendientes de Transferir)</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {visitas.filter(v => v.estadoVisita === 'Completada' && !v.transferidoAInventario).length > 0 ? (
                    visitas.filter(v => v.estadoVisita === 'Completada' && !v.transferidoAInventario).map(visita => (
                        <div className="col" key={visita._id}>
                            <div className="card h-100 shadow-sm border-success">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <span className="badge bg-success float-end">Completada</span>
                                        {visita.nombre}
                                    </h5>
                                    {visita.tokenVerificado && (
                                        <span className="badge bg-primary mb-2">🔐 Token Verificado</span>
                                    )}
                                    <hr />
                                    <p className="card-text mb-1"><strong>🛠️ Servicio:</strong> {visita.tipoServicio}</p>
                                    <p className="card-text mb-1"><strong>💻 Equipo:</strong> {visita.tipoEquipo}</p>
                                    <p className="card-text mb-3"><strong>📝 Observaciones:</strong> {visita.observacionesTecnico}</p>
                                    
                                    {visita.imagenFinal && (
                                        <div className="mb-2">
                                            <p className="mb-1"><strong>Imagen Final:</strong></p>
                                            <img src={visita.imagenFinal} alt="Equipo final" className="img-fluid rounded" style={{ maxHeight: '150px' }} />
                                        </div>
                                    )}
                                    
                                    <button 
                                        className="btn btn-primary btn-sm w-100 mt-3"
                                        onClick={() => abrirModalTransferir(visita)}
                                    >
                                        🔐 Verificar Token y Transferir a Inventario
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-secondary text-center">
                            No hay visitas completadas pendientes de transferir.
                        </div>
                    </div>
                )}
            </div>

            {/* Visitas Transferidas al Inventario */}
            <h3 className="mt-5 mb-3">📦 Visitas Transferidas al Inventario</h3>
            <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                {visitas.filter(v => v.transferidoAInventario).length > 0 ? (
                    visitas.filter(v => v.transferidoAInventario).map(visita => (
                        <div className="col" key={visita._id}>
                            <div className="card h-100 shadow-sm border-secondary">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <span className="badge bg-secondary float-end">Transferida</span>
                                        {visita.nombre}
                                    </h5>
                                    <hr />
                                    <p className="card-text mb-1"><strong>🛠️ Servicio:</strong> {visita.tipoServicio}</p>
                                    <p className="card-text mb-1"><strong>💻 Equipo:</strong> {visita.tipoEquipo}</p>
                                    <p className="card-text text-success"><strong>✅ Ya se encuentra en el inventario</strong></p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-secondary text-center">
                            No hay visitas transferidas al inventario aún.
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Completar Visita */}
            {mostrarModalCompletar && visitaSeleccionada && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">✅ Completar Visita: {visitaSeleccionada.nombre}</h5>
                                <button type="button" className="btn-close" onClick={cerrarModalCompletar}></button>
                            </div>
                            <form onSubmit={completarVisita}>
                                <div className="modal-body">
                                    <div className="alert alert-info">
                                        <strong>ℹ️ Importante:</strong> Al completar la visita, se generará un token de confirmación 
                                        que se enviará por email a <strong>yeisonangulo61@gmail.com</strong>. Este token será requerido 
                                        para transferir el equipo al inventario.
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>📷 Imagen Final del Equipo/Proyecto *</strong></label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            accept="image/*"
                                            onChange={handleImagenFinalChange}
                                            required
                                        />
                                        <div className="form-text">Sube una imagen del estado final del equipo o proyecto (máximo 5MB)</div>
                                        {imagenFinal && <small className="text-success">✓ Imagen seleccionada: {imagenFinal.name}</small>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>📝 Observaciones del Técnico *</strong></label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4"
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            placeholder="Describe el trabajo realizado, repuestos utilizados, recomendaciones, etc."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>👤 Usuario/Cliente *</strong></label>
                                        <select 
                                            className="form-select"
                                            value={datosAsociacion.usuario}
                                            onChange={(e) => setDatosAsociacion({...datosAsociacion, usuario: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecciona un usuario</option>
                                            {usuarios.map(u => (
                                                <option key={u._id} value={u._id}>{u.nombre} - {u.email}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>🏷️ Marca *</strong></label>
                                        <select 
                                            className="form-select"
                                            value={datosAsociacion.marca}
                                            onChange={(e) => setDatosAsociacion({...datosAsociacion, marca: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecciona una marca</option>
                                            {marcas.map(m => (
                                                <option key={m._id} value={m._id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>⚙️ Estado del Equipo *</strong></label>
                                        <select 
                                            className="form-select"
                                            value={datosAsociacion.estadoEquipo}
                                            onChange={(e) => setDatosAsociacion({...datosAsociacion, estadoEquipo: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecciona un estado</option>
                                            {estados.map(e => (
                                                <option key={e._id} value={e._id}>{e.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModalCompletar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        ✅ Completar Visita y Generar Token
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Verificar Token y Transferir */}
            {mostrarModalTransferir && visitaSeleccionada && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">🔐 Verificar Token y Transferir: {visitaSeleccionada.nombre}</h5>
                                <button type="button" className="btn-close" onClick={cerrarModalTransferir}></button>
                            </div>
                            <form onSubmit={verificarYTransferir}>
                                <div className="modal-body">
                                    <div className="alert alert-warning">
                                        <h6><strong>🔐 Verificación de Seguridad</strong></h6>
                                        <p className="mb-0">
                                            Debes ingresar el token de confirmación que fue enviado al correo 
                                            <strong> yeisonangulo61@gmail.com</strong> cuando se completó esta visita. 
                                            Sin este token, no podrás transferir el equipo al inventario.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label"><strong>🔑 Token de Confirmación *</strong></label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg text-center" 
                                            value={tokenIngresado}
                                            onChange={(e) => setTokenIngresado(e.target.value.toUpperCase())}
                                            placeholder="Ej: A1B2C3"
                                            maxLength="6"
                                            style={{ letterSpacing: '5px', fontWeight: 'bold', fontSize: '24px' }}
                                            required
                                        />
                                        <div className="form-text">Ingresa el token de 6 caracteres recibido por email</div>
                                    </div>

                                    <hr />
                                    <h6 className="mb-3">📦 Datos para Inventario</h6>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label"><strong>Serial *</strong></label>
                                            <input 
                                                type="text" 
                                                className="form-control"
                                                value={datosTransferencia.serial}
                                                onChange={(e) => setDatosTransferencia({...datosTransferencia, serial: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label"><strong>Modelo *</strong></label>
                                            <input 
                                                type="text" 
                                                className="form-control"
                                                value={datosTransferencia.modelo}
                                                onChange={(e) => setDatosTransferencia({...datosTransferencia, modelo: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>Descripción</strong></label>
                                        <textarea 
                                            className="form-control" 
                                            rows="2"
                                            value={datosTransferencia.descripcion}
                                            onChange={(e) => setDatosTransferencia({...datosTransferencia, descripcion: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label"><strong>Color *</strong></label>
                                            <input 
                                                type="text" 
                                                className="form-control"
                                                value={datosTransferencia.color}
                                                onChange={(e) => setDatosTransferencia({...datosTransferencia, color: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label"><strong>Precio *</strong></label>
                                            <input 
                                                type="number" 
                                                className="form-control"
                                                value={datosTransferencia.precio}
                                                onChange={(e) => setDatosTransferencia({...datosTransferencia, precio: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label"><strong>Fecha Compra</strong></label>
                                            <input 
                                                type="date" 
                                                className="form-control"
                                                value={datosTransferencia.fechaCompra}
                                                onChange={(e) => setDatosTransferencia({...datosTransferencia, fechaCompra: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label"><strong>Tipo de Inventario</strong></label>
                                        <select 
                                            className="form-select"
                                            value={datosTransferencia.tipoInventario}
                                            onChange={(e) => setDatosTransferencia({...datosTransferencia, tipoInventario: e.target.value})}
                                        >
                                            <option value="Equipo Cliente">Equipo Cliente</option>
                                            <option value="Rack Telecomunicaciones">Rack Telecomunicaciones</option>
                                            <option value="Proyecto Web">Proyecto Web</option>
                                            <option value="Equipo Propio">Equipo Propio</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModalTransferir}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        🔐 Verificar Token y Transferir al Inventario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
