import { useState } from "react";
import { Web3Context } from "./createWeb3Context";
const Web3Provider = ({ children }) => {
  const [Web3State, setWeb3State] = useState({
    contractInstance: null,
    selectedAccount: null,
    signature: null,
  });
  const [StudentState, setStudentState] = useState({
    name: null,
    branch: null,
    usn: null,
  });
  const updateWeb3State = (newState) => {
    setWeb3State((prevState) => ({ ...prevState, ...newState }));
  };
  return (
    <Web3Context.Provider
      value={{ Web3State, updateWeb3State, StudentState, setStudentState }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
