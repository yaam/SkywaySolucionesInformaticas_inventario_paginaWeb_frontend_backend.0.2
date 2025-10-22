import {axiosInstance} from '../helpers/axios-config';

const getInventarios = () =>{
    return axiosInstance.get('/api/inventarios', {
        headers : {
            'Content-type': 'application/json'
        }
    });
}

const crearInventario = (data) =>{
    return axiosInstance.post('/api/inventarios', data, {
        headers : {
            'Content-type': 'application/json'
        }
    });
}

const editInventario = (inventarioId,data) =>{
    return axiosInstance.put(`/api/inventarios/${inventarioId}`, data, {
        headers : {
            'Content-type': 'application/json'
        }
    });
}

const getInventarioPorId = (inventarioId) =>{
    return axiosInstance.get(`/api/inventarios/${inventarioId}`, {
        headers : {
            'Content-type': 'application/json'
        }
    });
}

const eliminarInventario = (inventarioId) =>{
    return axiosInstance.delete(`/api/inventarios/${inventarioId}`, {
        headers : {
            'Content-type': 'application/json'
        }
    });
}

export{
    getInventarios, crearInventario, editInventario, getInventarioPorId, eliminarInventario
}