import { VARIABLE_STATUS } from "../constants/appStatusConstant";
const INIT_STATE = {
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
  getMyListNextSevenDay: {
    data: [],
    status: VARIABLE_STATUS.IDLE,
    erorr: null,
  },
  getCurrentTodo: {
    todos: [],
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  createTodo: {
    title: "",
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  getSuggestionTodo: {
    todos: [],
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
  getDetailTodo: {
    todo: {},
    status: VARIABLE_STATUS.IDLE,
    error: null,
  },
};

export default INIT_STATE