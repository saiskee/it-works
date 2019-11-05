import * as apiUtil from "../util/session";
import {receiveErrors} from "./error";

export const GET_SURVEY_WITH_ID = "GET_SURVEY_WITH_ID";
export const GET_CURRENT_USER_SURVEYS = "GET_CURRENT_USER_SURVEYS";

const getSurveyWithId = survey => ({
  type: GET_SURVEY_WITH_ID,
  survey: survey
});

const getCurrentUserSurveys = (surveys) => ({
  type: GET_CURRENT_USER_SURVEYS,
  surveys: surveys
})

export const getSurvey = surveyId => async dispatch => {
  const response = await apiUtil.getSurvey(surveyId);
  const data = await response.json();
  if (response.ok){
    return dispatch(getSurveyWithId(data));
  }else{
    return dispatch(receiveErrors(data));
  }

}

export const getSurveys = user => async dispatch => {
  const response = await apiUtil.getSurveys(user);
  const data = await response.json();

  if (response.ok){
    return dispatch(getCurrentUserSurveys(data));
  }
  return dispatch(receiveErrors(data));
}