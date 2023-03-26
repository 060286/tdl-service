import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { getMyListNextSevenDayRequest } from "../adapters/nextSevenDatAdapter";
import INIT_STATE from "./constant"
import { updateTodoTitle, updateTodoDescription } from "../adapters/allMyTaskAdapter";
const initialState = {
  getMyListNextSevenDay: INIT_STATE.getMyListNextSevenDay,
};

const nextSevenDaySlice = createSlice({
  name: "nextSevenDaySlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMyListNextSevenDay.pending, (state) => {
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.LOADING;
      })
      .addCase(getMyListNextSevenDay.fulfilled, (state, action) => {
        console.log({ action: action.payload });

        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        state.getMyListNextSevenDay.data = action.payload.data;
      })
      .addCase(getMyListNextSevenDay.rejected, (state, action) => {
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.FAILED;
        state.getMyListNextSevenDay.erorr = action.payload;
      })
      .addCase(updateTodoTitleSlice.fulfilled, (state, action) => {
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        console.log(current(state.getMyListNextSevenDay.data), action.payload.data)
        // TODO: waiting be add todoDate field
        // state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(item => {
          // if (item.id === action.payload.data.id) {
            // return action.payload.data;
          // }
          // return item;
        // })
      })
    .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        console.log(current(state.getMyListNextSevenDay.data), action.payload.data)
        // TODO: waiting be add todoDate field
        // state.getCurrentTodo.todos = current(state.getCurrentTodo.todos).map(item => {
          // if (item.id === action.payload.data.id) {
            // return action.payload.data;
          // }
          // return item;
        // })
      })
  },
});
 
const getMyListNextSevenDay = createAsyncThunk(
  "nextSevenDay/getMyListNextSevenDay",
  async (dateTime) => {
    try {
      const response = await getMyListNextSevenDayRequest(dateTime);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateTodoTitleSlice = createAsyncThunk(
  "nextSevenDay/updateTodoTitleSlice",
  async (initialState) => {
    const response = await updateTodoTitle(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
);


export const updateTodoDescriptionSlice = createAsyncThunk(
  "nextSevenDay/updateTodoDescriptionSlice",
  async (initialState) => {
    const response = await updateTodoDescription(initialState);

    return {
      ...initialState,
      data: response.data,
    };
  }
);

export { getMyListNextSevenDay };

export const {
  reducer: nextSevenDayReducer,
  actions: {},
} = nextSevenDaySlice;

export default nextSevenDaySlice;
