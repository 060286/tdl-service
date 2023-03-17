import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

import {
  PATH_API,
  MY_DAY_PAGE_CONTROLLER,
  TODO,
  ALL_LIST_PAGE,
  CREATE_SUB_TASK,
  ARCHIVE_TODO,
  TODOS,
  SUBTASK_COMPLETE_STATUS,
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

const archiveTodoById = async (id) => {
  try {
    const url = `${PATH_API}${TODOS}/${id}${ARCHIVE_TODO}`;

    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "PUT",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// ? Đổi params
const updateSubTaskStatus = async ({ id, isCompleted }) => {
  try {
    const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${id}${SUBTASK_COMPLETE_STATUS}`;

    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "PUT",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.status === 200 ? { id, isCompleted } : null;
  } catch (error) {
    console.log(error);
  }
};

// ? Api lấy danh sách tag
const getTagListAdapter = async () => {
  try {
    const url = `https://localhost:44334/api/v1/todos/tags-list`;

    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    // do sth
  }
};

export {
  getTaskById,
  createSubTaskInTodo,
  archiveTodoById,
  updateSubTaskStatus,
  getTagListAdapter,
};
