import React, {Component} from "react";
import {Route, Switch} from 'react-router-dom';
import {AuthRoute, ProtectedRoute} from "../../util/router";
import Survey from "../Survey";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard/Dashboard";
import SurveyBuilder from "../SurveyBuilder/SurveyBuilder";
import ManagerDashboard from "../ManagerDashboard/ManagerDashboard";
import {CssBaseline, MuiThemeProvider} from "@material-ui/core";
import theme from '../../theme';
import SurveyAnalytics from "../SurveyAnalytics/SurveyAnalytics";
import NavBar from "../NavBar/NavBar";


class App extends Component {

  render() {

    return (
        <div className="App">
          <CssBaseline />
          <Switch>
          <AuthRoute path="/login" exact component={Login}/>
          <AuthRoute path="/register" exact component={Register}/>
          <ProtectedRoute path="/survey/:surveyId" component={Survey}/>
          <MuiThemeProvider theme={theme}>
            <NavBar />
            <ProtectedRoute path="/dashboard" exact component={Dashboard}/>
            <ProtectedRoute path="/managerdashboard" component={ManagerDashboard}/>
            <ProtectedRoute path = "/analytics/:surveyId" component={SurveyAnalytics} />
            <ProtectedRoute path="/builder" component={SurveyBuilder} />
          </MuiThemeProvider>


          </Switch>
        </div>
    );
  }
}

export default App;
