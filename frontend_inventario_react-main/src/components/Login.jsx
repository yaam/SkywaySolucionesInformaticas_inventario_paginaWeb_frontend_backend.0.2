import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance } from '../helpers/axios-config';
import { guardarToken } from '../helpers/auth';

export const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            const { data } = await axiosInstance.post('/api/auth/login', { usuario, password });
            guardarToken(data.token);
            const destino = (location.state && location.state.from && location.state.from.pathname) || '/activos';
            history.replace(destino);
        } catch (err) {
            setError((err.response && err.response.data && err.response.data.mensaje) || 'No se pudo iniciar sesión');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 420 }}>
            <h2 className="text-center mb-4">Acceso administrador</h2>
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">Usuario</label>
                    <input id="usuario" className="form-control" autoComplete="username" required
                        value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input id="password" type="password" className="form-control" autoComplete="current-password" required
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
};
