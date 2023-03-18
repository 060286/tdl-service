import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {differenceInBusinessDays} from "date-fns"
import { getAllMyTask, getTaskDetail, updateTodoTitle } from "../adapters/allMyTaskAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import INIT_STATE from "./constant";
const initialState = {
  allTasks: INIT_STATE.allTasks,
  infoTask: INIT_STATE.infoTask
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

const tasksSlice = createSlice({
  name: "alltask",
  initialState,
  reducers: {
    updateTaskDetail(state, action) {
      state.infoTask.data = action.payload.data;
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
        const field = 'allTaskUpComming'
        // TODO: calculate field by todoDate by this function differenceInBusinessDays
        state.allTasks.data = {
          ...state.allTasks.data,
          [field]: state.allTasks.data[field].map(item => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        })
        }
      })
  },
});


export const selectAllTasks = (state) => {
  return state.allTaskReducer.allTasks;
};

export const selectTaskDetail = (state) => {
  return state.allTaskReducer.infoTask;
};

export const {
  actions: { updateTaskDetail },
  reducer: allTaskReducer,
} = tasksSlice;

export default tasksSlice;
