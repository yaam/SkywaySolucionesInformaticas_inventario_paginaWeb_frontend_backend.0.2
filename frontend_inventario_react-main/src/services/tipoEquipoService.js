import  { axiosInstance } from '../helpers/axios-config';

const getTiposEquipos = () =>{
    return axiosInstance.get('api/tipos', {
        headers:{
            'content-type':'application/json'
        }
    })
}
// todo: crear, actualizar, listar por id
const crearTiposEquipos = (data) =>{
    return axiosInstance.post('api/tipos', data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

const editarTiposEquipos = (tipoEquipoId, data) =>{
     return axiosInstance.put(`api/tipos/${tipoEquipoId}`,data, {
        headers:{
            'content-type':'application/json'
        }
    })
}


export{
    getTiposEquipos,crearTiposEquipos,editarTiposEquipos
}