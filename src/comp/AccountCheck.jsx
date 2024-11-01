import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccountCheck() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-dark-blue text-white p-6 fixed inset-0  w-96 m-auto z-[100] rounded-lg shadow-lg shadow-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Welcome to OpportuNIEty
      </h2>
      <p className="text-lg md:text-xl mb-8 text-center max-w-md">
        Do you already have an account, or are you new here?
      </p>

      <div className="flex gap-6">
        {/* Existing User */}
        <button className="flex items-center bg-gray-800 text-primary px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
          <LogIn size={24} className="mr-2" />
          <span className="text-lg font-semibold">Log In</span>
        </button>

        {/* New User */}
        <button
          className="flex items-center bg-primary text-dark-blue px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          onClick={() => navigate("/create-account")}
        >
          <UserPlus size={24} className="mr-2" />
          <span className="text-lg font-semibold">Sign Up</span>
        </button>
      </div>
    </div>
  );
}

export default AccountCheck;
