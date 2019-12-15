import React, {Component} from "react";
import {Switch} from 'react-router-dom';
import {AuthRoute, ProtectedRoute, ManagerRoute} from "../../util/router";
import {Survey, Login, Dashboard, Register, ManagerDashboard, SurveyAnalytics, SurveyBuilderPage, NavBar} from "../"
import {MuiThemeProvider} from "@material-ui/core";
import theme from '../../theme';
import Paper from "@material-ui/core/Paper";


class App extends Component {

  render() {

    return (
        <Paper className="App" style={{border: 'none', boxShadow: 'none'}}>
          <Switch>
            <AuthRoute path="/" exact component={Login} />
            <AuthRoute path="/login" exact component={Login}/>
            <AuthRoute path="/register" exact component={Register}/>
            <ProtectedRoute path="/survey/:surveyId" exact component={Survey}/>

            <MuiThemeProvider theme={theme}>
              <NavBar/>
            </MuiThemeProvider>
          </Switch>

          <Switch>
          <MuiThemeProvider theme={theme}>
            <ManagerRoute path="/builder" exact component={SurveyBuilderPage}/>
            <ProtectedRoute path="/dashboard" exact component={Dashboard}/>
            <ManagerRoute path="/managerdashboard" exact component={ManagerDashboard}/>
            <ManagerRoute path="/analytics/:surveyId" exact component={SurveyAnalytics}/>
          </MuiThemeProvider>
          </Switch>


        </Paper>
    );
  }
}

export default App;
