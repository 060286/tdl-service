import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { differenceInDays, format } from "date-fns";
import {
  getAllMyTask,
  getTaskDetail,
  updateTodoTitle,
  updateTodoDescription,
} from "../adapters/allMyTaskAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import INIT_STATE from "./constant";
const initialState = {
  allTasks: INIT_STATE.allTasks,
  infoTask: INIT_STATE.infoTask,
};

export const getTaskById = createAsyncThunk(
  "allMyTask/getTaskById",
  async (id) => {
    try {
      const response = await getTaskDetail(id);

      const data = response.data;

      return { data };
    } catch (error) {
      console.log(error, "getTaskById");
    }
  }
);

export const getAllTask = createAsyncThunk(
  "allMyTask/getAllTask",
  async (initialState) => {
    const response = await getAllMyTask();

    return {
      ...initialState,
      data: response.data,
    };
  }
);

export const updateTodoTitleSlice = createAsyncThunk(
  "allMyTask/updateTodoTitleSlice",
  async (initialState) => {
    const response = await updateTodoTitle(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
);

export const updateTodoDescriptionSlice = createAsyncThunk(
  "allMyTask/updateTodoDescriptionSlice",
  async (initialState) => {
    const response = await updateTodoDescription(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
);

const tasksSlice = createSlice({
  name: "alltask",
  initialState,
  reducers: {
    updateTaskDetail(state, action) {
      state.infoTask.data = action.payload.data;
    },
    updateSubTaskStatus(state, action) {
      const { id, currentTask } = action.payload;

      if (currentTask === "Today") {
        const data = state.allTasks.data.allTaskToday;

        data.forEach((obj) => {
          const index = obj.subTasks.findIndex((el) => el.id === id);

          if (index > -1) {
            console.log(JSON.stringify(obj.subTasks[index]));
            obj.subTasks[index].isCompleted = !obj.subTasks[index].isCompleted;
          }
        });
      }

      if (currentTask === "Tomorrow") {
        const data = state.allTasks.data.allTaskTomorrow;

        data.forEach((obj) => {
          const index = obj.subTasks.findIndex((el) => el.id === id);

          if (index > -1) {
            console.log(JSON.stringify(obj.subTasks[index]));
            obj.subTasks[index].isCompleted = !obj.subTasks[index].isCompleted;
          }
        });
      }

      if (currentTask === "Upcoming") {
        const data = state.allTasks.data.allTaskUpComming;

        data.forEach((obj) => {
          const index = obj.subTasks.findIndex((el) => el.id === id);

          if (index > -1) {
            console.log(JSON.stringify(obj.subTasks[index]));
            obj.subTasks[index].isCompleted = !obj.subTasks[index].isCompleted;
          }
        });
      }
    },
    removeSubTask(state, action) {
      const { id, isCompleted, todoId } = action.payload;

      const dataToday = state.allTasks.data.allTaskToday;
      const dataTomorrow = state.allTasks.data.allTaskTomorrow;
      const dataUpComming = state.allTasks.data.allTaskUpComming;

      dataToday.forEach((data) => {
        if (data.id === todoId) {
          const newSubTask = data.subTasks.filter((st) => {
            return st.id !== id;
          });

          data.subTasks = newSubTask;
        }
      });

      dataTomorrow.forEach((data) => {
        if (data.id === todoId) {
          const newSubTask = data.subTasks.filter((st) => {
            return st.id !== id;
          });

          data.subTasks = newSubTask;
        }
      });

      dataUpComming.forEach((data) => {
        if (data.id === todoId) {
          const newSubTask = data.subTasks.filter((st) => {
            return st.id !== id;
          });

          data.subTasks = newSubTask;
        }
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTask.pending, (state, action) => {
        state.allTasks.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(getAllTask.fulfilled, (state, action) => {
        state.allTasks.status = VARIABLE_STATUS.SUCCEEDED;
        state.allTasks.data = action.payload.data;
      })
      .addCase(updateTodoTitleSlice.fulfilled, (state, action) => {
        state.allTasks.status = VARIABLE_STATUS.SUCCEEDED;
        const day = differenceInDays(
          new Date(
            format(new Date(action.payload.data.todoDate), "MM/dd/yyyy")
          ),
          new Date(format(new Date(), "MM/dd/yyyy"))
        );
        let field;
        if (day === 0) field = "allTaskToday";
        if (day === 1) field = "allTaskTomorrow";
        if (day > 1) field = "allTaskUpComming";

        // TODO: calculate field by todoDate by this function differenceInBusinessDays
        state.allTasks.data = {
          ...state.allTasks.data,
          [field]: state.allTasks.data[field].map((item) => {
            if (item.id === action.payload.data.id) {
              return action.payload.data;
            }
            return item;
          }),
        };
      })
      .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        state.allTasks.status = VARIABLE_STATUS.SUCCEEDED;
        const day = differenceInDays(
          new Date(
            format(new Date(action.payload.data.todoDate), "MM/dd/yyyy")
          ),
          new Date(format(new Date(), "MM/dd/yyyy"))
        );
        let field;
        if (day === 0) field = "allTaskToday";
        if (day === 1) field = "allTaskTomorrow";
        if (day > 1) field = "allTaskUpComming";
        // TODO: calculate field by todoDate by this function differenceInBusinessDays
        state.allTasks.data = {
          ...state.allTasks.data,
          [field]: current(state.allTasks.data[field]).map((item) => {
            if (item.id === action.payload.data.id) {
              return action.payload.data;
            }
            return item;
          }),
        };
      });
  },
});

export const selectAllTasks = (state) => {
  return state.allTaskReducer.allTasks;
};

export const selectTaskDetail = (state) => {
  return state.allTaskReducer.infoTask;
};

export const {
  actions: { updateTaskDetail, updateSubTaskStatus, removeSubTask },
  reducer: allTaskReducer,
} = tasksSlice;

export default tasksSlice;
