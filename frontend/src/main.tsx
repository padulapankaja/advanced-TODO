import React from "react";
import { Provider } from "react-redux";
import { store } from "./state/store.js";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types
/// remove as types