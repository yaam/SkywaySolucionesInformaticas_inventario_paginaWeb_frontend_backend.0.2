import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { estaAutenticado } from '../../helpers/auth';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (estaAutenticado()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
);
