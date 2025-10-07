import { createBrowserRouter } from "react-router-dom";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { default: Login } = await import("./pages/Login");
      return { element: React.createElement(Login) };
    },
  },
  {
    path: "/register",
    lazy: async () => {
      const { default: Register } = await import("./pages/Register");
      return { element: React.createElement(Register) };
    },
  },
  {
    path: "/dashboard",
    lazy: async () => {
      const { default: Dashboard } = await import("./pages/Dashboard");
      return { element: React.createElement(Dashboard) };
    },
  },
]);
