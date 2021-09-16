import userReducer from "./user";
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from "redux";

// const allReducers = combineReducers({
//   userReducer
// });

// export default allReducers;

 
const rootPersistConfig = {
  key: 'root',
  storage: storage,
}
 
const authPersistConfig = {
  key: 'user_reducer',
  storage: storage,
}
 
const rootReducer = combineReducers({
  userReducer: persistReducer(authPersistConfig, userReducer),
})
 
export default persistReducer(rootPersistConfig, rootReducer)