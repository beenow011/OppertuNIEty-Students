import React, { useState } from "react";
import { connectWallet } from "../utils/connectWallet";
import axios from "axios";
import { useWeb3Context } from "../context/useWeb3Context";

function CreateAccount() {
  const { updateWeb3State, Web3State } = useWeb3Context();
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAccountFromWallet, setSelectedAccountFromWallet] =
    useState(null);
  const [signatureFromWallet, setSignatureFromWallet] = useState(null);
  const [studentData, setStudentData] = useState({
    name: "",
    usn: "",
    branch: "",
    graduationYear: "",
  });

  const handleConnectWallet = async () => {
    try {
      const { selectedAccount, signature } = await connectWallet();
      setWalletConnected(true);
      setSelectedAccountFromWallet(selectedAccount);
      setSignatureFromWallet(signature);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAccount();
  };

  const createAccount = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/student-auth/create-account?address=${selectedAccountFromWallet}`,
        { studentData, signatureFromWallet }
      );
      if (res.status === 200) {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        updateWeb3State({ selectedAccount, signature });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-account max-w-4xl mx-auto p-8 mt-5 bg-dark-blue text-white rounded-lg shadow-lg">
      {/* Section 1: Connect Wallet */}
      <section className="wallet-section mb-8">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
        <p className="mb-4">
          To proceed, please connect your MetaMask wallet. This will allow us to
          securely store and manage your data on the blockchain.
        </p>
        <button
          onClick={handleConnectWallet}
          className="bg-primary text-dark-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          {walletConnected ? "Wallet Connected" : "Connect MetaMask"}
        </button>
      </section>

      {/* Section 2: Student Information Form */}
      <section className="info-form-section mb-8">
        <h2 className="text-2xl font-bold mb-4">Student Information</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg bg-gray-900 text-white"
              value={studentData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">USN</label>
            <input
              type="text"
              name="usn"
              placeholder="Enter your USN"
              className="w-full p-3 rounded-lg bg-gray-900 text-white"
              value={studentData.usn}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Branch</label>
            <select
              name="branch"
              className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white"
              value={studentData.branch}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Branch
              </option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IP">IP</option>
              <option value="AIML">AIML</option>
              <option value="ECE">ECE</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Graduation Year
            </label>
            <select
              name="graduationYear"
              className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white"
              value={studentData.graduationYear}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Graduation Year
              </option>
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Create Account
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateAccount;
