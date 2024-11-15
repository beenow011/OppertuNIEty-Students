import React from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import { User, Layers, Star, BookOpen, Mail, LogOut } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const { updateWeb3State, Web3State, StudentState } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const { name } = StudentState;
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
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-3xl font-extrabold tracking-wider flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1>
            <span className="text-gray-300">Opportu</span>
            <span className="text-blue-500">NIE</span>
            <span className="text-gray-300">ty</span>
          </h1>
        </div>

        {/* Navigation Links */}
        {selectedAccount && (
          <nav className="hidden md:flex items-center space-x-6 text-lg">
            {/* Profile */}
            <div className="group relative">
              <a
                href="/profile"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                <User className="w-5 h-5" />
              </a>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm bg-gray-700 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Profile
              </span>
            </div>

            {/* Overview */}
            <div className="group relative">
              <a
                href="/dashboard"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                <Layers className="w-5 h-5" />
              </a>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm bg-gray-700 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Dashboard
              </span>
            </div>

            {/* Features */}
            <div className="group relative">
              <a
                href="#features"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                <Star className="w-5 h-5" />
              </a>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm bg-gray-700 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Features
              </span>
            </div>

            {/* Resources */}
            <div className="group relative">
              <a
                href="#resources"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                <BookOpen className="w-5 h-5" />
              </a>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm bg-gray-700 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Resources
              </span>
            </div>

            {/* Contact */}
            <div className="group relative">
              <a
                href="#contact"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200 ease-in-out"
              >
                <Mail className="w-5 h-5" />
              </a>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm bg-gray-700 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Contact
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handlelogout}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold transition duration-300 ease-in-out shadow-md"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
