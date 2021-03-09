import { createStore } from "redux";
import allReducers from "./reducers";
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const composeEnhancers = composeWithDevTools({
  serialize: true
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
export const store = createStore(
         allReducers,
         composeEnhancers(applyMiddleware(thunk))
       );
