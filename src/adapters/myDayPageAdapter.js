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

const createTodo = async (title) => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}/${SIMPLE_TODO}`;
  const token = getTokenFromLocalStorage();

  const response = await axios({
    url: url,
    method: "post",
    // data: use for post method
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      title: title,
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

export { getTodo, createTodo, getTodayJobList, getSuggestionTodoList };
