import { createStore } from "redux";
import allReducers from "./reducers";
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";

const composeEnhancers = composeWithDevTools({
  serialize: true
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, allReducers)

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
