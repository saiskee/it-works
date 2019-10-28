import { combineReducers } from 'redux';
import session from './session/session';
import errors from './errors/errors';
import surveys from './surveys/surveys'

export default combineReducers({
    session, 
    errors,
    surveys
});