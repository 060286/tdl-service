import axios from "axios";
import {
  LOGIN_METHOD,
  PATH_API,
  USER_PAGE,
  REGISTER_METHOD,
  USERINFO,
} from "../constants/pathApiConstant";

import { getUserName } from "../extensions/stringExtention";

export const login = async ({ username, password }) => {
  const url = `${PATH_API}${USER_PAGE}${LOGIN_METHOD}`;

  try {
    const response = await axios({
      url: url,
      method: "post",
      data: {
        userName: username,
        password: password,
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserInfoAdapter = async (token) => {
  const url = `${PATH_API}${USER_PAGE}${USERINFO}`;

  try {
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (exeption) {
    console.log(exeption);
  }
};

export const register = async ({
  email,
  firstname,
  lastname,
  username,
  password,
  confirmpassword,
  phoneNumber,
}) => {
  try {
    const url = `${PATH_API}${USER_PAGE}${REGISTER_METHOD}`;
    username = getUserName(email);

    const response = await axios({
      url: url,
      method: "post",
      data: {
        email: email,
        firstName: firstname,
        lastName: lastname,
        userName: username,
        password: password,
        confirmedPassword: confirmpassword,
        phoneNumber: phoneNumber,
      },
    });

    console.log({ response, step: "adapter" });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
