import axios from "axios";

import { getTokenFromLocalStorage } from "../extensions/tokenExtension";

import {
  NEXT_SEVEN_DAY,
  PATH_API,
  GET_DATA_NEXT_SEVEN_DAY_MY_LIST,
} from "../constants/pathApiConstant";

const getMyListNextSevenDayRequest = async (dateTime) => {
  const url = `${PATH_API}${NEXT_SEVEN_DAY}${GET_DATA_NEXT_SEVEN_DAY_MY_LIST}`;
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        dateTime: dateTime,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getMyListNextSevenDayRequest };
