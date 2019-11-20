import {
  GET_CURRENT_USER_SURVEYS
} from "../../actions/survey";
import {GET_MANAGER_AUTHORED_SURVEYS} from "../../actions/analytics";

// Default session value when logged out
const _nullSurveys = { surveys: [] }

// this is the action object
export default (state = _nullSurveys, { type, surveys }) => {
  Object.freeze(state);
  switch (type) { //action.type
    case GET_CURRENT_USER_SURVEYS:
    case GET_MANAGER_AUTHORED_SURVEYS:
      return surveys;
      break;
    default:
    return state;
  }
};