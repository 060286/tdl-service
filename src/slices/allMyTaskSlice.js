import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllMyTask, getTaskDetail } from "../adapters/allMyTaskAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";

const initialState = {
  allTasks: {
    data: {},
    error: null,
    status: "idle",
  },
  infoTask: {
    data: {},
    error: null,
    status: "idle",
  },
};

export const getTaskById = createAsyncThunk(
  "allMyTask/getTaskById",
  async ({ id }) => {
    try {
      const response = await getTaskDetail(id);

      return response.data;
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
  actions: { updateTaskDetail },
  reducer: allTaskReducer,
} = tasksSlice;

export default tasksSlice;
