import axios from "axios";

const getAllMyTask = async () => {
  const url =
    "https://localhost:44334/api/v1/allmytask-page/all-task?dateTime=01%2F21%2F2023";

  const response = await axios({
    url: url,
    method: "get",
  });

  return response.data;
};

const getTaskDetail = async (id) => {
  try {
    const url = `https://localhost:44334/api/v1/myday-page/${id}/todo`;

    const response = await axios({
      url: url,
      method: "get",
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getAllMyTask, getTaskDetail };
