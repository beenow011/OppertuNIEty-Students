import { Outlet } from "react-router-dom";
import Header from "../comp/Header";
import DocumentsReq from "../comp/DocumentsReq";
import { useWeb3Context } from "../context/useWeb3Context";

// Layout component that includes Header
export const Layout = ({ children }) => (
  <>
    <Header /> {/* Common Header component */}
    <DocumentsReq />
    <div className="content">
      <Outlet /> {/* Render the child route components here */}
    </div>
    {children} {/* Render page content */}
  </>
);
