import React, { useEffect, useState } from 'react'
import { getUsuariosId, editarUsuarios} from '../../services/usuarioService';
import {useParams} from 'react-router-dom';
import swal from  'sweetalert2';


export const UsuarioUpdate = () => {
    const [usuarios, setUsuarios] = useState([]);
    const{usuarioId = ' '} = useParams();
    const[valoresForm, setValoresForm]= useState({});
    const {nombre = '', email = '', estado}=valoresForm;
    
    const listarUsuarios = async () =>{
        try {
            const {data} = await getUsuarios();
            setUsuarios(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect( ()=>{
        listarUsuarios();
    }, []);

    const getUsuarios = async () =>{
        try {
            swal.fire({
                allowOutsideClick: false,
                text: 'cargando...'
            })
            swal.showLoading();
            const{data} = await getUsuariosId(usuarioId)
            setUsuarios(data);
            swal.close();
        } catch (error) {
          console.log(error);
          swal.close();
        }
       }

       useEffect(()=>{
        getUsuarios();
       }, [usuarioId]);

       useEffect(()=>{
        setValoresForm({
            nombre: usuarios.nombre,
            email: usuarios.email,
            estado: usuarios.estado,
        });
       },[usuarios]);

       const handleOnChange = ({ target}) =>{
        const{ name, value} = target
        setValoresForm ({...valoresForm, [name]: value }); // spread
      }
      const handleOnSubmit = async (e) =>{
        e.preventDefault();
        const usuario = {
          nombre, email, 
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
        const { data} = await editarUsuarios(usuarioId, usuario);
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
                                <div className='col'>
                                    <div className="mb-3">
                                          <label className="form-label">Email</label>
                                          <input type="text" name='email' 
                                          required
                                          value={email} 
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
