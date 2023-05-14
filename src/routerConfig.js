import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AllTaskPage from "./pages/AllTaskPage/AllTaskPage.jsx";
import MyDayPage from "./pages/MyDayPage2/MyDayPage2.jsx";
import NextSevenDay from "./pages/NextSevenDay/NextSevenDay.jsx";
import RegisterPage from "./pages/RegisterPage/index.js";
import LoginPage from "./pages/LoginPage/index.js";
import LayoutPage from "./pages/LayoutPage/index.js";

import ProtectedRoute from "./ProtectedRoute.js";
import TodoByCategory from "./pages/TodoByCategory/TodoByCategory.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LayoutPage />}>
          <Route path="/myday" element={<MyDayPage />}></Route>
          <Route path="/tasks" element={<AllTaskPage />}></Route>
          <Route path="/nextsevenday" element={<NextSevenDay />}></Route>
          <Route path="/category/:id" element={<TodoByCategory />}></Route>
        </Route>
      </Route>
    </>
  )
);

export { router };
