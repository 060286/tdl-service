import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  login,
  register,
  getUserInfoAdapter,
} from "../adapters/accountTaskAdapter";
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
  userInfo: {
    data: {},
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
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

export const getUserInfo = createAsyncThunk(
  "account/getUserInfo",
  async (token) => {
    const response = await getUserInfoAdapter(token);

    return response.data;
  }
);

const accountSlice = createSlice({
  name: SLICE_NAMES.ACCOUNT_SLICE,
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setUserInfo(state, action) {
      const userInfo = action.payload;
      state.userInfo = userInfo;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginAccount.fulfilled, (state, action) => {
        state.token = action.payload.data;
      })
      .addCase(getUserInfo.pending, (state, action) => {
        state.userInfo.status = VARIABLE_STATUS.IDLE;
        state.userInfo.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        console.log({action})
        state.userInfo.status = VARIABLE_STATUS.SUCCEEDED;
        state.userInfo = action.payload;
        state.userInfo.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.userInfo.status = VARIABLE_STATUS.FAILED;
        state.userInfo.error = action.payload;
      });
  },
});

export const {
  actions: { setToken, setUserInfo },
  reducer: accountReducer,
} = accountSlice;

export default accountSlice;
