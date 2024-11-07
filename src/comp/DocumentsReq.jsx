import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/useWeb3Context";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function DocumentsReq() {
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount, setSelectedAccount } = Web3State;
  const [studentStatus, setStudentStatus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route location

  const getStudentStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/student-auth/student-status?address=${selectedAccount}`
      );
      if (res.status === 200) {
        setStudentStatus(res.data.status);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching student status");
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getStudentStatus();
    }
  }, [selectedAccount, navigate]);

  // Prevent rendering if the current route is /complete-signup
  if (location.pathname === "/complete-signup") {
    return null;
  }

  return (
    !studentStatus && (
      <div className="signup-prompt bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <h2 className="font-bold text-lg">Complete Your Signup</h2>
        <p className="text-sm mt-1">
          Please complete your signup process by filling in your student
          information.
        </p>
        <button
          className="mt-3 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
          onClick={() => navigate("/complete-signup")}
        >
          Complete Signup
        </button>
      </div>
    )
  );
}

export default DocumentsReq;
