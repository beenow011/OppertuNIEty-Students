import { createBrowserRouter } from "react-router-dom";

import Hero from "../pages/Hero";

import { Layout } from "../Layout/Layout";
import CreateAccount from "../pages/CreateAccount";

export const BrowserRouter = createBrowserRouter([
  {
    element: <Layout />, // Wrap all routes with Layout
    children: [
      { path: "/", element: <Hero /> },
      { path: "/create-account", element: <CreateAccount /> },
    ],
  },
]);
