import axios from "axios";

import { PATH_API, MY_DAY_PAGE_CONTROLLER } from "../constants/pathApiConstant";

const getTodo = async () => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}todos`;

  const response = await axios({
    method: "get",
    url: url,
  })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return response;
};

const createTodo = async (title) => {
  const url = `${PATH_API}${MY_DAY_PAGE_CONTROLLER}simple-todo`;

  const response = await axios({
    url: url,
    method: "post",
    data: {
      title: title,
    },
  });

  return response.data;
};

export { getTodo, createTodo };
