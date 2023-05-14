import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTodo,
  getTodayJobList,
  getSuggestionTodoList,
  updateStatusOfTodoAdapter,
} from "../adapters/myDayPageAdapter";

import { current } from "@reduxjs/toolkit";

import {
  getTaskById,
  createSubTaskInTodo,
  archiveTodoById,
  updateSubTaskStatus,
  getTagListAdapter,
  updateRemindAtAdapter,
} from "../adapters/taskAdapter";
import { searchTodoByKeyword } from "../adapters/myDayPageAdapter";
import { updateTodoTagAdapter } from "../adapters/tagAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";

import INIT_STATE from "./constant";
import {
  updateTodoTitle,
  updateTodoDescription,
} from "../adapters/allMyTaskAdapter";
import { formatDateTime } from "../extensions/stringExtention";
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
  tagList: {
    data: [],
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  selectedTodoId: {
    id: null,
    status: VARIABLE_STATUS.IDLE,
    error: null
  }
};

export const createSubTodo = createAsyncThunk(
  "todo/createSubTodo",
  async (subtask) => {
    try {
      const response = await createSubTaskInTodo(subtask);

      return { response, subtask };
    } catch (err) {
      console.log(err);
    }
  }
);

export const searchTodoByKeywordSlice = createAsyncThunk(
  "todo/searchTodoByKeyword",
  async (keyword) => {
    try {
      const response = await searchTodoByKeyword(keyword);

      return response;
    }
    catch(error) {
      // dosth
    }
  }
)

export const updateRemindAtSlice = createAsyncThunk(
  "todo/updateRemindAtSlice",
  async ({ todoId, remindAt }) => {
    const response = await updateRemindAtAdapter({ todoId, remindAt });

    return { todoId, remindAt };
  }
);

export const updateTodoTagSlicde = createAsyncThunk(
  "todo/updateTodoTagSlicde",
  async ({ tag, todoId }) => {
    try {
      const data = { ...tag, todoId };

      const response = await updateTodoTagAdapter(data);

      return response;
    } catch (err) {
      // ! Err: Do something
    }
  }
);

