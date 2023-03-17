import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

// ? Lấy thời gian từ local
const getAllMyTask = async () => {
  let currentDateTime = new Date();

  const url = `https://localhost:44334/api/v1/allmytask-page/all-task?dateTime=${currentDateTime.toISOString()}`;
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
