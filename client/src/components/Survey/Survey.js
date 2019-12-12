import React, {Component} from "react";
import * as SurveyJS from "survey-react";

import {connect} from "react-redux";
import {logout} from "../../actions/session";
import {getSurvey} from "../../actions/survey";

import "survey-react/survey.css";
import "bootstrap/dist/css/bootstrap.css"

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";


import "icheck/skins/square/blue.css";

window["$"] = window["jQuery"] = $;

SurveyJS.StylesManager.applyTheme("default");

const mapStateToProps = ({session, survey}) => ({
  session,
  survey
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  getSurvey: (surveyId) => dispatch(getSurvey(surveyId))
});

class Survey extends Component {


  componentDidMount() {
    const {surveyId} = this.props.match.params;
    this.props.getSurvey(surveyId);

  }

  onValueChanged(result) {
    // console.log(result.data)
  }

  onComplete = (result) => {
    console.log(result);
    result = result.data;
    console.log(result);
    const {pages} = this.props.survey.survey.survey_template;
    pages.forEach((page) => {
      const {elements} = page;
      elements.forEach((question) => {
        if (result.hasOwnProperty(question.name)){
          Object.defineProperty(result, question.question_id,
              Object.getOwnPropertyDescriptor(result, question.name));
          delete result[question.name];
        }
      });
    });
    console.log(result)

    $.ajax('/api/survey/'+this.props.match.params.surveyId, {
      method: 'POST',
      data: JSON.stringify(result),
      contentType: 'application/json'
    })
  }

  render() {
    const survey_template = this.props.survey.survey.survey_template;
    console.log("TEMPLATE", survey_template);
    const {fullName} = this.props.session;
    let surveyJSON = {
      title: `Survey for ${fullName}`,
      showProgressBar: "top",
      ...survey_template
    }

    window.survey_template = survey_template;
    console.log("JSON", surveyJSON);

    return (

        <div className="surveyjs">
          {
            Object.keys(survey_template).length > 0 &&
            <SurveyJS.Survey
                json={surveyJSON}
                onComplete={this.onComplete}
                onValueChanged={this.onValueChanged}
            />
          }
        </div>
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Survey);