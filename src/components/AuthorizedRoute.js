import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthorizedRoute = props => {
    const { path, children, authorized, component, exact } = props;
    const Component = component;
    return (
        <Route exact={exact} path={path}>
            {authorized ? children || <Component /> : <Redirect to="/" />}
        </Route>
    );
};

export default AuthorizedRoute;
