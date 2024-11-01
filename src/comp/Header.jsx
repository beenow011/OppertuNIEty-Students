import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-dark-blue text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-2xl font-bold tracking-wider flex items-center"
          onClick={() => navigate("/")}
        >
          <h1 className=" font-extrabold cursor-pointer">
            <span className="text-slate-400">Opportu</span>
            <span className="text-blue-500">NIE</span>
            <span className="text-slate-400">ty</span>
          </h1>
        </div>
        <nav className="flex space-x-8">
          <a
            href="#overview"
            className="hover:text-primary transition duration-200"
          >
            Overview
          </a>
          <a
            href="#features"
            className="hover:text-primary transition duration-200"
          >
            Features
          </a>
          <a
            href="#resources"
            className="hover:text-primary transition duration-200"
          >
            Resources
          </a>
          <a
            href="#contact"
            className="hover:text-primary transition duration-200"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
