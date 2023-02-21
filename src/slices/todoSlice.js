import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTodo,
  getTodayJobList,
  getSuggestionTodoList,
} from "../adapters/myDayPageAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";

const initialState = {
  getCurrentTodo: {
    todos: [],
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  createTodo: {
    title: "",
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  getSuggestionTodo: {
    todos: [],
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  getDetailTo: {
    todo: {},
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
};

export const getTodoById = createAsyncThunk(
  "todo/getTodoById",
  async (initialState) => {}
  // Mai làm tiếp
);

export const getCurrentTodoList = createAsyncThunk(
  "todo/getCurrentTodoList",
  async (initialState) => {
    const response = await getTodayJobList();

    // console.log("getCurrentTodoList");

    return {
      ...initialState,
      getCurrentTodo: {
        todo: response.data,
        status: VARIABLE_STATUS.SUCCEEDED,
        error: null,
      },
    };
  }
);

export const addNewTodo = createAsyncThunk(
  "todo/addNewTodo",
  async (initialState) => {
    const { title } = initialState;
    const response = await createTodo(title);

    if (response.statusCode !== 200 || response.isSuccess !== true) {
      alert("add new todo error");
      return;
    }

    return response.data;
  }
);

export const getSuggestionTodo = createAsyncThunk(
  "todo/getSuggestionTodoList",
  async () => {
    const response = await getSuggestionTodoList();

    return response.data;
  }
);

export const addSuggestionToCurrentTodoList = createAsyncThunk(
  "todo/addSuggestionToCurrentTodoList",
  async (data) => data
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    removeSuggestion(state, action) {
      state.getSuggestionTodo.todos = state.getSuggestionTodo.todos.filter(
        (el) => el.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.getCurrentTodo.todos.push(action.payload);
      })
      .addCase(getCurrentTodoList.pending, (state) => {
        state.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(getCurrentTodoList.fulfilled, (state, action) => {
        state.getCurrentTodo.todos = action.payload.getCurrentTodo.todo;
        state.getCurrentTodo.status = VARIABLE_STATUS.SUCCEEDED;
      })
      .addCase(getCurrentTodoList.rejected, (state, action) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.FAILED;
      })
      .addCase(getSuggestionTodo.pending, (state, action) => {
        state.getSuggestionTodo.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(getSuggestionTodo.fulfilled, (state, action) => {
        state.getSuggestionTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getSuggestionTodo.todos = action.payload;
      })
      .addCase(getSuggestionTodo.rejected, (state, action) => {})
      .addCase(addSuggestionToCurrentTodoList.fulfilled, (state, action) => {});
  },
});

export const selectAllTodos = (state) => {
  return state.todoReducer.getCurrentTodo;
};

export const selectAllSuggestionTodo = (state) => {
  return state.todoReducer.getSuggestionTodo;
};

export const selectTodoById = (state, todoId) =>
  state.todoReducer.getCurrentTodo.todos.find((todo) => todo.id === todoId);

export const selectAllSuggestion = (state) => {
  return state.todoReducer.getSuggestionTodo.todos;
};

export const {
  actions: { removeSuggestion },
  reducer: todoReducer,
} = todoSlice;

export default todoSlice;
