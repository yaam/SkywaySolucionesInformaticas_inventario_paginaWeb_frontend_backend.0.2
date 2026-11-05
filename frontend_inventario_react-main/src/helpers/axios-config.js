import axios from 'axios';
import { obtenerToken, cerrarSesion } from './auth';

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_BASE_URL || 'http://localhost:4001'
});

axiosInstance.interceptors.request.use((config) => {
    const token = obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const esLogin = error.config && error.config.url && error.config.url.includes('api/auth/login');
        if (error.response && error.response.status === 401 && !esLogin) {
            cerrarSesion();
            window.location.assign('/login');
        }
        return Promise.reject(error);
    }
);

export{
    axiosInstance
}
