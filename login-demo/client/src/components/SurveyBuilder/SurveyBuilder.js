import React, {Component} from "react";
import * as SurveyJSCreator from "survey-creator";

import $ from "jquery";


SurveyJSCreator.StylesManager.applyTheme("default");

class SurveyBuilder extends Component{

  saveSurvey = () => {
    console.log(JSON.stringify(this.surveyCreator.JSON));
    $.ajax('http://localhost:3000/api/users/survey', {
      method: 'POST',
      data: JSON.stringify(this.surveyCreator.JSON),
      contentType:'application/json'
    })
  }

  componentDidMount() {
    this.surveyCreator = new SurveyJSCreator.SurveyCreator("surveyCreatorContainer")
    this.surveyCreator.saveSurveyFunc = this.saveSurvey;
  }

  render(){

    return (

        <div id={"surveyCreatorContainer"}/>

        )
  }
}

export default SurveyBuilder;