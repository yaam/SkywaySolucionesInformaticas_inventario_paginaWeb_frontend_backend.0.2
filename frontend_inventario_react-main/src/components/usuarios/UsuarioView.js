import React, {useState,useEffect} from 'react'
import { getUsuarios,crearUsuarios} from '../../services/usuarioService'
import {UsuarioUpdate} from './UsuarioUpdate';
import swal from  'sweetalert2';
import dayjs from 'dayjs';




export const UsuarioView = (handleOpenModal) => {
  
    const [formulario, setFormulario] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [, setEstados] = useState([]);
    const [openModal,] = useState(false);
    
    const {nombre = '', email= '', estado, fechaCreacion, fechaActualizacion} = formulario;
    
    
    console.log(nombre, email);

    const listarUsuario = async() =>{
      try{
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const {data} = await getUsuarios();
        console.log(data);
        setUsuarios(data);
        setEstados(data);
        swal.close();
      } catch (error){
        console.log(error);
        swal.close();
      }
    }
     useEffect(()=>{
      listarUsuario();
    }, []);
  

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormulario({...formulario, [e.target.name]: e.target.value}) // spread
  }
  
  
  const handleOnSubmit = async (e) =>{
    e.preventDefault();
    console.log(formulario);
    setUsuarios([...usuarios, formulario]);
    const formularios = {
      nombre,email, 
      estado:{
          _id: estado
      },
      fechaCreacion:{
          _id: fechaCreacion
      },
      fechaActualizacion:{
          _id: fechaActualizacion
      }
  }
  console.log(formularios);
  try {
      swal.fire({
          allowOutsideClick: false,
          text: 'cargando...'
      })
      swal.showLoading();
      const { data} = await crearUsuarios(formularios);
      console.log(data);
      swal.close();
      //handleOpenModal();
      listarUsuario();
  } catch (error) {
      console.log(error);
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
  <div >
    <div classNameName='sidebar-header'>
    <h3>Usuarios</h3>
    </div>
    <div classNameName='container-fluid'>
    <div classNameName='row'>
                <div classNameName='col'>
                  <hr/>
                </div>  
      <form onSubmit={(e)=> handleOnSubmit(e)}>
        <div className='container-fluid'>
                    <div className='row'>
                      <div className='col'>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                                <div className="col-sm-10">
                                  <input name='nombre' type='text' onChange={ (e) => handleOnChange(e)}
                                  value={nombre} className="form-control"/>
                                </div>
                        </div>
                      </div>      
                            <div className="col">
                              <div className="mb-3">
                                  <label  className="form-label">Email</label>
                                  <div className="col-sm-10">
                                    <input name='email' type="text" value={email} 
                                    onChange={(e) => handleOnChange(e)}
                                    className="form-control"/>
                                  </div>    
                              </div>
                            </div>
                                      <div className='col'>
                                                    <div className="mb-3">
                                                          <label className="form-label">Estado</label>
                                                          <select className="form-select" 
                                                          onChange ={ (e) => handleOnChange(e)}
                                                          name="estado"
                                                          required
                                                          value={estado}>
                                                            <option value="">--SELECIONE--</option>
                                                            <option value={"Activo"}>Activo</option>
                                                            <option value={"Inactivo"}>Inactivo</option>
                                                          </select>
                                                    </div>
                                      </div>
                    </div>
                                                                <div className='row'>
                                                                  <div className='col'>
                                                                  <button className="btn btn-primary"
                                                                  >Guardar</button>
                                                                  </div>
                                                                </div>
                                                                    <div className='col'>
                                                                            <hr/>
                                                                    </div> 
                                                                    <div className='row'>
                                                                      <div className='col'>
                                                                        <table className="table">
                                                                        <thead>
                                                                          <tr>
                                                                            <th scope="col">#</th>
                                                                            <th scope="col">Nombre</th>
                                                                            <th scope="col">Email</th>
                                                                            <th scope="col">Estado</th>
                                                                            <th scope="col">Fecha creac.</th>
                                                                            <th scope="col">Fecha act.</th>
                                                                            <th scope="col"></th>
                                                                          </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                          {
                                                                            usuarios.map((usuario, index) => {
                                                                              return (
                                                                                <tr key={usuario._id}>
                                                                                  <th scope="row">{index + 1}</th>
                                                                                  <td>{usuario.nombre}</td>
                                                                                  <td>{usuario.email}</td>
                                                                                  <td>{usuario.estado}</td>
                                                                                  <td>{dayjs(usuario.fechaCreacion).format('YYYY-MM-DD')}</td>
                                                                                  <td>{dayjs(usuario.fechaActualizacion).format('YYYY-MM-DD')}</td>
                                                                                  <td>
                                                                                  {
                                                                                        openModal ? <UsuarioUpdate
                                                                                                        handleOpenModal={handleOpenModal}
                                                                                                        listarUsuario={listarUsuario} />:
                                                                                                (<button type="button" className='btn btn-succes' onClick={handleOpenModal} >
                                                                                                Editar
                                                                                                </button>)
                                                                                      }
                                                                                  </td>
                                                                                </tr>
                                                                              )
                                                                            })
                                                                          }
                                                                        </tbody>
                                                                        </table>
            
                                                                      </div>      
                                                                    </div>
                          
              
            </div>
          
        </form>
      </div>
    </div>
  </div>
  )
}