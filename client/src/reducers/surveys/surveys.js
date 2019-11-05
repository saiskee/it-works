import {
  GET_CURRENT_USER_SURVEYS
} from "../../actions/survey";

// Default session value when logged out
const _nullSurveys = { surveys: [] }

// this is the action object
export default (state = _nullSurveys, { type, surveys }) => {
  Object.freeze(state);
  switch (type) { //action.type
    case GET_CURRENT_USER_SURVEYS:
      return surveys;

    default:
    return state;
  }
};