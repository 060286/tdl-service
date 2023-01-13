import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "../features/todoSlice";

const reducers = combineReducers({ todoReducer });

// Create redux store
export const store = configureStore({
  reducer: reducers,
});
