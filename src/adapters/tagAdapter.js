import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

// ? This adapter use for update tag of todo
const updateTodoTagAdapter = async (data) => {
  try {
    const url = `https://localhost:44334/api/v1/todos/add-tag-todo`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "PUT",
      url: url,
      data: {
        todoId: data.todoId,
        tag: data.text,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export { updateTodoTagAdapter };
