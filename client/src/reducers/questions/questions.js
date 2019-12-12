import {GET_QUESTIONS_AUTHORED_BY_USER} from "../../actions/questions";

// Default session value when logged out
const _nullQuestions = []

// this is the action object
export default (state = _nullQuestions, { type, questions }) => {

  Object.freeze(state);

  switch (type) { //action.type
    case GET_QUESTIONS_AUTHORED_BY_USER:
      return questions;
      break;
    default:
      return state;
  }

};