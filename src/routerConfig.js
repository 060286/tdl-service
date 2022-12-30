import { createBrowserRouter } from "react-router-dom";
import AllTaskPage from "./pages/AllTaskPage";
import MyDayPage from "./pages/MyDayPage";
import NextSevenDay from "./pages/NextSevenDay";

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