export const getTagListSlice = createAsyncThunk(
  "todo/getTagListSlice",
  async () => {
    try {
      const response = await getTagListAdapter();

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
    const { title, todoDate } = initialState;
    const response = await createTodo({ title, todoDate });

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
  async () => { }
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

export const updateTodoStatusSlicde = createAsyncThunk(
  "todo/updateTodoStatusSlicde",
  async (todo) => {
    const response = await updateStatusOfTodoAdapter(todo);

    return response;
  }
);

export const updateTodoTitleSlice = createAsyncThunk(
  "myDayPage2/updateTodoTitleSlice",
  async (initialState) => {
    console.log("CALL");
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
    console.log("CALL");
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
    setSelectedTodoId(state, action) {
      state.selectedTodoId.id = action.payload;
      state.selectedTodoId.status = VARIABLE_STATUS.SUCCEEDED;
    },
    removeSelectedTodoId(state){
      state.selectedTodoId.id = null;
      state.selectedTodoId.status = VARIABLE_STATUS.IDLEl;
      state.selectedTodoId.error = null;
    },
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
      console.log({ action });
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
    setDefaultTagList(state) {
      state.tagList.data = [];
      state.tagList.error = null;
      state.tagList.status = VARIABLE_STATUS.IDLE;
    },
    updateSubTaskTitle(state, action) {
      const { id, title, todoId } = action.payload;
      const todoIndex = state.getCurrentTodo?.todos.findIndex(
        (el) => el.id === todoId
      );
      const subTaskIndex = state.getCurrentTodo?.todos[
        todoIndex
      ]?.subTasks.findIndex((el) => el.id === id);
      const newSubtask =
        state.getCurrentTodo?.todos[todoIndex].subTasks[subTaskIndex];
      const result = { ...newSubtask, name: title };
      state.getCurrentTodo.todos[todoIndex].subTasks[subTaskIndex] = result;
    },
    updateSubTaskIsCompleted(state, action) {
      const { id, todoId } = action.payload;
      const todoIndex = state.getCurrentTodo?.todos.findIndex(
        (el) => el.id === todoId
      );
      const subTaskIndex = state.getCurrentTodo?.todos[
        todoIndex
      ]?.subTasks.findIndex((el) => el.id === id);
      const currentStatus =
        state.getCurrentTodo?.todos[todoIndex].subTasks[subTaskIndex]
          .isCompleted;
      const newSubtask =
        state.getCurrentTodo?.todos[todoIndex].subTasks[subTaskIndex];
      const result = { ...newSubtask, isCompleted: !currentStatus };
      state.getCurrentTodo.todos[todoIndex].subTasks[subTaskIndex] = result;
    },
    updateCompletedTodoSlice(state, action) {
      console.log({ action });
    },
    updateTodoStatusSlice(state, action) {
      console.log({ state, action });
    },
    updateTagSlice(state, action) {
      const { tag, todoId } = action.payload;
      const newTodos = state.getCurrentTodo.todos.map((todo) => {
        if (todo.id === todoId) {
          todo.tag = tag;

          return todo;
        }

        return todo;
      });

      state.getCurrentTodo.todos = newTodos;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubTodo.fulfilled, (state, action) => {
        const { data } = action.payload.response.data;
        const { todoId } = action.payload.subtask;
        const newTodos = state.getCurrentTodo.todos.map((todo) => {
          if (todo === todoId) {
            const newSubtasks = [
              ...todo.subTasks,
              { id: data.id, isCompleted: false, name: data.title },
            ];

            const newTodo = { ...todo, subTasks: newSubtasks };

            return newTodo;
          }

          return todo;
        });

        // console.log('new todos', JSON.stringify(newTodos[0].subTasks));
      })
      .addCase(archiveTodo.fulfilled, (state, action) => {
        console.log("archived completed");
      })
      .addCase(createSubTodo.rejected, (state, action) => { })
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
      .addCase(getSuggestionTodo.rejected, (state, action) => { })
      .addCase(addSuggestionToCurrentTodoList.fulfilled, (state, action) => { })
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
        console.log(action.payload);
      })
      .addCase(updateRemindAtSlice.fulfilled, (state, action) => {
        const { remindAt, todoId } = action.payload;

        const newTodos = state.getCurrentTodo.todos.map((todo) => {
          if (todo.id === todoId) {
            const dateFormat = formatDateTime(remindAt);

            console.log(JSON.stringify(todo), dateFormat);

            todo.remindedAt = dateFormat;

            return todo;
          }

          return todo;
        });

        state.getCurrentTodo.todos = newTodos;
      })
      .addCase(updateTodoStatusSlicde.fulfilled, (state, action) => {
        const index = state.getCurrentTodo.todos.findIndex(
          (el) => el.id === action.payload.data.id
        );

        state.getCurrentTodo.todos[index].isCompleted =
          action.payload.data.isCompleted;
      })
      .addCase(updateTodoTitleSlice.fulfilled, (state, action) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(
          (item) => {
            if (item.id === action.payload.data.id) {
              return action.payload.data;
            }
            return item;
          }
        );
      })
      .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        state.getCurrentTodo.status = VARIABLE_STATUS.SUCCEEDED;
        state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(
          (item) => {
            if (item.id === action.payload.data.id) {
              return action.payload.data;
            }
            return item;
          }
        );
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
    setDefaultTagList,
    updateSubTaskTitle,
    updateSubTaskIsCompleted,
    updateCompletedTodoSlice,
    updateTodoStatusSlice,
    updateTagSlice,
    updateRemindAtTodoSlice,
    setSelectedTodoId,
    removeSelectedTodoId
  },
  reducer: todoReducer,
} = todoSlice;

export default todoSlice;
