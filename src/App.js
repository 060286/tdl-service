import React from "react";

import { RouterProvider } from "react-router-dom";
import { router } from "./routerConfig";

import { store } from "./store";
import { Provider } from "react-redux";

import "./style.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
