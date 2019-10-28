import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers/root"; // Compound reducer from root.js

export default preloadedState => (
  createStore(
    reducer,
    preloadedState,
    applyMiddleware(thunk)
  )
);