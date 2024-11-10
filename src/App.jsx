import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import { BrowserRouter } from "./routes/route";
import { RouterProvider } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { useWeb3Context } from "./context/useWeb3Context";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const { Web3State, updateWeb3State, StudentState, setStudentState } =
    useWeb3Context();
  const { selectedAccount } = Web3State;

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      console.log(decoded);
      updateWeb3State({ selectedAccount: decoded.userAddress });
    }
  }, []);

  const getStudentDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api//student-auth/student-data?address=" +
          selectedAccount
      );
      console.log(res.data);
      setStudentState({
        name: res.data.user.name,
        branch: res.data.user.branch,
        usn: res.data.user.usn,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("StudentDetails", StudentState);
  useEffect(() => {
    if (selectedAccount) {
      getStudentDetails();
      // console.log("StudentDetails", StudentState);
    }
  }, [selectedAccount]);

  return (
    <div className="bg-gray-950 w-full h-full">
      <RouterProvider router={BrowserRouter}></RouterProvider>
    </div>
  );
}

export default App;
