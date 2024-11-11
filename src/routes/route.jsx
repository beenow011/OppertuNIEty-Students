import { createBrowserRouter } from "react-router-dom";

import Hero from "../pages/Hero";

import { Layout } from "../Layout/Layout";
import CreateAccount from "../pages/CreateAccount";
import Dashboard from "../pages/Dashboard";
import CompleteSignup from "../pages/CompleteSignup";
import Profile from "../pages/Profile";
import ApplyCompanyList from "../pages/ApplyCompanyList";
import CompanyPage from "../pages/CompanyPage";
import AppliedCompanied from "../pages/AppliedCompanies";

export const BrowserRouter = createBrowserRouter([
  {
    element: <Layout />, // Wrap all routes with Layout
    children: [
      { path: "/", element: <Hero /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/complete-signup", element: <CompleteSignup /> },
      { path: "/profile", element: <Profile /> },
      { path: "/apply-company-list", element: <ApplyCompanyList /> },
      { path: "/apply-company-list/:id", element: <CompanyPage /> },
      { path: "applied-companies", element: <AppliedCompanied /> },
    ],
  },
]);
