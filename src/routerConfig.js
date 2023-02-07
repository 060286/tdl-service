import { createBrowserRouter } from "react-router-dom";
import AllTaskPage from "./pages/AllTaskPage/AllTaskPage.jsx";
import MyDayPage from "./pages/MyDayPage/MyDayPage.jsx";
import NextSevenDay from "./pages/NextSevenDay/NextSevenDay.jsx";
import RegisterPage from "./pages/RegisterPage/index.js";
import LoginPage from "./pages/LoginPage/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyDayPage />,
  },
  {
    path: "/task/next-seven-days",
    element: <NextSevenDay />,
  },
  {
    path: "/task/all-task",
    element: <AllTaskPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export { router };
