import {
    RECEIVE_CURRENT_USER,
    LOGOUT_CURRENT_USER
  } from "../../actions/session";

// Default session value when logged out
const _nullSession = { userId: null, username: null }
                                    // this is the action object
export default (state = _nullSession, { type, user }) => {
    Object.freeze(state);
    switch (type) { //action.type
        case RECEIVE_CURRENT_USER:
            return user;
        case LOGOUT_CURRENT_USER:
            return _nullSession;
        default:
        return state;
    }
};