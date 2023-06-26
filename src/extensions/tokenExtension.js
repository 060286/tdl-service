const getTokenFromLocalStorage = () => {
  const key = "token";

  const token = localStorage.getItem(key);

  return JSON.parse(token);
};

export { getTokenFromLocalStorage };
