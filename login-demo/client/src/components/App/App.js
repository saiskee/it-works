import React, { Component } from "react";
import { AuthRoute, ProtectedRoute } from "../../util/router";
import Survey from "../Survey"
import Login from "../Login"
import Register from "../Register"
import Dashboard from "../Dashboard/Dashboard"

class App extends Component {

  render() {
    
    
    return (
      <div className="App">
        <AuthRoute path="/login" exact component={Login} />
        <AuthRoute path="/register" exact component={Register} />
        <ProtectedRoute path="/dashboard" exact component ={Dashboard} />
        <ProtectedRoute path="/survey" exact component={Survey} />
      </div>
    );
  }
}

export default App;
