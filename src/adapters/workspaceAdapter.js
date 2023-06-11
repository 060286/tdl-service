import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";
import { CREATE_WORKSPACE_URL, PATH_API } from "../constants/pathApiConstant";

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

const createTodoInWorkspace = async (
  title,
  description,
  sectionName,
  position,
  id
) => {
  try {
    const token = getTokenFromLocalStorage();
    const url =
      "https://localhost:44334/api/v1/workspace-page/add-todo-workspace";

    const response = await axios({
      url: url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        sectionName: sectionName,
        title: title,
        workspaceId: id,
        position,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

const getNotificationsAdapter = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const url = "https://localhost:44334/api/v1/user/notifications";

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

const getWorkspacesAdapter = async () => {
  try {
    const token = getTokenFromLocalStorage();
    const url = "https://localhost:44334/api/v1/workspace-page/workspaces";

    const response = axios({
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

const createCategoryByTitleAdapter = async (categoryTitle) => {
  try {
    const token = getTokenFromLocalStorage();
    const url = `https://localhost:44334/api/v1/all-list-page/create-todo-category`;

    const response = await axios({
      url: url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: categoryTitle,
        description: `description of ${categoryTitle}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

const getCategoryAdapter = async () => {
  try {
    const url = "https://localhost:44334/api/v1/todos/todo-categories";
    const token = getTokenFromLocalStorage();

    const response = axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {}
};

const createWorkspaceAdapter = async (workspaceTitle, workspaceDesc) => {
  try {
    // TODO Create Workspace
    const url = `${PATH_API}${CREATE_WORKSPACE_URL}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "POST",
      url: url,
      data: {
        name: workspaceTitle,
        description: workspaceDesc,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {}
};

const updateNotifyByIdAdapter = async (id) => {
  try {
    const url = `https://localhost:44334/api/v1/user/${id}/update-notify-status`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "PUT",
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

export {
  getTodoInWorkspaceById,
  addUserIntoWorkspaceAdapter,
  getUserListAdapter,
  searchUserAdapter,
  searchUserInWorkspaceAdapter,
  assignUserInWorkspace,
  createTodoInWorkspace,
  getWorkspacesAdapter,
  getNotificationsAdapter,
  createCategoryByTitleAdapter,
  getCategoryAdapter,
  createWorkspaceAdapter,
  updateNotifyByIdAdapter,
};
