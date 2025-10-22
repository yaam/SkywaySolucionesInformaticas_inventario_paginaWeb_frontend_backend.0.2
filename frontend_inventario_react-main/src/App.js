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


const App = () => {
    return <Router>
        <Header/>
        <Switch>
            <Route exact path='/' component= {Activos} />
            <Route exact path='/activos' component= {Activos} />
            <Route exact path='/inventarios' component= {InventarioView} />
            <Route exact path='/usuarios' component= {UsuarioView} />
            <Route exact path='/marcas' component= {MarcaView} />
            <Route exact path='/estados' component= {EstadoView} />
            <Route exact path='/tipos' component= {TipoView} />
            <Route exact path='/inventarios/edit/:inventarioId' component={InventarioUpdate} />
            <Route exact path='/agendar-visita' component={AgendarVisita} />
            <Route exact path='/contacto' component={Contacto} />
            <Route exact path='/servicios' component={Servicios} />
            <Route exact path='/gestion-visitas' component={GestionVisitas} />
            <Redirect to='/activos' />
        </Switch>

    </Router>

}

export {
    App
}