import * as apiUtil from "../util/session";
import {receiveErrors} from "./error";

export const GET_EMPLOYEES = "GET_EMPLOYEES";

const getManagerEmployees = employees => ({
  type: GET_EMPLOYEES,
  employees: employees
});

export const getEmployees = () => async dispatch => {
  const response = await apiUtil.getEmployees();
  const data = await response.json();
  console.log(data);
  if (response.ok){
    return dispatch(getManagerEmployees(data));
  }
  return dispatch(receiveErrors(data));
}