import  { axiosInstance } from '../helpers/axios-config';

const getTiposEquipos = () =>{
    return axiosInstance.get('tipoEquipo', {
        headers:{
            'content-type':'application/json'
        }
    })
}
// todo: crear, actualizar, listar por id
const crearTiposEquipos = (data) =>{
    return axiosInstance.post('tipoEquipo', data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

const editarTiposEquipos = (tipoEquipoId, data) =>{
     return axiosInstance.put(`tipoEquipo/${tipoEquipoId}`,data, {
        headers:{
            'content-type':'application/json'
        }
    })
}


export{
    getTiposEquipos,crearTiposEquipos,editarTiposEquipos
}