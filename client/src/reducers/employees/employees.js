import { GET_EMPLOYEES} from "../../actions/employee";

// Default session value when logged out
const _nullEmployees = []

// this is the action object
export default (state = _nullEmployees, { type, employees }) => {

  Object.freeze(state);

  switch (type) { //action.type
    case GET_EMPLOYEES:
      return employees;
    default:
      return state;
  }

};