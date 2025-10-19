import  { axiosInstance } from '../helpers/axios-config';

const getMarcas = () =>{
    return axiosInstance.get('marca', {
        headers:{
            'content-type':'application/json'
        }
    })
}

// todo: crear, actualizar, listar por id
const crearMarcas = (data) =>{
    return axiosInstance.post('marca', data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

const editarMarcas = (marcaId, data) =>{
    return axiosInstance.put(`marca/${marcaId}`, data, {
        headers:{
            'content-type':'application/json'
        }
    })
}

export{
    getMarcas,crearMarcas,editarMarcas
}