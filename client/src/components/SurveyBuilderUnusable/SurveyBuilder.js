import React, {Component} from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import {connect} from 'react-redux';

import $ from "jquery";
import {FormControl, Select, MenuItem} from "@material-ui/core";
import {getEmployees} from "../../actions/employee";

const mapStateToProps = ({employees}) => ({
  employees
})

const mapDispatchToProps = dispatch => ({
  getEmployees: (component) => dispatch(getEmployees(component))
})

SurveyJSCreator.StylesManager.applyTheme("default");

class SurveyBuilder extends Component {

  saveSurvey = () => {
    $.ajax('/api/survey', {
      method: 'POST',
      data: JSON.stringify(this.surveyCreator.JSON),
      contentType: 'application/json'
    })
  }

  componentDidMount() {
    this.surveyCreator = new SurveyJSCreator.SurveyCreator("surveyCreatorContainer")
    this.surveyCreator.saveSurveyFunc = this.saveSurvey;
    this.props.getEmployees();
  }

  render() {
    const {employees} = this.props;
    return (
        <>
          <div id={"surveyCreatorContainer"}/>
          <FormControl>
            <Select onOpen={getEmployees}>
              {employees.length > 0 && employees.map(employee => <MenuItem
                  value={employee._id}>{employee.fullName}</MenuItem>)}
            </Select>
          </FormControl>
        </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBuilder);