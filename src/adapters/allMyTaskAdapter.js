import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

const getAllMyTask = async () => {
  const url =
    "https://localhost:44334/api/v1/allmytask-page/all-task?dateTime=02%2F16%2F2023";
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

const getTaskDetail = async (id) => {
  try {
    const url = `https://localhost:44334/api/v1/myday-page/${id}/todo`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      url: url,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getAllMyTask, getTaskDetail };
