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

const getUserListAdapter = async (id) => {
  try {
    const url = `https://localhost:44334/api/v1/workspace-page/${id}/user-in-workspace`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

const searchUserAdapter = async (keyword) => {
  try {
    const url = `https://localhost:44334/api/v1/user/search-user?keyword=${keyword}`;
    const token = getTokenFromLocalStorage();

    const users = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return users;
  } catch (error) {
    console.log(error);
  }
};

const searchUserInWorkspaceAdapter = async (workspaceId, keyword) => {
  try {
    const url = `https://localhost:44334/api/v1/workspace-page/search-user-workspace`;
    const token = getTokenFromLocalStorage();

    console.log(workspaceId);

    const users = await axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        workspaceId: workspaceId,
        keyword: keyword,
      },
    });

    return users;
  } catch (error) {
    console.log(error);
  }
};

const assignUserInWorkspace = async (email, todoId) => {
  try {
    const url = "https://localhost:44334/api/v1/workspace-page/assign-user";
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "PUT",
      url: url,
      data: {
        email: email,
        todoId: todoId,
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

export {
  getTodoInWorkspaceById,
  addUserIntoWorkspaceAdapter,
  getUserListAdapter,
  searchUserAdapter,
  searchUserInWorkspaceAdapter,
  assignUserInWorkspace,
};
