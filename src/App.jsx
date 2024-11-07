import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter } from "./routes/route";
import { RouterProvider } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { useWeb3Context } from "./context/useWeb3Context";

function App() {
  const [count, setCount] = useState(0);
  const { updateWeb3State, Web3State } = useWeb3Context();

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      console.log(decoded);
      updateWeb3State({ selectedAccount: decoded.userAddress });
    }
  }, []);

  return (
    <div className="bg-gray-950 w-full h-full">
      <RouterProvider router={BrowserRouter}></RouterProvider>
    </div>
  );
}

export default App;
