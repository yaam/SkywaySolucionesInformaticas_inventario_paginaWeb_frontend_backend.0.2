import React from 'react'
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { estaAutenticado, cerrarSesion } from '../../helpers/auth';

export const Header = () => {
  useLocation();
  const history = useHistory();
  const autenticado = estaAutenticado();
  const salir = () => {
    cerrarSesion();
    history.push('/login');
  };
  const adminOnly = (item) => (autenticado ? item : null);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/activos">
      <img src="/logo_nuevo_Editada.png?v=3" alt="Skyway" height="30" className="d-inline-block align-text-top me-2" />
      <NavLink className="text-white text-decoration-none" to="/inventarios">Soluciones Informáticas</NavLink>
    </NavLink>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/activos">Activos</NavLink>
        </li>
        )}
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/usuarios">Usuarios</NavLink>
        </li>
        )}
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/marcas">Marcas</NavLink>
        </li>
        )}
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/estados">Estados</NavLink>
        </li>
        )}
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/tipos">Tipos</NavLink>
        </li>
        )}
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/agendar-visita">Agendar Visita</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/contacto">Contacto</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/servicios">Servicios</NavLink>
        </li>
        {adminOnly(
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/gestion-visitas">Gestión Visitas</NavLink>
        </li>
        )}
      </ul>
      <div className="d-flex">
        {autenticado
          ? <button type="button" className="btn btn-outline-light btn-sm" onClick={salir}>Salir</button>
          : <NavLink className="btn btn-outline-light btn-sm" to="/login">Ingresar</NavLink>}
      </div>
    </div>
  </div>
</nav>
  )
}