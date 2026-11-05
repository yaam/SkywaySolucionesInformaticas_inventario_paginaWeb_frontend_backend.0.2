import React, { useEffect, useState } from 'react'
import { getMarcasId, editarMarcas, getMarcas} from '../../services/marcaService';
import {useParams} from 'react-router-dom';
import swal from  'sweetalert2';


export const UsuarioUpdate = () => {
    const [marca, setMarca] = useState([]);
    const{marcaId = ' '} = useParams();
    const[valoresForm, setValoresForm]= useState({});
    const {nombre = '', estado}=valoresForm;
    
    const listarMarca = async () =>{
        try {
            const {data} = await getMarcas();
            setMarca(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect( ()=>{
        listarMarca();
    }, []);

    const getMarca = async () =>{
        try {
            swal.fire({
                allowOutsideClick: false,
                text: 'cargando...'
            })
            swal.showLoading();
            const{data} = await getMarcasId(marcaId)
            setMarca(data);
            swal.close();
        } catch (error) {
          console.log(error);
          swal.close();
        }
       }

       useEffect(()=>{
        getMarca();
       }, [marcaId]);

       useEffect(()=>{
        setValoresForm({
            nombre: usuarios.nombre,
            estado: usuarios.estado,
        });
       },[marca]);

       const handleOnChange = ({ target}) =>{
        const{ name, value} = target
        setValoresForm ({...valoresForm, [name]: value }); // spread
      }
      const handleOnSubmit = async (e) =>{
        e.preventDefault();
        const marcas = {
          nombre, 
          estado :{
              _id: estado
          }
      }
      try {
        swal.fire({
            allowOutsideClick: false,
            text: 'cargando...'
        })
        swal.showLoading();
        const { data} = await editarMarcas(marcaId, marcas);
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
