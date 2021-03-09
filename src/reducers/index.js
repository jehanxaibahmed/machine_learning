import userReducer from "./user";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  userReducer
});

export default allReducers;
