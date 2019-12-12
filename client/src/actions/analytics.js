import * as apiUtil from "../util/session";
import {receiveErrors} from "./error";

export const GET_MANAGER_AUTHORED_SURVEYS = "GET_MANAGER_AUTHORED_SURVEYS";
export const GET_SURVEY_WITH_RESPONSES = "GET_SURVEY_WITH_RESPONSES";

const getAuthoredSurveys = (authoredSurveys) => ({
  type: GET_MANAGER_AUTHORED_SURVEYS,
  authoredSurveys: authoredSurveys
});

const getSurveyWithResponses = survey => ({
  type: GET_SURVEY_WITH_RESPONSES,
  survey: survey
});

export const getSurveyAndResponses = surveyId => async dispatch => {
  const response = await apiUtil.getSurveyWithResponses(surveyId);
  const data = await response.json();
  if (response.ok){
    return dispatch(getSurveyWithResponses(data));
  }else{
    return dispatch(receiveErrors(data));
  }

};

export const getManagerAuthoredSurveys = () => async dispatch => {
  const response = await apiUtil.getManagerAuthoredSurveys();
  const data = await response.json();
  if (response.ok){
    return dispatch(getAuthoredSurveys(data));
  }
  return dispatch(receiveErrors(data));
}