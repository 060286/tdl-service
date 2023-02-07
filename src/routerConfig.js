import { createBrowserRouter } from "react-router-dom";
import AllTaskPage from "./pages/AllTaskPage/AllTaskPage.jsx";
import MyDayPage from "./pages/MyDayPage/MyDayPage.jsx";
import NextSevenDay from "./pages/NextSevenDay/NextSevenDay.jsx";

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
]);

export { router };
