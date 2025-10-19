import  { axiosInstance } from '../helpers/axios-config';

const getUsuarios = () =>{
    return axiosInstance.get('usuario', {
        headers:{
            'content-type':'application/json'
        }
    })
}

// todo: crear, actualizar, listar por id

const crearUsuarios = (data) =>{
    return axiosInstance.post('usuario', data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

const editarUsuarios = (usuarioId,data) =>{
    return axiosInstance.put(`usuario/${usuarioId}`, data,  {
        headers:{
            'content-type':'application/json'
        }
    })
}

const getUsuariosId = (usuarioId)=>{
    return axiosInstance.get(`usuario/${usuarioId}`, {
        headers: {
            'Content-type': 'application/json'
        }
    })
}
export{
    getUsuarios,crearUsuarios,editarUsuarios,getUsuariosId
}