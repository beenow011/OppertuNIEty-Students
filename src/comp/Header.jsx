import React from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";

function Header() {
  const navigate = useNavigate();
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  // const navigate = useNavigate();
  const handlelogout = () => {
    updateWeb3State({
      selectedAccount: null,
      signature: null,
    });
    localStorage.removeItem("token");

    navigate("/");
  };
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
        {selectedAccount && (
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
            <button
              onClick={handlelogout}
              className="bg-primary hover:bg-blue-600 text-dark-blue px-8 py-3 text-lg font-semibold rounded-full transition duration-300"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
