import { createBrowserRouter } from "react-router-dom";

import Hero from "../pages/Hero";

import { Layout } from "../Layout/Layout";
import CreateAccount from "../pages/CreateAccount";
import Dashboard from "../pages/Dashboard";
import CompleteSignup from "../pages/CompleteSignup";

export const BrowserRouter = createBrowserRouter([
  {
    element: <Layout />, // Wrap all routes with Layout
    children: [
      { path: "/", element: <Hero /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/complete-signup", element: <CompleteSignup /> },
    ],
  },
]);
