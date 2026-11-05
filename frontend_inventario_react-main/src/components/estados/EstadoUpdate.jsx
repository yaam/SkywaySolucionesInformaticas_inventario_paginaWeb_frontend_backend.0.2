import React, { useEffect, useState } from 'react'
import { getEstadoEquipoId, editarEstadosEquipos} from '../../services/estadoEquipoService';
import {useParams} from 'react-router-dom';
import swal from  'sweetalert2';


export const UsuarioUpdate = () => {
    const [estado, setEstado] = useState([]);
    const{EstadoId = ' '} = useParams();
    const[valoresForm, setValoresForm]= useState({});
    const {nombre = ''}=valoresForm;
    
    const listarEstado = async () =>{
        try {
            const {data} = await get();
            setEstado(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect( ()=>{
        listarEstado();
    }, []);

    const getEstadosEquipos = async () =>{
        try {
            swal.fire({
                allowOutsideClick: false,
                text: 'cargando...'
            })
            swal.showLoading();
            const{data} = await getEstadoEquipoId(estadoId)
            setEstado(data);
            swal.close();
        } catch (error) {
          console.log(error);
          swal.close();
        }
       }

       useEffect(()=>{
        getEstadosEquipos();
       }, [estadoId]);

       useEffect(()=>{
        setValoresForm({
            nombre: estado.nombre,
            estado: estado.estado,
        });
       },[usuarios]);

       const handleOnChange = ({ target}) =>{
        const{ name, value} = target
        setValoresForm ({...valoresForm, [name]: value }); // spread
      }
      const handleOnSubmit = async (e) =>{
        e.preventDefault();
        const estado = {
          nombre, 
          estado:{
              _id: estado
          }
      }
      try {
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const { data} = await editarEstadosEquipos(estadoId, estado);
        console.log(data);
        swal.close();
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
                  <h5 className='card-title'>Detalle usuario</h5>
            </div>
            <div className='card-body'>
                <div className='row'>
                  <div className='col-md-8'>
                  <form onSubmit ={(e) => handleOnSubmit(e)}>
                            <div className='row'>
                                <div className='col'>
                                    <div className="mb-3">
                                          <label className="form-label">Nombre</label>
                                          <input type="text" name='nombre' 
                                                required
                                                value={nombre}
                                                onChange ={ (e) => handleOnChange(e)}
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
                                        <div className='row'>
                                              <div className='col'>{
                                                <button className="btn btn-primary">Guardar</button>
                                              }
                                                  
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
