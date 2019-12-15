import { GET_SURVEY_WITH_ID } from "../../actions/survey";
import {GET_SURVEY_WITH_RESPONSES} from "../../actions/analytics";

// Default session value when logged out
const _nullSurvey = { survey: {survey_template: {}}}

// this is the action object
export default (state = _nullSurvey, { type, survey }) => {

  Object.freeze(state);

  switch (type) { //action.type
    case GET_SURVEY_WITH_ID:
    case GET_SURVEY_WITH_RESPONSES:
      return survey;
    default:
      return state;
  }

};