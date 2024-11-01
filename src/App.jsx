import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter } from "./routes/route";
import { RouterProvider } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-gray-950 w-full h-full">
      <RouterProvider router={BrowserRouter}></RouterProvider>
    </div>
  );
}

export default App;
