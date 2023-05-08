import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

import { PATH_API, MY_DAY_PAGE_CONTROLLER } from "../constants/pathApiConstant";
import {
  TODAY_TODO_LIST,
  SIMPLE_TODO,
  SUGGESTION_LIST,
} from "../constants/todoConstant";

const getTodo = async () => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}todos`;

  const token = getSuggestionTodoList();

  const response = await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getTodayJobList = async () => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${TODAY_TODO_LIST}`;

  const today = new Date().toLocaleDateString();
  const token = getTokenFromLocalStorage();

  const response = await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // params : use for get method
    params: {
      dateTime: today,
    },
  });

  return response.data;
};

const createTodo = async ({ title, todoDate, categoryId = null }) => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${SIMPLE_TODO}`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      title: title,
      categoryId: categoryId,
      todoDate: todoDate !== null ? todoDate : new Date().toLocaleString(),
    },
  });

  return response.data;
};

/*
 * * * This method get suggestion list
 */
const getSuggestionTodoList = async () => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${SUGGESTION_LIST}`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ? Update IsCompleted Of SubTask

const updateSubTaskStatusAdapter = async (id) => {
  const url = `https://localhost:44334/api/v1/myday-page/${id}/subtask-complete-status`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ? Remove SubTask By Id

const removeSubTaskByIdAdapter = async (id) => {
  const url = `https://localhost:44334/api/v1/todos/${id}/remove-sub-task`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const updateStatusOfTodoAdapter = async ({ id }) => {
  const url = `https://localhost:44334/api/v1/todos/${id}/completed-todo`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const searchTodoByKeyword = async (keyword) => {
  const url = `https://localhost:44334/api/v1/todos/search-todo?Keyword=${keyword}`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.data
}

export {
  getTodo,
  createTodo,
  getTodayJobList,
  getSuggestionTodoList,
  updateSubTaskStatusAdapter,
  removeSubTaskByIdAdapter,
  updateStatusOfTodoAdapter,
  searchTodoByKeyword
};
