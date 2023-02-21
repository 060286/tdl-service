import { Outlet } from "react-router";
import LoginPage from "./pages/LoginPage";

import { getTokenFromLocalStorage } from "./extensions/tokenExtension";

const ProtectedRoute = () => {
  const isAuth = getTokenFromLocalStorage() != null;

  return isAuth ? <Outlet /> : <LoginPage />;
};

export default ProtectedRoute;
