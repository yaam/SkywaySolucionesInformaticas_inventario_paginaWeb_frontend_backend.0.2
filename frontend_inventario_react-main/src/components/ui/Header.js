import React from 'react'
import { NavLink } from 'react-router-dom';

export const Header = () => {
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
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/activos">Activos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/usuarios">Usuarios</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/marcas">Marcas</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/estados">Estados</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/tipos">Tipos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/agendar-visita">Agendar Visita</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/contacto">Contacto</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/servicios">Servicios</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName='active' exact aria-current="page" to="/gestion-visitas">Gestión Visitas</NavLink>
        </li>
      </ul>    </div>
  </div>
</nav>
  )
}