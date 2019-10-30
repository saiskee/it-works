import React, {Component} from "react";
import {Route} from 'react-router-dom';
import {AuthRoute, ProtectedRoute} from "../../util/router";
import Survey from "../Survey"
import Login from "../Login"
import Register from "../Register"
import Dashboard from "../Dashboard/Dashboard"
import SurveyBuilder from "../SurveyBuilder/SurveyBuilder"
import {createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {green, pink} from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: pink
  }
})



class App extends Component {

  render() {


    return (
        <div className="App">
          <CssBaseline />
          <AuthRoute path="/login" exact component={Login}/>
          <AuthRoute path="/register" exact component={Register}/>
          <MuiThemeProvider theme={theme}>
          <ProtectedRoute path="/dashboard" exact component={Dashboard}/>
          </MuiThemeProvider>
          <ProtectedRoute path="/survey/:surveyId" component={Survey}/>
          <Route path="/builder" component={SurveyBuilder} />

        </div>
    );
  }
}

export default App;
