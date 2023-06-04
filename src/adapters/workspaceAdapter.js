import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

const getTodoInWorkspaceById = async (id) => {
  try {
    const token = getTokenFromLocalStorage();
    const url = `https://localhost:44334/api/v1/workspace-page/${id}/todos`;

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (ex) {
    console.log(ex);
  }
};

const addUserIntoWorkspaceAdapter = async (email, id) => {
  try {
    const url = `https://localhost:44334/api/v1/workspace-page/add-user-workspace`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      url: url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: email,
        workspaceId: id,
      },
    });

    return response;
  } catch (ex) {
    console.log(ex);
  }
};

export { getTodoInWorkspaceById, addUserIntoWorkspaceAdapter };
