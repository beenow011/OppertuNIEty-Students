import { Outlet } from "react-router-dom";
import Header from "../comp/Header";

// Layout component that includes Header
export const Layout = ({ children }) => (
  <>
    <Header /> {/* Common Header component */}
    <div className="content">
      <Outlet /> {/* Render the child route components here */}
    </div>
    {children} {/* Render page content */}
  </>
);
