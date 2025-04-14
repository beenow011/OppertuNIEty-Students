import React, { useEffect, useState } from "react";
import {
  LogIn,
  UserPlus,
  Zap,
  GraduationCap,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import toast from "react-hot-toast";
import axios from "axios";
import { useWeb3Context } from "../context/useWeb3Context";

function AccountCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlumniOptions, setShowAlumniOptions] = useState(false);
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;

  useEffect(() => {
    if (selectedAccount) {
      navigate("/dashboard");
    }
  }, [selectedAccount, navigate]);

  const handleStudentLogin = async () => {
    try {
      setLoading(true);
      const { selectedAccount, signature } = await connectWallet();
      const url =
        "http://localhost:3000/api/student-auth/login?address=" +
        selectedAccount;
      const res = await axios.post(url, { signature });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniLogin = async () => {
    try {
      setLoading(true);
      const { selectedAccount, signature } = await connectWallet();
      // Adjust the URL for alumni login
      const url =
        "http://localhost:3000/api/alumni-auth/login?address=" +
        selectedAccount;
      const res = await axios.post(url, { signature });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/alumni-dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#112240] bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-900/30 transform transition-all duration-500">
        {/* Animated logo/title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-text-shimmer">
            OpportuNIEty
          </h2>
          <p className="text-lg text-gray-300 opacity-80">
            Your gateway to endless possibilities
          </p>
        </div>

        {/* Account action buttons */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center space-x-2 text-white">
              <Zap className="animate-pulse text-yellow-400" size={24} />
              <span>Connecting to wallet...</span>
            </div>
          ) : !showAlumniOptions ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Student Login Button */}
                <button
                  onClick={handleStudentLogin}
                  className="group relative overflow-hidden py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn size={24} className="group-hover:animate-bounce" />
                    <span>Student Login</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>

                {/* Student Sign Up Button */}
                <button
                  onClick={() => navigate("/create-account")}
                  className="group relative overflow-hidden py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus size={24} className="group-hover:animate-pulse" />
                    <span>Student Sign Up</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Alumni Option Button */}
              <button
                onClick={() => setShowAlumniOptions(true)}
                className="w-full group relative overflow-hidden py-3 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="flex items-center justify-center space-x-2">
                  <GraduationCap
                    size={24}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span>Continue as Alumni</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Alumni Login Button */}
                <button
                  onClick={handleAlumniLogin}
                  className="group relative overflow-hidden py-3 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn size={24} className="group-hover:animate-bounce" />
                    <span>Alumni Login</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>

                {/* Alumni Sign Up Button */}
                <button
                  onClick={() => navigate("/alumni-signup")}
                  className="group relative overflow-hidden py-3 px-6 rounded-lg bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus size={24} className="group-hover:animate-pulse" />
                    <span>Alumni Sign Up</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => setShowAlumniOptions(false)}
                className="w-full group relative overflow-hidden py-3 px-6 rounded-lg bg-gray-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowLeft
                    size={24}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span>Back to Student Options</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>

        {/* Decorative tech lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-50"></div>
      </div>
    </div>
  );
}

export default AccountCheck;
