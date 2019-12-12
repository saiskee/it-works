import * as apiUtil from "../util/session";
import {receiveErrors} from "./error";

export const GET_QUESTIONS_AUTHORED_BY_USER = "GET_QUESTIONS_AUTHORED_BY_USER";

const getAuthoredQuestions = (questions) => ({
  questions: questions,
  type: GET_QUESTIONS_AUTHORED_BY_USER
});

export const getQuestions = () => async dispatch => {
  const response = await apiUtil.getQuestions();
  const data = await response.json();
  if (response.ok){
    return dispatch(getAuthoredQuestions(data));
  }else{
    return dispatch(receiveErrors(data));
  }
}