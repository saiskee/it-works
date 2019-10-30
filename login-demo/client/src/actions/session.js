import * as apiUtil from '../util/session';
import { receiveErrors } from './error';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

// This entire function is called the action creator,
// The purpose of the action creator is to return the 'action' object, as below
const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER, //action type
  user: user // action payload
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

export const login = user => async dispatch => {
    const response = await apiUtil.login(user);
    const data = await response.json();

  if (response.ok) {
      return dispatch(receiveCurrentUser(data));
    }
    return dispatch(receiveErrors(data));
  };

  export const signup = user => async dispatch => {
    const response = await apiUtil.signup(user);
    const data = await response.json();
    
    if (response.ok) {
      return dispatch(receiveCurrentUser(data));
    }
    return dispatch(receiveErrors(data));
  };
  
  export const logout = () => async dispatch => {
    const response = await apiUtil.logout();
    const data = await response.json();
  if (response.ok) {
      return dispatch(logoutCurrentUser());
    }
    return dispatch(receiveErrors(data));
  };

