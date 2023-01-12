import axios from "axios";

const getTodo = async () => {
  const response = await axios
    .get("https://localhost:44334/api/v1/myday-page/todos")
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return response;
};

export { getTodo };
