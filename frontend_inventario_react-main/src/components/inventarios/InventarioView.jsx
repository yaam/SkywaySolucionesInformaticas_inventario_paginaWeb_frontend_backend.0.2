import React, {useState, useEffect} from 'react';
import {axiosInstance} from '../../helpers/axios-config';
import swal from  'sweetalert2';

export const InventarioView = () => {
  
  const [inventarios, setInventarios] = useState([]);

  const listarInventarios = async() =>{
      try{
      swal.fire({
          allowOutsideClick: false,
          text: 'Cargando inventario completo...'
      })
      swal.showLoading();
      const {data} = await axiosInstance.get('/api/inventarios?populate=usuario,marca,estadoEquipo,tipoEquipo');
      console.log(data);
      setInventarios(data);
      swal.close();
    } catch (error){
      console.log(error);
      swal.close();
      swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el inventario'
      });
    }
  }
  
  useEffect(()=>{
    listarInventarios();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Inventario Completo - Skyway Soluciones Informáticas</h2>
      <p className="text-center text-muted mb-4">
        Todos los equipos registrados: activos e inactivos
      </p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {inventarios.map((inventario) => (
          <div className="col" key={inventario._id}>
            <div className="card h-100 shadow-sm">
              {/* Sección de imágenes */}
              <div className="row g-0">
                {/* Imagen Inicial */}
                <div className="col-6" style={{ borderRight: '2px solid #dee2e6' }}>
                  <div className="p-2 text-center bg-light">
                    <small className="fw-bold text-primary">
                      {inventario.tipoInventario === 'Proyecto Web' ? '📋 Boceto Inicial' : '📷 Estado Inicial'}
                    </small>
                  </div>
                  <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    {inventario.fotoInicial ? (
                      <img
                        src={
                          inventario.fotoInicial.startsWith('data:image') 
                            ? inventario.fotoInicial 
                            : inventario.fotoInicial.startsWith('http') 
                              ? inventario.fotoInicial 
                              : `http://localhost:4001${inventario.fotoInicial}`
                        }
                        alt="Estado Inicial"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen+Inicial';
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <i className="fas fa-image fa-3x text-muted"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Imagen Final */}
                <div className="col-6">
                  <div className="p-2 text-center bg-light">
                    <small className="fw-bold text-success">
                      {inventario.tipoInventario === 'Proyecto Web' ? '🌐 Resultado Final' : '✅ Estado Final'}
                    </small>
                  </div>
                  <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    {inventario.foto ? (
                      <img
                        src={
                          inventario.foto.startsWith('data:image') 
                            ? inventario.foto 
                            : inventario.foto.startsWith('http') 
                              ? inventario.foto 
                              : `http://localhost:4001${inventario.foto}`
                        }
                        alt="Estado Final"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen+Final';
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <i className="fas fa-image fa-3x text-muted"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del equipo */}
              <div className="card-body">
                <h5 className="card-title text-primary">{inventario.descripcion}</h5>
                
                <div className="row">
                  <div className="col-6 mb-2">
                    <small className="text-muted">Serial:</small>
                    <p className="mb-0"><strong>{inventario.serial}</strong></p>
                  </div>
                  <div className="col-6 mb-2">
                    <small className="text-muted">Modelo:</small>
                    <p className="mb-0">{inventario.modelo}</p>
                  </div>
                </div>

                <hr className="my-2"/>

                {/* Cliente/Usuario */}
                {inventario.usuario && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-user"></i> Cliente:</small>
                    <p className="mb-0">
                      <strong>{inventario.usuario.nombre || 'No especificado'}</strong>
                    </p>
                    {inventario.usuario.email && (
                      <p className="mb-0 small text-muted">
                        <i className="fas fa-envelope"></i> {inventario.usuario.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Marca */}
                {inventario.marca && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-tag"></i> Marca:</small>
                    <p className="mb-0">{inventario.marca.nombre || 'No especificada'}</p>
                  </div>
                )}

                {/* Tipo de Equipo */}
                {inventario.tipoEquipo && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-laptop"></i> Tipo:</small>
                    <p className="mb-0">{inventario.tipoEquipo.nombre || 'No especificado'}</p>
                  </div>
                )}

                {/* Estado del Equipo */}
                {inventario.estadoEquipo && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-info-circle"></i> Estado:</small>
                    <p className="mb-0">
                      <span className={`badge ${
                        (() => {
                          const nombreEstado = (inventario.estadoEquipo.nombre || inventario.estadoEquipo.estado || '').toLowerCase().trim();
                          console.log('Estado del equipo:', nombreEstado); // Para debug
                          
                          // Mantenimiento Preventivo (Morado) - primero para evitar conflictos
                          if (nombreEstado.includes('preventivo') || nombreEstado.includes('mantenimiento preventivo')) {
                            return 'badge-purple';
                          }
                          // Mantenimiento Correctivo (Azul)
                          else if (nombreEstado.includes('correctivo') || nombreEstado.includes('mantenimiento correctivo')) {
                            return 'bg-info';
                          }
                          // Pendiente de Revisión (Amarillo)
                          else if (nombreEstado.includes('revisión') || nombreEstado.includes('revision') || nombreEstado.includes('pendiente de revision')) {
                            return 'bg-warning text-dark';
                          }
                          // Bueno (Verde)
                          else if (nombreEstado.includes('bueno') || nombreEstado.includes('buen')) {
                            return 'bg-success';
                          }
                          // Malo (Rojo)
                          else if (nombreEstado.includes('malo') || nombreEstado.includes('mal') || nombreEstado.includes('dañ')) {
                            return 'bg-danger';
                          }
                          // Por defecto (Gris)
                          else {
                            return 'bg-secondary';
                          }
                        })()
                      }`}>
                        {inventario.estadoEquipo.nombre || inventario.estadoEquipo.estado || 'No especificado'}
                      </span>
                    </p>
                  </div>
                )}

                {/* Estado Activo/Inactivo del Equipo en Servicio */}
                <div className="mb-2">
                  <small className="text-muted"><i className="fas fa-power-off"></i> Estado en Servicio:</small>
                  <p className="mb-0">
                    {inventario.activo !== false ? (
                      <span className="badge bg-success">
                        ✅ Activo
                      </span>
                    ) : (
                      <span className="badge bg-danger">
                        ❌ Inactivo
                      </span>
                    )}
                  </p>
                  {inventario.activo === false && (
                    <small className="text-danger">
                      <i className="fas fa-exclamation-triangle"></i> Equipo fuera de servicio
                    </small>
                  )}
                </div>

                {/* Seguimiento del Equipo */}
                {inventario.seguimiento && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-clipboard-list"></i> Seguimiento:</small>
                    <div className={`alert ${inventario.activo !== false ? 'alert-info' : 'alert-warning'} py-2 px-3 mt-1 mb-0`}>
                      <small style={{ whiteSpace: 'pre-wrap' }}>{inventario.seguimiento}</small>
                    </div>
                  </div>
                )}

                {/* Tipo de Inventario */}
                <div className="mb-2">
                  <small className="text-muted"><i className="fas fa-boxes"></i> Categoría:</small>
                  <p className="mb-0">
                    <span className="badge bg-info">{inventario.tipoInventario}</span>
                  </p>
                </div>

                {/* Precio */}
                <div className="mb-2">
                  <small className="text-muted"><i className="fas fa-dollar-sign"></i> Precio:</small>
                  <p className="mb-0 text-success fw-bold">
                    ${inventario.precio ? inventario.precio.toLocaleString('es-CO') : '0'} COP
                  </p>
                </div>

                {/* Detalles de mantenimiento */}
                {inventario.detallesMantenimiento && (
                  <div className="mb-2">
                    <small className="text-muted"><i className="fas fa-wrench"></i> Servicio:</small>
                    <p className="mb-0 small">{inventario.detallesMantenimiento}</p>
                  </div>
                )}
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
    </div>
  )
}