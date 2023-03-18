import { Outlet } from "react-router";
import LoginPage from "./pages/LoginPage";

import { getTokenFromLocalStorage } from "./extensions/tokenExtension";

const ProtectedRoute = () => {
  const isAuth = getTokenFromLocalStorage() != null;
  // TODO: send request to be to validate token
  return isAuth ? <Outlet /> : <LoginPage />;
};

export default ProtectedRoute;
