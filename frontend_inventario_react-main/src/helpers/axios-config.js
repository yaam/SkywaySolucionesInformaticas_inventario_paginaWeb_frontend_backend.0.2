import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:4001'
});

export{
    axiosInstance
}