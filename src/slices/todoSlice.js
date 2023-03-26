import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTodo,
  getTodayJobList,
  getSuggestionTodoList,
} from "../adapters/myDayPageAdapter";
import {current } from '@reduxjs/toolkit'
import {
  getTaskById,
  createSubTaskInTodo,
  archiveTodoById,
  updateSubTaskStatus,
} from "../adapters/taskAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";

import INIT_STATE from "./constant"
import { updateTodoTitle, updateTodoDescription } from "../adapters/allMyTaskAdapter";
const initialState = {
  getCurrentTodo: INIT_STATE.getCurrentTodo,
  createTodo: INIT_STATE.createTodo,
  getSuggestionTodo: INIT_STATE.getSuggestionTodo,
  getDetailTodo: INIT_STATE.getDetailTodo,
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

export const updateSubTaskStatusSlice = createAsyncThunk(
  "todo/updateSubTaskStatusSlice",
  async (id) => {
    const response = await updateSubTaskStatus(id);

    return response;
  }
);


export const updateTodoTitleSlice = createAsyncThunk(
  "myDayPage2/updateTodoTitleSlice",
  async (initialState) => {
    console.log("CALL")
    const response = await updateTodoTitle(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
);


export const updateTodoDescriptionSlice = createAsyncThunk(
  "myDayPage2/updateTodoDescriptionSlice",
  async (initialState) => {
    console.log("CALL")
    const response = await updateTodoDescription(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
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
    removeDetailTodo(state) {
      state.getDetailTodo.todo = {};
      state.getDetailTodo.error = null;
      state.getDetailTodo.status = VARIABLE_STATUS.IDLE;
    },
    changeTitleByDetail(state, action) {
      state.getDetailTodo.todo.title = action.payload;
    },
    addSubTaskToDetailTodo(state, action) {
      console.log(action);

      // state.getDetailTodo.todo.subTasks.push(action.payload);
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
      })
      .addCase(updateSubTaskStatusSlice.fulfilled, (state, action) => {
        // update isCompleted by Id
        const todos = state.getDetailTodo?.todo;
        const { id } = action.payload;

        if (todos?.subTasks && todos?.subTasks.length > 0) {
          todos.subTasks.forEach((item) => {
            if (item.id === id) {
              item.isCompleted = !item.isCompleted;
            }
          });
        }
      })
      .addCase(updateSubTaskStatusSlice.rejected, (state, action) => {
        // do sth
        console.log(action.payload);
      })
      .addCase(updateTodoTitleSlice.fulfilled, (state, action) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(item => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        })
      })
    .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(item => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        })
      })
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
