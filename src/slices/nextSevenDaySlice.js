import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyListNextSevenDayRequest } from "../adapters/nextSevenDatAdapter";

const initialState = {
  getMyListNextSevenDay: {
    data: [],
    status: VARIABLE_STATUS.IDLE,
    erorr: null,
  },
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
      });
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

export { getMyListNextSevenDay };

export const {
  reducer: nextSevenDayReducer,
  actions: {},
} = nextSevenDaySlice;

export default nextSevenDaySlice;
