import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTodo,
  getTodayJobList,
  getSuggestionTodoList,
} from "../adapters/myDayPageAdapter";

import {
  getTaskById,
  createSubTaskInTodo,
  archiveTodoById,
} from "../adapters/taskAdapter";
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
  getDetailTodo: {
    todo: {},
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
};

export const createSubTodo = createAsyncThunk(
  "todo/createSubTodo",
  async (subtask) => {
    try {
      const response = await createSubTaskInTodo(subtask);

      return response;
    } catch (err) {
      console.log(err);
    }
  }
);

export const getTodoById = createAsyncThunk("todo/getTodoById", async (id) => {
  try {
    const response = await getTaskById(id);

    return response.data;
  } catch (err) {
    console.log(err);
  }
});

export const getCurrentTodoList = createAsyncThunk(
  "todo/getCurrentTodoList",
  async (initialState) => {
    const response = await getTodayJobList();

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

export const changeStatusOfSubtaskById = createAsyncThunk(
  "todo/changeStatusOfSubtaskById",
  async () => {}
);

export const addSuggestionToCurrentTodoList = createAsyncThunk(
  "todo/addSuggestionToCurrentTodoList",
  async (data) => data
);

export const archiveTodo = createAsyncThunk("todo/archiveTodo", async (id) => {
  await archiveTodoById(id);
});

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    removeSuggestion(state, action) {
      state.getSuggestionTodo.todos = state.getSuggestionTodo.todos.filter(
        (el) => el.id !== action.payload
      );
    },
    removeDetailTodo(state) {
      state.getDetailTodo.todo = {};
      state.getDetailTodo.error = null;
      state.getDetailTodo.status = VARIABLE_STATUS.IDLE;
    },
    changeTitleByDetail(state, action) {
      state.getDetailTodo.todo.title = action.payload;
    },
    addSubTaskToDetailTodo(state, action) {
      state.getDetailTodo.todo.subTasks.unshift(action.payload);
    },
    removeTodoFromList(state, action) {
      console.log(action.payload);

      state.getCurrentTodo.todos = state.getCurrentTodo.todos.filter(
        (todo) => todo.id !== action.payload
      );
    },
    changeCompletedStatusOfSubtaskById(state, action) {
      const { id, name, isCompleted } = action.payload;

      state.getDetailTodo.todo.subTasks.forEach((subtask, index) => {
        if (subtask.id === id) {
          state.getDetailTodo.todo.subTasks[index] = {
            id: id,
            name: name,
            isCompleted: !isCompleted,
          };
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubTodo.pending, (state, action) => {
        // state.getDetailTodo.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(createSubTodo.fulfilled, (state, action) => {
        // state.getDetailTodo.todo.subTasks.unshift(action.payload.data.data);
      })
      .addCase(archiveTodo.fulfilled, (state, action) => {
        console.log("archived completed");
      })
      .addCase(createSubTodo.rejected, (state, action) => {})
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.getCurrentTodo.todos.push(action.payload);
      })
      .addCase(getCurrentTodoList.pending, (state) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.LOADING;
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
      .addCase(addSuggestionToCurrentTodoList.fulfilled, (state, action) => {})
      .addCase(getTodoById.pending, (state, action) => {
        state.getDetailTodo.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(getTodoById.fulfilled, (state, action) => {
        state.getDetailTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getDetailTodo.todo = action.payload;
      })
      .addCase(getTodoById.rejected, (state, action) => {
        state.getDetailTodo.status = VARIABLE_STATUS.FAILED;
      });
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
  actions: {
    removeSuggestion,
    removeDetailTodo,
    changeTitleByDetail,
    addSubTaskToDetailTodo,
    removeTodoFromList,
    changeCompletedStatusOfSubtaskById,
  },
  reducer: todoReducer,
} = todoSlice;

export default todoSlice;
