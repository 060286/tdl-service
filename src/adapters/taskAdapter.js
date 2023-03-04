import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

import {
  PATH_API,
  MY_DAY_PAGE_CONTROLLER,
  TODO,
  ALL_LIST_PAGE,
  CREATE_SUB_TASK,
} from "../constants/pathApiConstant";

const createSubTaskInTodo = async ({ name, todoId }) => {
  try {
    const url = `${PATH_API}${ALL_LIST_PAGE}${CREATE_SUB_TASK}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        todoId: todoId,
      },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
};

const getTaskById = async (id) => {
  try {
    const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${id}${TODO}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("error");
  }
};

export { getTaskById, createSubTaskInTodo };
