import React, { useState } from "react";
import { connectWallet } from "../utils/connectWallet";
import axios from "axios";
import { useWeb3Context } from "../context/useWeb3Context";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AlumniSignup() {
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAccountFromWallet, setSelectedAccountFromWallet] =
    useState(null);
  const [signatureFromWallet, setSignatureFromWallet] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const [alumniData, setAlumniData] = useState({
    name: "",
    passingYear: "",
    company: "",
  });

  const handleConnectWallet = async () => {
    try {
      const { selectedAccount, signature } = await connectWallet();
      setWalletConnected(true);
      setSelectedAccountFromWallet(selectedAccount);
      setSignatureFromWallet(signature);
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to wallet");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlumniData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/alumini/sign-up?address=${selectedAccountFromWallet}`,
        {
          ...alumniData,
          signature: signatureFromWallet,
        }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        updateWeb3State({
          selectedAccount: selectedAccountFromWallet,
          signature: signatureFromWallet,
        });
        toast.success("Successfully signed up!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating account");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-5 bg-dark-blue text-white rounded-lg shadow-lg">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
        <p className="mb-4">
          To proceed, please connect your MetaMask wallet to verify your
          identity.
        </p>
        <button
          onClick={handleConnectWallet}
          className={`${
            walletConnected ? "bg-green-500" : "bg-primary"
          } text-dark-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300`}
        >
          {walletConnected ? "Wallet Connected" : "Connect MetaMask"}
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Alumni Information</h2>
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
              value={alumniData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Enter your company name"
              className="w-full p-3 rounded-lg bg-gray-900 text-white"
              value={alumniData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">
              Passing Year
            </label>
            <select
              name="passingYear"
              className="w-full px-4 py-2 border rounded-md bg-gray-800 text-white"
              value={alumniData.passingYear}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Passing Year
              </option>
              {Array.from({ length: 10 }, (_, i) => 2023 - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="p-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 w-full"
            disabled={submitLoading || !walletConnected}
          >
            {submitLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AlumniSignup;
