const CLAVE_TOKEN = 'skywayAdminToken';

const leerExpiracion = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.exp * 1000;
    } catch (error) {
        return 0;
    }
};

export const obtenerToken = () => {
    const token = sessionStorage.getItem(CLAVE_TOKEN);
    if (token && leerExpiracion(token) > Date.now()) return token;
    sessionStorage.removeItem(CLAVE_TOKEN);
    return null;
};

export const guardarToken = (token) => sessionStorage.setItem(CLAVE_TOKEN, token);
export const cerrarSesion = () => sessionStorage.removeItem(CLAVE_TOKEN);
export const estaAutenticado = () => Boolean(obtenerToken());
