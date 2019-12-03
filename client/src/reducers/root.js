import { combineReducers } from 'redux';
import session from './session/session';
import errors from './errors/errors';
import surveys from './surveys/surveys';
import survey from './surveys/survey';
import employees from './employees/employees';
import questions from './questions/questions';
import authoredSurveys from "./surveys/authoredSurveys";

export default combineReducers({
    session, 
    errors,
    surveys,
    survey,
    employees,
    questions,
    authoredSurveys
});