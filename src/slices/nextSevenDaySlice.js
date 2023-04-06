import { VARIABLE_STATUS } from "../constants/appStatusConstant";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { getMyListNextSevenDayRequest } from "../adapters/nextSevenDatAdapter";
import { createTodo } from "../adapters/myDayPageAdapter";
import INIT_STATE from "./constant";
import { differenceInDays, format } from "date-fns";
import { archiveTodoById } from "../adapters/taskAdapter";

import {
  updateTodoTitle,
  updateTodoDescription,
} from "../adapters/allMyTaskAdapter";
const initialState = {
  getMyListNextSevenDay: INIT_STATE.getMyListNextSevenDay,
};

export const archiveTodoSlice = createAsyncThunk(
  "todo/archiveTodo",
  async (data) => {
    const { id } = data.data;
    await archiveTodoById(id);

    console.log(id);

    return { id };
  }
);

const nextSevenDaySlice = createSlice({
  name: "nextSevenDaySlice",
  initialState,
  reducers: {
    addSubTaskByTodoId(state, action) {
      console.log(action);
      const { todoId, newSubtask } = action.payload;

      const dayOne = state.getMyListNextSevenDay.data.dayOne;
      const dayTwo = state.getMyListNextSevenDay.data.dayTwo;
      const dayThree = state.getMyListNextSevenDay.data.dayThree;
      const dayFour = state.getMyListNextSevenDay.data.dayFour;
      const dayFive = state.getMyListNextSevenDay.data.dayFive;
      const daySix = state.getMyListNextSevenDay.data.daySix;
      const daySeven = state.getMyListNextSevenDay.data.daySeven;

      dayOne.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      dayTwo.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      dayThree.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      dayFour.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      dayFive.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      daySix.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });

      daySeven.forEach((el) => {
        if (el.id === todoId) {
          const newSubTasks = [...el.subTasks, newSubtask];

          el.subTasks = newSubTasks;
        }
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(archiveTodoSlice.fulfilled, (state, action) => {
        const { id } = action.payload;

        const dayOne = state.getMyListNextSevenDay.data.dayOne;
        const dayTwo = state.getMyListNextSevenDay.data.dayTwo;
        const dayThree = state.getMyListNextSevenDay.data.dayThree;
        const dayFour = state.getMyListNextSevenDay.data.dayFour;
        const dayFive = state.getMyListNextSevenDay.data.dayFive;
        const daySix = state.getMyListNextSevenDay.data.daySix;
        const daySeven = state.getMyListNextSevenDay.data.daySeven;

        const newDayOne = dayOne.filter((el) => el.id !== id);
        const newDayTwo = dayTwo.filter((el) => el.id !== id);
        const newDayThree = dayThree.filter((el) => el.id !== id);
        const newDayFour = dayFour.filter((el) => el.id !== id);
        const newDayFive = dayFive.filter((el) => el.id !== id);
        const newDaySix = daySix.filter((el) => el.id !== id);
        const newDaySeven = daySeven.filter((el) => el.id !== id);

        state.getMyListNextSevenDay.data.dayOne = newDayOne;
        state.getMyListNextSevenDay.data.dayTwo = newDayTwo;
        state.getMyListNextSevenDay.data.dayThree = newDayThree;
        state.getMyListNextSevenDay.data.dayFour = newDayFour;
        state.getMyListNextSevenDay.data.dayFive = newDayFive;
        state.getMyListNextSevenDay.data.daySix = newDaySix;
        state.getMyListNextSevenDay.data.daySeven = newDaySeven;
      })
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
        state.getMyListNextSevenDay.status = VARIABLE_STATUS.SUCCEEDED;
        const day = differenceInDays(
          new Date(
            format(new Date(action.payload.data.todoDate), "MM/dd/yyyy")
          ),
          new Date(format(new Date(), "MM/dd/yyyy"))
        );
        let field = "";
        if (day === 0) field = "dayOne";
        if (day === 1) field = "dayTwo";
        if (day === 2) field = "dayThree";
        if (day === 3) field = "dayFour";
        if (day === 4) field = "dayFive";
        if (day === 5) field = "daySix";
        if (day === 6) field = "daySeven";
        // console.log({
        //   day,
        //   field,
        //   a: current(state.getMyListNextSevenDay.data),
        //   b: current(state.getMyListNextSevenDay.data[field]),
        // });
        // TODO: waiting be add todoDate field
        state.getMyListNextSevenDay.data = {
          ...current(state.getMyListNextSevenDay.data),
          [field]: current(state.getMyListNextSevenDay.data[field]).map(
            (item) => {
              if (item.id === action.payload.data.id) {
                return action.payload.data;
              }
              return item;
            }
          ),
        };
      })
      .addCase(updateTodoDescriptionSlice.fulfilled, (state, action) => {
        const day = differenceInDays(
          new Date(
            format(new Date(action.payload.data.todoDate), "MM/dd/yyyy")
          ),
          new Date(format(new Date(), "MM/dd/yyyy"))
        );
        let field = "";
        if (day === 0) field = "dayOne";
        if (day === 1) field = "dayTwo";
        if (day === 2) field = "dayThree";
        if (day === 3) field = "dayFour";
        if (day === 4) field = "dayFive";
        if (day === 5) field = "daySix";
        if (day === 6) field = "daySeven";
        console.log({
          day,
          field,
          a: current(state.getMyListNextSevenDay.data),
          b: current(state.getMyListNextSevenDay.data[field]),
        });
        // TODO: waiting be add todoDate field
        state.getMyListNextSevenDay.data = {
          ...current(state.getMyListNextSevenDay.data),
          [field]: current(state.getMyListNextSevenDay.data[field]).map(
            (item) => {
              if (item.id === action.payload.data.id) {
                return action.payload.data;
              }
              return item;
            }
          ),
        };
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

export const createTodoSlice = createAsyncThunk(
  "nextSevenDay/updateTodoTitleSlice",
  async (initialState) => {
    const response = await createTodo(initialState);

    return response;
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
  actions: { addSubTaskByTodoId },
} = nextSevenDaySlice;

export default nextSevenDaySlice;
