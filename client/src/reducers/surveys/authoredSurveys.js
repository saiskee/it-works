import {GET_MANAGER_AUTHORED_SURVEYS} from "../../actions/analytics";

const _nullauthoredSurveys = {surveys: []}

export default (state = _nullauthoredSurveys, { type, authoredSurveys }) => {
  Object.freeze(state);
  switch (type) { //action.type
    case GET_MANAGER_AUTHORED_SURVEYS:
      return authoredSurveys;
    default:
      return state;
  }
};