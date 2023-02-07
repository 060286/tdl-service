import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../adapters/accountTaskAdapter";
import { getTargetOfProxy } from "../extensions/proxyExtension";

import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import SLICE_NAMES from "../constants/sliceConstant";

const initialState = {
  login: {
    data: {},
    status: VARIABLE_STATUS.IDLE,
    error: "",
  },
  register: {
    data: {},
    status: VARIABLE_STATUS.IDLE,
    error: "",
  },
  token: null,
};

export const loginAccount = createAsyncThunk("account/login", async (data) => {
  const response = await login(data);

  return response;
});

export const registerAccount = createAsyncThunk(
  "account/register",
  async (data) => {
    const response = await register(data);

    return response;
  }
);

const accountSlice = createSlice({
  name: SLICE_NAMES.ACCOUNT_SLICE,
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;

      console.log(getTargetOfProxy(state));
    },
  },
  extraReducers() {},
});

export const {
  actions: { setToken },
  reducer: accountReducer,
} = accountSlice;

export default accountSlice;
