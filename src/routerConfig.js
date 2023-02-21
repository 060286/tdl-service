import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import AllTaskPage from "./pages/AllTaskPage/AllTaskPage.jsx";
import MyDayPage from "./pages/MyDayPage/MyDayPage.jsx";
import NextSevenDay from "./pages/NextSevenDay/NextSevenDay.jsx";
import RegisterPage from "./pages/RegisterPage/index.js";
import LoginPage from "./pages/LoginPage/index.js";
import LayoutPage from "./pages/LayoutPage/index.js";

import ProtectedRoute from "./ProtectedRoute.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LayoutPage />}>
          <Route path="myday" element={<MyDayPage />}></Route>
          <Route path="tasks" element={<AllTaskPage />}></Route>
          <Route path="nextsevenday" element={<NextSevenDay />}></Route>
        </Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Route>
    </>
  )
);

export { router };
