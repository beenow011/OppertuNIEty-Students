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
import PrepareCompany from "../pages/PrepareCompany";
import StudyMaterial from "../pages/StudyMaterial";
import Faq from "../pages/Faq";
import MockInterview from "../pages/MockInterview";
import InterviewPage from "../pages/interviewPage";
import InterviewSession from "../pages/InterviewSession";

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
      { path: "/applied-companies", element: <AppliedCompanied /> },
      { path: "/prepare/:id", element: <PrepareCompany /> },
      { path: "/company/:id", element: <CompanyPage /> },
      { path: "study-material/:id", element: <StudyMaterial /> },
      { path: "/faq/:id", element: <Faq /> },
      { path: "/mock-interview/:id", element: <MockInterview /> },
      { path: "/mock-interview/:type/:id", element: <InterviewPage /> },
      {
        path: "/interview/:type/:id",
        element: <InterviewSession />,
      },
    ],
  },
]);
