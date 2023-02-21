import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

import {
  PATH_API,
  MY_DAY_PAGE_CONTROLLER,
  TODO,
} from "../constants/pathApiConstant";

const getTaskById = async (id) => {
  try {
    const url = `${PATH_API}/${MY_DAY_PAGE_CONTROLLER}/${id}/${TODO}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "get",
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

export { getTaskById };
