import axios from "axios";
import {
  LOGIN_METHOD,
  PATH_API,
  USER_PAGE,
  REGISTER_METHOD,
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

    console.log({ response });

    return response.data;
  } catch (error) {
    return error.response.data;
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

    console.log({
      email,
      firstname,
      lastname,
      username,
      password,
      confirmpassword,
      phoneNumber,
      temp: "temp",
    });

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
