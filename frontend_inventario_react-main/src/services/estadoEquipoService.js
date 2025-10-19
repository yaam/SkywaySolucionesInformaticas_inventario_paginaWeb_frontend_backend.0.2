import  { axiosInstance } from '../helpers/axios-config';

const getEstadosEquipos = () =>{
    return axiosInstance.get('estadoEquipo', {
        headers:{
            'content-type':'application/json'
        }
    })
}

// todo: crear, actualizar, listar por id

const crearEstadosEquipos = (data) =>{
    return axiosInstance.post('estadoEquipo',data,{
        headers:{
            'content-type':'application/json'
        }
    })
}

const editarEstadosEquipos = (estadoId,data) =>{
    return axiosInstance.put(`estadoEquipo/${estadoId}`,data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

const getEstadoEquipoId = (estadoId)=>{
    return axiosInstance.get(`estadoEquipo/${estadoId}`, {
        headers: {
            'Content-type': 'application/json'
        }
    })
}
export{
    getEstadosEquipos,crearEstadosEquipos,editarEstadosEquipos, getEstadoEquipoId}