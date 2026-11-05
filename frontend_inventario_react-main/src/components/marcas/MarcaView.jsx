import React, {useState,useEffect} from 'react'
import { getMarcas,crearMarcas } from '../../services/marcaService'
import dayjs from 'dayjs';
import swal from  'sweetalert2';
 

export const MarcaView = (handleOpenModal) => {

    const [formulario, setFormulario] = useState({});
    const [marcas, setMarcas] = useState([]);
    const [, setEstados] = useState([]);
    const {nombre = '', estado, fechaCreacion, fechaActualizacion} = formulario;
    
    
    console.log(nombre);

    const listarMarca = async() =>{
      try{
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const {data} = await getMarcas();
        console.log(data);
        setMarcas(data);
        setEstados(data);
        swal.close();
      } catch (error){
        console.log(error);
        swal.close();
      }
    }
     useEffect(()=>{
      listarMarca();
    }, []);
  

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormulario({...formulario, [e.target.name]: e.target.value}) // spread
  }
  
  const handleOnSubmit = async(e) =>{
    e.preventDefault();
    console.log(formulario);
    setMarcas([...marcas, formulario]);
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
      const { data} = await crearMarcas(formularios);
      console.log(data);
      swal.close();
      //handleOpenModal();
      listarMarca();
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
    <h3>Marcas</h3>
    </div>
    <div className='container-fluid'>
    <div className='row'>
                <div className='col'>
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
                                                                            marcas.map((marca, index) => {
                                                                              return (
                                                                                <tr key={marca._id}>
                                                                                  <th scope="row">{index + 1}</th>
                                                                                  <td>{marca.nombre}</td>
                                                                                  <td>{marca.estado}</td>
                                                                                  <td>{dayjs(marca.fechaCreacion).format('YYYY-MM-DD')}</td>
                                                                                  <td>{dayjs(marca.fechaActualizacion).format('YYYY-MM-DD')}</td>
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
        </div> 
        </form>
        </div>
    </div>
  </div>
  )
}