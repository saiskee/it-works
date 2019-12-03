import React, {Component} from "react";
import {Route, Switch} from 'react-router-dom';
import {AuthRoute, ProtectedRoute} from "../../util/router";
import Survey from "../Survey";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard/Dashboard";
import SurveyBuilder from "../SurveyBuilderUnusable/SurveyBuilder";
import ManagerDashboard from "../ManagerDashboard/ManagerDashboard";
import {CssBaseline, MuiThemeProvider} from "@material-ui/core";
import theme from '../../theme';
import SurveyAnalytics from "../SurveyAnalytics/SurveyAnalytics";
import NavBar from "../NavBar/NavBar";
import SurveyBuilderPage from "../SurveyBuilderPage/SurveyBuilderPage";
import EmployeeSelector from "../EmployeeSelector/EmployeeSelector";


class App extends Component {

  render() {

    return (
        <div className="App">
          {/*<CssBaseline/>*/}
          <Switch>
            <AuthRoute path="/login" exact component={Login}/>
            <AuthRoute path="/register" exact component={Register}/>
            <ProtectedRoute path="/survey/:surveyId" exact component={Survey}/>

            <MuiThemeProvider theme={theme}>
              <NavBar/>
            </MuiThemeProvider>
          </Switch>


          <MuiThemeProvider theme={theme}>
            <ProtectedRoute path="/builder" exact component={SurveyBuilderPage}/>
            <ProtectedRoute path="/dashboard" exact component={Dashboard}/>
            <ProtectedRoute path="/managerdashboard" exact component={ManagerDashboard}/>
            <ProtectedRoute path="/analytics/:surveyId" exact component={SurveyAnalytics}/>
          </MuiThemeProvider>
          <Route path="/oldBuilder" component = {SurveyBuilder} />
          <Route path="/selector" component={EmployeeSelector}/>


        </div>
    );
  }
}

export default App;
