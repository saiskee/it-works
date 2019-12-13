import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";

const mapStateToProps = ({ session: { userId, permRole} }) => ({
  loggedIn: Boolean(userId),
  manager: Boolean(permRole === 'manager')
});

const Auth = ({ loggedIn, path, component: Component }) => (
    <Route
      path={path}
      render={props => (
        loggedIn ?
        <Redirect to='/dashboard' /> :
        <Component {...props} />
      )}
    />
  );
  
const Protected = ({ loggedIn, path, component: Component }) => (
<Route
    path={path}
    render={props => (
    loggedIn ?
    <Component {...props} /> :
    <Redirect to='/login' />
    )}
/>
);

const Manager = ({ manager, loggedIn, path, component: Component}) => (
    <Route path={path}
    render={props => (manager ?
    <ProtectedRoute path={path} component={Component} /> : <Redirect to={'/dashboard'}/>)
    }
    />
)

export const AuthRoute = withRouter(
connect(mapStateToProps)(Auth)
);
export const ProtectedRoute = withRouter(
connect(mapStateToProps)(Protected)
);

export const ManagerRoute = withRouter(
    connect(mapStateToProps)(Manager)
);