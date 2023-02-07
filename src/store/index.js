import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "../slices/todoSlice";
import { allTaskReducer } from "../slices/allMyTaskSlice";
import { accountReducer } from "../slices/accountSlice";

const reducers = combineReducers({
  todoReducer: todoReducer,
  allTaskReducer: allTaskReducer,
  accountReducer: accountReducer,
});

// Create redux store
export const store = configureStore({
  reducer: reducers,
});
