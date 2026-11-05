import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { getInventarioPorId, editInventario} from '../../services/inventarioService';
import {getUsuarios} from '../../services/usuarioService';
import {getMarcas} from '../../services/marcaService';
import {getTiposEquipos} from '../../services/tipoEquipoService';
import {getEstadosEquipos} from '../../services/estadoEquipoService';
import swal from  'sweetalert2';



export const InventarioUpdate = () => {
    const {inventarioId = ' '} = useParams();
    const [ inventario, setInventario] = useState({});
    const [valoresForm, setValoresForm] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [estados, setEstados] = useState([]);
    const {serial = '', modelo= '', descripcion= '', color= '', foto = '',
    fechaCompra = '', precio= '', usuario, marca, tipo, estado,
    tipoInventario = '', clienteAsociado = '', fechaMantenimientoProgramado = '',
    detallesMantenimiento = '', tecnologiaWeb = '', urlProyecto = '', activo = true, seguimiento = ''} = valoresForm;


    const listarUsuarios = async () =>{
    try {
        const {data} = await getUsuarios();
        setUsuarios(data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
    }
    useEffect(  () =>{

    listarUsuarios();
    }, []);

    const listarMarcas = async () =>{
    try {
    const {data} = await getMarcas();
    setMarcas(data);
    } catch (error) {
    console.log(error);
    }
    }
    useEffect(  () =>{
    listarMarcas();
    }, []);

    const listarTipoEquipo = async () =>{
    try {
        const {data} = await getTiposEquipos();
        setTipos(data);
    } catch (error) {
        console.log(error);
    }   
    }

    useEffect(  () =>{
    listarTipoEquipo();
    }, []);

    const listarEstadoEquipo = async() =>{
    try {
        const {data} = await getEstadosEquipos();
        setEstados(data);
    } catch (error) {
        console.log(error);
    }
    }
    useEffect(  () =>{
    listarEstadoEquipo();
    }, []);


    const getInventario = async () =>{
    try {
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const{data} = await getInventarioPorId(inventarioId)
        setInventario(data);
        swal.close();
    } catch (error) {
        console.log(error);
        swal.close();
    }
    }

    useEffect(() => {
    getInventario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventarioId]);

    useEffect(() =>{
            setValoresForm({
            serial: inventario.serial,
            modelo: inventario.modelo,
            descripcion: inventario.descripcion,
            color: inventario.color,
            foto: inventario.foto,
            fechaCompra: inventario.fechaCompra,
            precio: inventario.precio,
            usuario: inventario.usuario && inventario.usuario._id,
            marca: inventario.marca && inventario.marca._id,
            tipo: inventario.tipoEquipo && inventario.tipoEquipo._id,
            estado: inventario.estadoEquipo && inventario.estadoEquipo._id,
            tipoInventario: inventario.tipoInventario || '', // Nuevo campo
            clienteAsociado: inventario.clienteAsociado || '', // Nuevo campo
            fechaMantenimientoProgramado: inventario.fechaMantenimientoProgramado ? inventario.fechaMantenimientoProgramado.substring(0, 10) : '', // Nuevo campo
            detallesMantenimiento: inventario.detallesMantenimiento || '', // Nuevo campo
            tecnologiaWeb: inventario.tecnologiaWeb || '', // Nuevo campo
            urlProyecto: inventario.urlProyecto || '', // Nuevo campo
            activo: inventario.activo !== undefined ? inventario.activo : true, // Campo activo/inactivo
            seguimiento: inventario.seguimiento || '' // Campo seguimiento
        });
    }, [inventario]);

    const handleOnChange = ({ target}) =>{
    const{ name, value} = target
    // Convertir el valor de "activo" de string a boolean
    const finalValue = name === 'activo' ? value === 'true' : value;
    setValoresForm ({...valoresForm, [name]: finalValue }); // spread
    }
    const handleOnSubmit = async (e) =>{
    e.preventDefault();
    const inventario = {
        serial, modelo, descripcion, color, foto,
        fechaCompra, precio, 
        usuario:{
            _id: usuario
        },
        marca:{
            _id: marca
        },
        tipoEquipo:{
            _id: tipo
        },
        estadoEquipo:{
            _id: estado
        },
        tipoInventario, // Nuevo campo
        clienteAsociado, // Nuevo campo
        fechaMantenimientoProgramado, // Nuevo campo
        detallesMantenimiento, // Nuevo campo
        tecnologiaWeb, // Nuevo campo
        urlProyecto, // Nuevo campo
        activo, // Campo activo/inactivo
        seguimiento // Campo seguimiento

    }
    try {
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const { data} = await editInventario(inventarioId, inventario);
        console.log(data);
        swal.close();
        alert('Inventario actualizado con éxito'); // Feedback al usuario
        // Opcional: Redirigir o recargar la lista de inventarios
    } catch (error) {
        console.log(error);
        console.log(error.response.data);
        swal.close();
        let mensaje;
        if(error && error.response && error.response.data){
            mensaje = error.response.data;
        }else{
            mensaje = 'Ocurrio un error, por favor intente de nuevo'; 
        }
        swal.fire('Error', mensaje , 'error');
    }

    }

    return (
    <div className='container-fluid mt-3 mb-2'>
        <div className='card'>
            <div className='card-header'>
                    <h5 className='card-title'>Detalle activo</h5>
            </div>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-4'>
                    <img  src= {inventario.foto} className="card-img-top" alt="..."/>
                    </div>
                    <div className='col-md-8'>
                    <form onSubmit ={(e) => handleOnSubmit(e)}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Serial</label>
                                            <input type="text" name='serial' 
                                                    required
                                                    value={serial}
                                                    onChange ={ (e) => handleOnChange(e)}
                                                    className="form-control"/>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Modelo</label>
                                            <input type="text" name='modelo' 
                                            required
                                            value={modelo} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>                   
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Descripcion</label>
                                            <input type="text" name='descripcion' 
                                            required
                                            value={descripcion} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Color</label>
                                            <input type="text" name='color' 
                                            required
                                            value={color} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Foto</label>
                                            <input type="url" name='foto' 
                                            required
                                            value={foto} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Fecha Compra</label>
                                            <input type="date" name='fechaCompra' 
                                            required
                                            value={fechaCompra} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>                   
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Precio</label>
                                            <input type="number" name='precio' 
                                            required
                                            value={precio} 
                                            onChange ={ (e) => handleOnChange(e)}
                                            className="form-control"/>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-3">
                                            <label className="form-label">Usuario</label>
                                            <select className="form-select" 
                                            onChange ={ (e) => handleOnChange(e)}
                                            name="usuario"
                                            required
                                            value={usuario}>
                                                <option value="">--SELECIONE--</option>
                                                {
                                                    usuarios.map(({ _id, nombre})=>{
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
                                            <label className="form-label">Marca</label>
                                            <select className="form-select" 
                                            onChange ={ (e) => handleOnChange(e)}
                                            name="marca"
                                            required
                                            value={marca}>
                                                <option value="">--SELECIONE--</option>
                                                {
                                                    marcas.map(({ _id, nombre})=>{
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
                                            <label className="form-label">Tipo Equipo</label>
                                            <select className="form-select" 
                                            onChange ={ (e) => handleOnChange(e)}
                                            name="tipo"
                                            required
                                            value={tipo}>
                                                <option value="">--SELECIONE--</option>
                                                {
                                                    tipos.map(({ _id, nombre})=>{
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
                                            onChange ={ (e) => handleOnChange(e)}
                                            name="estado"
                                            required
                                            value={estado}>
                                                <option value="">--SELECIONE--</option>
                                                {
                                                    estados.map(({ _id, nombre})=>{
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
                                                <option value="">--SELECIONE--</option>
                                                <option value="Equipo Cliente">Equipo de Cliente (Mantenimiento)</option>
                                                <option value="Rack Telecomunicaciones">Rack de Telecomunicaciones</option>
                                                <option value="Proyecto Web">Proyecto Web</option>
                                                <option value="Equipo Propio">Equipo Propio</option>
                                            </select>
                                        </div>
                                    </div>

                                    {tipoInventario === 'Equipo Cliente' && (
                                        <div className='col'>
                                            <div className="mb-3">
                                                <label className="form-label">Cliente Asociado</label>
                                                <input type="text" name='clienteAsociado'
                                                    value={clienteAsociado}
                                                    onChange={(e) => handleOnChange(e)}
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    )}

                                    {tipoInventario === 'Equipo Cliente' && (
                                        <div className='col'>
                                            <div className="mb-3">
                                                <label className="form-label">Fecha Mantenimiento Programado</label>
                                                <input type="date" name='fechaMantenimientoProgramado'
                                                    value={fechaMantenimientoProgramado}
                                                    onChange={(e) => handleOnChange(e)}
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    )}

                                    {tipoInventario === 'Equipo Cliente' && (
                                        <div className='col'>
                                            <div className="mb-3">
                                                <label className="form-label">Detalles del Mantenimiento</label>
                                                <textarea name='detallesMantenimiento'
                                                    value={detallesMantenimiento}
                                                    onChange={(e) => handleOnChange(e)}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {tipoInventario === 'Rack Telecomunicaciones' && (
                                        <div className='col'>
                                            <div className="mb-3">
                                                <label className="form-label">Cliente de Rack</label>
                                                <input type="text" name='clienteAsociado'
                                                    value={clienteAsociado}
                                                    onChange={(e) => handleOnChange(e)}
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    )}

                                    {tipoInventario === 'Proyecto Web' && (
                                        <>
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
                                                        className="form-control" />
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-3">
                                                    <label className="form-label">URL del Proyecto</label>
                                                    <input type="url" name='urlProyecto'
                                                        value={urlProyecto}
                                                        onChange={(e) => handleOnChange(e)}
                                                        className="form-control" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {/* Campo Estado Activo/Inactivo */}
                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label className="form-label">Estado del Equipo en Servicio</label>
                                            <select 
                                                className="form-select" 
                                                onChange={(e) => handleOnChange(e)}
                                                name="activo"
                                                required
                                                value={activo.toString()}>
                                                <option value="true">✅ Activo (En Servicio)</option>
                                                <option value="false">❌ Inactivo (Fuera de Servicio)</option>
                                            </select>
                                            <small className="text-muted">
                                                Indica si el equipo está en uso o fuera de servicio (guardado, reemplazado, etc.)
                                            </small>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mb-3">
                                            <label className="form-label">Seguimiento del Equipo</label>
                                            <textarea 
                                                className="form-control" 
                                                name="seguimiento"
                                                rows="3"
                                                value={seguimiento}
                                                onChange={(e) => handleOnChange(e)}
                                                placeholder={activo ? 
                                                    "Ej: Equipo en circulación, funcionando correctamente en la oficina del gerente..." : 
                                                    "Ej: Equipo guardado en bodega, reemplazado por modelo más nuevo..."
                                                }
                                            ></textarea>
                                            <small className="text-muted">
                                                {activo ? 
                                                    "Describe la ubicación actual y funciones del equipo activo" : 
                                                    "Describe el motivo del estado inactivo y ubicación del equipo guardado"
                                                }
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='row'>
                                        <div className='col'>
                                            <button className="btn btn-primary">Guardar</button>
                                            </div>
                                        </div>
                    </form>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    )
}
