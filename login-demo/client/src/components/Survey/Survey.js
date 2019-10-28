import React, {Component} from "react";
import * as SurveyJS from "survey-react";

import { connect } from "react-redux";
import { logout } from "../../actions/session";

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

import * as widgets from "surveyjs-widgets";

import "icheck/skins/square/blue.css";
window["$"] = window["jQuery"] = $;
require("icheck");

SurveyJS.StylesManager.applyTheme("default");

widgets.icheck(SurveyJS, $);
widgets.select2(SurveyJS, $);
widgets.inputmask(SurveyJS);
widgets.jquerybarrating(SurveyJS, $);
widgets.jqueryuidatepicker(SurveyJS, $);
widgets.nouislider(SurveyJS);
widgets.select2tagbox(SurveyJS, $);
widgets.signaturepad(SurveyJS);
widgets.sortablejs(SurveyJS);
widgets.ckeditor(SurveyJS);
widgets.autocomplete(SurveyJS, $);
widgets.bootstrapslider(SurveyJS);


const mapStateToProps = ({ session }) => ({
  session
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

class Survey extends Component{
    
    state = {
        survey_model :  {},
        show : false,
    }

    componentDidMount(){
        $.ajax({
            url: 'http://localhost:4000/api/users/survey',
            type: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
          })
          .done( (data) => {
            let json = {title: `Survey for ${this.props.session.fullName}`,
              showProgressBar: "top",
              ...JSON.parse(data)
            }
            this.setState({
              survey_model: new SurveyJS.Model(json),
              show: true
            }
            );
          })
    }

    onValueChanged(result){
        console.log(result.data)
    }

    onComplete(result){
        console.log(result.data);
    }

    render(){

        return (
            this.state.show && // Only show once AJAX received

            <div className="surveyjs">
                
                <SurveyJS.Survey 
                    model = {this.state.survey_model}
                    onComplete = {this.onComplete}
                    onValueChanged = {this.onValueChanged}
                />
            </div>
        )

    }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Survey);