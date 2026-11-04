import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './components/ui/Header';
import { EstadoView } from './components/estados/EstadoView';
import { InventarioView } from './components/inventarios/InventarioView';
import { MarcaView } from './components/marcas/MarcaView';
import { TipoView } from './components/tipos/TipoView';
import { UsuarioView } from './components/usuarios/UsuarioView';
import { InventarioUpdate } from './components/inventarios/InventarioUpdate';
import { AgendarVisita } from './components/AgendarVisita';
import { Contacto } from './components/Contacto';
import { Servicios } from './components/Servicios';
import { Activos } from './components/Activos';
import { GestionVisitas } from './components/GestionVisitas';
import { Login } from './components/Login';
import { PrivateRoute } from './components/ui/PrivateRoute';


const App = () => {
    return <Router>
        <Header/>
        <Switch>
            <PrivateRoute exact path='/' component= {Activos} />
            <PrivateRoute exact path='/activos' component= {Activos} />
            <PrivateRoute exact path='/inventarios' component= {InventarioView} />
            <PrivateRoute exact path='/usuarios' component= {UsuarioView} />
            <PrivateRoute exact path='/marcas' component= {MarcaView} />
            <PrivateRoute exact path='/estados' component= {EstadoView} />
            <PrivateRoute exact path='/tipos' component= {TipoView} />
            <PrivateRoute exact path='/inventarios/edit/:inventarioId' component={InventarioUpdate} />
            <Route exact path='/agendar-visita' component={AgendarVisita} />
            <Route exact path='/contacto' component={Contacto} />
            <Route exact path='/servicios' component={Servicios} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/gestion-visitas' component={GestionVisitas} />
            <Redirect to='/activos' />
        </Switch>

    </Router>

}

export {
    App
}