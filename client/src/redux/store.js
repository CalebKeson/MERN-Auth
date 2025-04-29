// import dependencies
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// create a root reducer
// this is the main reducer that will be used to create the store
// it will combine all the reducers in the app
const rootReducer = combineReducers({
  user: userReducer,
});

// create a persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// create a persistor
export const persistor = persistStore(store);
// this will be used to persist the store in local storage
export default store;
