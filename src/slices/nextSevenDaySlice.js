import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { getMyListNextSevenDayRequest } from "../adapters/nextSevenDatAdapter";
import INIT_STATE from "./constant"
import {differenceInDays, format } from "date-fns"
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
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        state.getMyListNextSevenDay.data = action.payload.data;
      })
      .addCase(getMyListNextSevenDay.rejected, (state, action) => {
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.FAILED;
        state.getMyListNextSevenDay.erorr = action.payload;
      })
      .addCase(updateTodoTitleSlice.fulfilled, (state, action) => {
        console.log("11")
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        const day = differenceInDays(
          new Date(format(new Date(action.payload.data.todoDate), 'MM/dd/yyyy')),
          new Date(format(new Date(), 'MM/dd/yyyy'))
        )
        let field = "";
        if (day === 0) field = "dayOne";
        if (day === 1) field = "dayTwo";
        if (day === 2) field = "dayThree";
        if (day === 3) field = "dayFour";
        if (day === 4) field = "dayFive";
        if (day === 5) field = "daySix";
        if (day === 6) field = "daySeven";
        console.log(
          {
            day,
            field,
            a: current(state.getMyListNextSevenDay.data),
            b: current(state.getMyListNextSevenDay.data[field])
          });
        // TODO: waiting be add todoDate field
        state.getMyListNextSevenDay.data = {
          ...current(state.getMyListNextSevenDay.data),
          [field]: current(state.getMyListNextSevenDay.data[field]).map(item => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        })
        }
      })
    .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        const day = differenceInDays(
          new Date(format(new Date(action.payload.data.todoDate), 'MM/dd/yyyy')),
          new Date(format(new Date(), 'MM/dd/yyyy'))
        )
        let field = "";
        if (day === 0) field = "dayOne";
        if (day === 1) field = "dayTwo";
        if (day === 2) field = "dayThree";
        if (day === 3) field = "dayFour";
        if (day === 4) field = "dayFive";
        if (day === 5) field = "daySix";
        if (day === 6) field = "daySeven";
        console.log(
          {
            day,
            field,
            a: current(state.getMyListNextSevenDay.data),
            b: current(state.getMyListNextSevenDay.data[field])
          });
        // TODO: waiting be add todoDate field
        state.getMyListNextSevenDay.data = {
          ...current(state.getMyListNextSevenDay.data),
          [field]: current(state.getMyListNextSevenDay.data[field]).map(item => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          }
          return item;
        })
        }
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
