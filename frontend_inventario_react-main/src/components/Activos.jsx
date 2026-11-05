import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../helpers/axios-config';
import { getUsuarios } from '../services/usuarioService';
import { getMarcas } from '../services/marcaService';
import { getTiposEquipos } from '../services/tipoEquipoService';
import { getEstadosEquipos } from '../services/estadoEquipoService';
import { crearInventario, editInventario, eliminarInventario } from '../services/inventarioService';
import swal from 'sweetalert2';

export const Activos = () => {
    const [inventarios, setInventarios] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [inventarioActual, setInventarioActual] = useState(null);
    
    // Estados para los catálogos
    const [usuarios, setUsuarios] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [estados, setEstados] = useState([]);
    
    // Estados para el formulario
    const [valoresForm, setValoresForm] = useState({});
    const { serial = '', modelo = '', descripcion = '', color = '', foto = '', fotoInicial = '',
        fechaCompra = '', precio = '', usuario, marca, tipo, estado,
        tipoInventario = '', clienteAsociado = '', fechaMantenimientoProgramado = '',
        detallesMantenimiento = '', tecnologiaWeb = '', urlProyecto = '' } = valoresForm;

    // Listar inventarios
    const listarInventarios = async () => {
        try {
            swal.fire({
                allowOutsideClick: false,
                text: 'Cargando equipos activos...'
            });
            swal.showLoading();

            const { data } = await axiosInstance.get('/api/inventarios?populate=usuario,marca,estadoEquipo,tipoEquipo');
            console.log(data);
            setInventarios(data);
            swal.close();
        } catch (error) {
            console.log(error);
            swal.close();
            swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los equipos'
            });
        }
    };

    // Listar catálogos
    const listarCatalogos = async () => {
        try {
            const [resUsuarios, resMarcas, resTipos, resEstados] = await Promise.all([
                getUsuarios(),
                getMarcas(),
                getTiposEquipos(),
                getEstadosEquipos()
            ]);
            setUsuarios(resUsuarios.data);
            setMarcas(resMarcas.data);
            setTipos(resTipos.data);
            setEstados(resEstados.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        listarInventarios();
        listarCatalogos();
    }, []);

    // Abrir modal para crear
    const handleOpenModalCrear = () => {
        setModoEdicion(false);
        setInventarioActual(null);
        setValoresForm({});
        setOpenModal(true);
    };

    // Abrir modal para editar
    const handleOpenModalEditar = (inventario) => {
        setModoEdicion(true);
        setInventarioActual(inventario);
        setValoresForm({
            serial: inventario.serial,
            modelo: inventario.modelo,
            descripcion: inventario.descripcion,
            color: inventario.color,
            foto: inventario.foto,
            fotoInicial: inventario.fotoInicial || '',
            fechaCompra: inventario.fechaCompra ? inventario.fechaCompra.substring(0, 10) : '',
            precio: inventario.precio,
            usuario: inventario.usuario && inventario.usuario._id,
            marca: inventario.marca && inventario.marca._id,
            tipo: inventario.tipoEquipo && inventario.tipoEquipo._id,
            estado: inventario.estadoEquipo && inventario.estadoEquipo._id,
            tipoInventario: inventario.tipoInventario || '',
            clienteAsociado: inventario.clienteAsociado || '',
            fechaMantenimientoProgramado: inventario.fechaMantenimientoProgramado ? inventario.fechaMantenimientoProgramado.substring(0, 10) : '',
            detallesMantenimiento: inventario.detallesMantenimiento || '',
            tecnologiaWeb: inventario.tecnologiaWeb || '',
            urlProyecto: inventario.urlProyecto || ''
        });
        setOpenModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setModoEdicion(false);
        setInventarioActual(null);
        setValoresForm({});
    };

    // Manejar cambios en el formulario
    const handleOnChange = ({ target }) => {
        const { name, value } = target;
        setValoresForm({ ...valoresForm, [name]: value });
    };

    // Guardar (crear o editar)
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const inventario = {
            serial, modelo, descripcion, color, foto, fotoInicial,
            fechaCompra, precio,
            usuario: {
                _id: usuario
            },
            marca: {
                _id: marca
            },
            tipoEquipo: {
                _id: tipo
            },
            estadoEquipo: {
                _id: estado
            },
            tipoInventario,
            clienteAsociado,
            fechaMantenimientoProgramado,
            detallesMantenimiento,
            tecnologiaWeb,
            urlProyecto
        };

        try {
            swal.fire({
                allowOutsideClick: false,
                text: modoEdicion ? 'Actualizando...' : 'Creando...'
            });
            swal.showLoading();

            if (modoEdicion) {
                await editInventario(inventarioActual._id, inventario);
                swal.fire('Éxito', 'Equipo actualizado correctamente', 'success');
            } else {
                await crearInventario(inventario);
                swal.fire('Éxito', 'Equipo creado correctamente', 'success');
            }

            handleCloseModal();
            listarInventarios();
        } catch (error) {
            console.log(error);
            swal.close();
            let mensaje;
            if (error && error.response && error.response.data) {
                mensaje = error.response.data;
            } else {
                mensaje = 'Ocurrió un error, por favor intente de nuevo';
            }
            swal.fire('Error', mensaje, 'error');
        }
    };

    // Eliminar inventario
    const handleEliminar = async (inventarioId, descripcion) => {
        const result = await swal.fire({
            title: '¿Está seguro?',
            text: `Se eliminará el equipo: ${descripcion}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                swal.fire({
                    allowOutsideClick: false,
                    text: 'Eliminando...'
                });
                swal.showLoading();

                await eliminarInventario(inventarioId);
                swal.fire('Eliminado', 'El equipo ha sido eliminado correctamente', 'success');
                listarInventarios();
            } catch (error) {
                console.log(error);
                swal.close();
                swal.fire('Error', 'No se pudo eliminar el equipo', 'error');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Equipos Activos - Skyway Soluciones Informáticas</h2>
                    <p className="text-muted mb-0">
                        Inventario de equipos informáticos registrados con imágenes y detalles
                    </p>
                </div>
                <button 
                    className="btn btn-primary btn-lg" 
                    onClick={handleOpenModalCrear}
                >
                    <i className="fas fa-plus"></i> Nuevo Equipo
                </button>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                {inventarios.map((inventario) => (
                    <div className="col" key={inventario._id}>
                        <div className="card h-100 shadow-sm">
                            {/* Imagen del equipo */}
                            <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                {inventario.foto ? (
                                    <img
                                        src={
                                            inventario.foto.startsWith('data:image')
                                                ? inventario.foto
                                                : inventario.foto.startsWith('http')
                                                    ? inventario.foto
                                                    : `http://localhost:4001${inventario.foto}`
                                        }
                                        className="card-img-top"
                                        alt={inventario.descripcion}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            console.error('Error al cargar imagen:', inventario.foto);
                                            e.target.src = 'https://via.placeholder.com/300x250?text=Sin+Imagen';
                                        }}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100">
                                        <i className="fas fa-desktop fa-5x text-muted"></i>
                                    </div>
                                )}
                            </div>

                            <div className="card-body">
                                <h5 className="card-title text-primary">{inventario.descripcion}</h5>

                                <div className="mb-2">
                                    <small className="text-muted">Serial:</small>
                                    <p className="mb-1"><strong>{inventario.serial}</strong></p>
                                </div>

                                <div className="mb-2">
                                    <small className="text-muted">Modelo:</small>
                                    <p className="mb-1">{inventario.modelo}</p>
                                </div>

                                <hr />

                                {/* Información del cliente/usuario */}
                                {inventario.usuario && (
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="fas fa-user"></i> Cliente:</small>
                                        <p className="mb-1">
                                            <strong>{inventario.usuario.nombre || 'No especificado'}</strong>
                                        </p>
                                        {inventario.usuario.email && (
                                            <p className="mb-1 small">
                                                <i className="fas fa-envelope"></i> {inventario.usuario.email}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Marca */}
                                {inventario.marca && (
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="fas fa-tag"></i> Marca:</small>
                                        <p className="mb-1">{inventario.marca.nombre || 'No especificada'}</p>
                                    </div>
                                )}

                                {/* Tipo de Equipo */}
                                {inventario.tipoEquipo && (
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="fas fa-laptop"></i> Tipo:</small>
                                        <p className="mb-1">{inventario.tipoEquipo.nombre || 'No especificado'}</p>
                                    </div>
                                )}

                                {/* Estado del Equipo */}
                                {inventario.estadoEquipo && (
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="fas fa-info-circle"></i> Estado:</small>
                                        <p className="mb-1">
                                            <span className={`badge ${inventario.estadoEquipo.estado === 'Activo' ||
                                                    inventario.estadoEquipo.nombre === 'Activo'
                                                    ? 'bg-success'
                                                    : 'bg-secondary'
                                                }`}>
                                                {inventario.estadoEquipo.nombre || inventario.estadoEquipo.estado || 'No especificado'}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Precio */}
                                <div className="mb-2">
                                    <small className="text-muted"><i className="fas fa-dollar-sign"></i> Precio:</small>
                                    <p className="mb-1 text-success fw-bold">
                                        ${inventario.precio ? inventario.precio.toLocaleString('es-CO') : '0'} COP
                                    </p>
                                </div>

                                {/* Fecha de compra */}
                                {inventario.fechaCompra && (
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="fas fa-calendar"></i> Fecha de Compra:</small>
                                        <p className="mb-1">
                                            {new Date(inventario.fechaCompra).toLocaleDateString('es-CO')}
                                        </p>
                                    </div>
                                )}

                                {/* Botones de acción */}
                                <div className="d-grid gap-2 mt-3">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleOpenModalEditar(inventario)}
                                    >
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleEliminar(inventario._id, inventario.descripcion)}
                                    >
                                        <i className="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="card-footer text-muted small">
                                Registrado el {new Date(inventario.fechaCreacion).toLocaleDateString('es-CO')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {inventarios.length === 0 && (
                <div className="alert alert-info text-center mt-4" role="alert">
                    <i className="fas fa-info-circle"></i> No hay equipos registrados en el inventario
                </div>
            )}

            {/* Modal/Sidebar para crear/editar */}
            {openModal && (
                <div className='sidebar'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col'>
                                <div className='sidebar-header'>
                                    <h3>{modoEdicion ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>
                                    <i className="fa-solid fa-xmark" onClick={handleCloseModal}></i>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <hr />
                            </div>
                            <form onSubmit={(e) => handleOnSubmit(e)}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Serial</label>
                                            <input type="text" name='serial'
                                                required
                                                value={serial}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Modelo</label>
                                            <input type="text" name='modelo'
                                                required
                                                value={modelo}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <input type="text" name='descripcion'
                                                required
                                                value={descripcion}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Color</label>
                                            <input type="text" name='color'
                                                required
                                                value={color}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Foto Inicial (URL)</label>
                                            <input type="url" name='fotoInicial'
                                                value={fotoInicial}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control"
                                                placeholder="URL de la foto inicial (opcional)" />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Foto Final (URL)</label>
                                            <input type="url" name='foto'
                                                required
                                                value={foto}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Fecha Compra</label>
                                            <input type="date" name='fechaCompra'
                                                required
                                                value={fechaCompra}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Precio</label>
                                            <input type="number" name='precio'
                                                required
                                                value={precio}
                                                onChange={(e) => handleOnChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Cliente/Usuario</label>
                                            <select className="form-select"
                                                onChange={(e) => handleOnChange(e)}
                                                name="usuario"
                                                required
                                                value={usuario}>
                                                <option value="">--SELECCIONE--</option>
                                                {
                                                    usuarios.map(({ _id, nombre }) => {
                                                        return <option key={_id} value={_id}>
                                                            {nombre}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Marca</label>
                                            <select className="form-select"
                                                onChange={(e) => handleOnChange(e)}
                                                name="marca"
                                                required
                                                value={marca}>
                                                <option value="">--SELECCIONE--</option>
                                                {
                                                    marcas.map(({ _id, nombre }) => {
                                                        return <option key={_id} value={_id}>
                                                            {nombre}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Tipo Equipo</label>
                                            <select className="form-select"
                                                onChange={(e) => handleOnChange(e)}
                                                name="tipo"
                                                required
                                                value={tipo}>
                                                <option value="">--SELECCIONE--</option>
                                                {
                                                    tipos.map(({ _id, nombre }) => {
                                                        return <option key={_id} value={_id}>
                                                            {nombre}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Estado Equipo</label>
                                            <select className="form-select"
                                                onChange={(e) => handleOnChange(e)}
                                                name="estado"
                                                required
                                                value={estado}>
                                                <option value="">--SELECCIONE--</option>
                                                {
                                                    estados.map(({ _id, nombre }) => {
                                                        return <option key={_id} value={_id}>
                                                            {nombre}
                                                        </option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Tipo de Inventario</label>
                                            <select className="form-select"
                                                onChange={(e) => handleOnChange(e)}
                                                name="tipoInventario"
                                                required
                                                value={tipoInventario}>
                                                <option value="">--SELECCIONE--</option>
                                                <option value="Equipo Cliente">Equipo de Cliente (Mantenimiento)</option>
                                                <option value="Rack Telecomunicaciones">Rack de Telecomunicaciones</option>
                                                <option value="Proyecto Web">Proyecto Web</option>
                                                <option value="Equipo Propio">Equipo Propio</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Campos condicionales según tipo de inventario */}
                                {tipoInventario === 'Equipo Cliente' && (
                                    <>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">Cliente Asociado</label>
                                                    <input type="text" name='clienteAsociado'
                                                        value={clienteAsociado}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">Fecha Mantenimiento Programado</label>
                                                    <input type="date" name='fechaMantenimientoProgramado'
                                                        value={fechaMantenimientoProgramado}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">Detalles del Mantenimiento</label>
                                                    <textarea name='detallesMantenimiento'
                                                        value={detallesMantenimiento}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control"
                                                        rows="3"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {tipoInventario === 'Rack Telecomunicaciones' && (
                                    <div className='row'>
                                        <div className='col'>
                                            <div className="mb-3">
                                                <label className="form-label">Cliente de Rack</label>
                                                <input type="text" name='clienteAsociado'
                                                    value={clienteAsociado}
                                                    onChange={(e) => handleOnChange(e)}
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {tipoInventario === 'Proyecto Web' && (
                                    <>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">Cliente del Proyecto</label>
                                                    <input type="text" name='clienteAsociado'
                                                        value={clienteAsociado}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">Tecnología Web</label>
                                                    <input type="text" name='tecnologiaWeb'
                                                        value={tecnologiaWeb}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control"
                                                        placeholder="Ej: React, Node.js, MongoDB" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">URL del Proyecto</label>
                                                    <input type="url" name='urlProyecto'
                                                        value={urlProyecto}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control"
                                                        placeholder="https://..." />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className='row'>
                                    <div className='col'>
                                        <button type="submit" className="btn btn-primary me-2">
                                            <i className="fas fa-save"></i> {modoEdicion ? 'Actualizar' : 'Guardar'}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                            <i className="fas fa-times"></i> Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
