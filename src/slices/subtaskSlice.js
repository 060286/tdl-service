import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  updateSubTaskStatusAdapter,
  removeSubTaskByIdAdapter,
} from "../adapters/myDayPageAdapter";
import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import SLICE_NAMES from "../constants/sliceConstant";

const nameList = {
  updateSubTaskStatusSliceName: "subtask/updateSubTaskStatusSlice",
  removeSubTaskByIdSlice: "removeSubTaskByIdSlice",
};

const initialState = {
  updateSubTaskStatus: {
    data: {},
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
};

export const updateSubTaskStatusSlice = createAsyncThunk(
  nameList.updateSubTaskStatusSliceName,
  async (id) => {
    const response = await updateSubTaskStatusAdapter(id);

    return response;
  }
);

export const removeSubTaskByIdSlice = createAsyncThunk(
  nameList.removeSubTaskByIdSlice,
  async (id) => {
    const response = await removeSubTaskByIdAdapter(id);

    return response;
  }
);

const subTaskSlice = createSlice({
  name: SLICE_NAMES.SUBTASK,
  initialState,
  reducers: {},
  extraReducers(builder) {},
});

export const {
  actions: {},
  reducer: subTaskReducer,
} = subTaskSlice;

export default subTaskSlice;
