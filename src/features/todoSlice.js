import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getTodo, createTodo } from "../adapters/myDayPageAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";

const initialState = {
  todos: [],
  status: "idle",
  error: null,
};

export const addNewTodo = createAsyncThunk(
  "todo/addNewTodo",
  async (initialState) => {
    const { title } = initialState;
    const response = await createTodo(title);

    if (response.statusCode !== 200 || response.isSuccess !== true) {
      alert("add new todo error");
      return;
    }

    initialState.status = VARIABLE_STATUS.SUCCEEDED;
    return initialState;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    reactionAdded(state, action) {},
    extraReducers: (builder) => {
      builder.addCase(addNewTodo.fulfilled, (state, action) => {
        console.log({ state, action });
        // state.todos.push(action.payload);
      });
    },
  },
});

export const {
  actions: { reactionAdded },
  reducer: todoReducer,
} = todoSlice;

export default todoSlice;
