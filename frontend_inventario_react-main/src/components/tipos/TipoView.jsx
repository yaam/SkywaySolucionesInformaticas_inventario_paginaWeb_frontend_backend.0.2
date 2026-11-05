import React, {useState,useEffect} from 'react'
import { crearTiposEquipos, getTiposEquipos } from '../../services/tipoEquipoService'
import dayjs from 'dayjs';
import swal from  'sweetalert2';
 

export const TipoView = (handleOpenModal) => {

    const [formulario, setFormulario] = useState({});
    const [tiposEquipos, setTiposEquipos] = useState([]);
    const [, setEstados] = useState([]);
    const {nombre = '', estado, fechaCreacion, fechaActualizacion} = formulario;
    
    
    console.log(nombre);

    const listarTipoEquipo = async() =>{
      try{
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const {data} = await getTiposEquipos();
        console.log(data);
        setTiposEquipos(data);
        setEstados(data);
        swal.close();
      } catch (error){
        console.log(error);
        swal.close();
      }
    }
     useEffect(()=>{
      listarTipoEquipo();
    }, []);
  

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormulario({...formulario, [e.target.name]: e.target.value}) // spread
  }
  
  const handleOnSubmit = async(e) =>{
    e.preventDefault();
    console.log(formulario);
    setTiposEquipos([...tiposEquipos, formulario]);
    const formularios = {
      nombre, 
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
      const { data} = await crearTiposEquipos(formularios);
      console.log(data);
      swal.close();
      //handleOpenModal();
      listarTipoEquipo();
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
    <div className='sidebar-header'>
    <h3>Tipo de Equipos</h3>
    </div>
    <div className='container-fluid'>
    <div className='row'>
                <div className='col'>
                  <hr/>
                </div>  
      <form onSubmit={(e)=> handleOnSubmit(e)}>
        
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
                                                                <button className="btn btn-primary">Guardar</button>
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
                                                                            <th scope="col">Estado</th>
                                                                            <th scope="col">Fecha creac.</th>
                                                                            <th scope="col">Fecha act.</th>
                                                                            <th scope="col"></th>
                                                                          </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                          {
                                                                            tiposEquipos.map((tiposEquipo, index) => {
                                                                              return (
                                                                                <tr key={tiposEquipo._id}>
                                                                                  <th scope="row">{index + 1}</th>
                                                                                  <td>{tiposEquipo.nombre}</td>
                                                                                  <td>{tiposEquipo.estado}</td>
                                                                                  <td>{dayjs(tiposEquipo.fechaCreacion).format('YYYY-MM-DD')}</td>
                                                                                  <td>{dayjs(tiposEquipo.fechaActualizacion).format('YYYY-MM-DD')}</td>
                                                                                  <td>
                                                                                  <button type="button" class="btn btn-success">Editar</button>
                                                                                  </td>
                                                                                </tr>
                                                                              )
                                                                            })
                                                                          }
                                                                        </tbody>
                                                                        </table>
                                                        </div>      
                                                      </div>
                          
              
            
        </form>
        </div>
    </div>
  </div>
  )
}