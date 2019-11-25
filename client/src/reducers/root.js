import { combineReducers } from 'redux';
import session from './session/session';
import errors from './errors/errors';
import surveys from './surveys/surveys';
import survey from './surveys/survey';
import builder from './builder/builder';

export default combineReducers({
    session, 
    errors,
    surveys,
    survey,
    builder
});