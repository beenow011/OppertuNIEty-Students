import React from "react";
import {
  getContractInstance,
  getNFTContractInstance,
} from "../utils/getContractInstance";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Settings,
  Cake,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useWeb3Context } from "../context/useWeb3Context";

function Profile() {
  const [user, setUser] = React.useState(null);
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [balanceNFT, setBalanceNFT] = React.useState(0);

  const getUser = async () => {
    try {
      const contract = await getContractInstance();
      const tx = await contract.getUserProfile();
      setUser(tx);
    } catch (error) {
      console.error(error);
    }
  };

  const getNftBalance = async () => {
    try {
      const contract = await getNFTContractInstance();
      const balance = await contract.balanceOfNFT(selectedAccount);
      setBalanceNFT(balance);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  React.useEffect(() => {
    if (selectedAccount) {
      getNftBalance();
    }
  }, [selectedAccount]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  const [
    name,
    xPercentage,
    xiiPercentage,
    cgpa,
    dob,
    phone,
    email,
    coreSkills,
  ] = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* NFT Balance Card */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 mb-8 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-300">
                  NFT Collection
                </h2>
                <p className="text-purple-200/80">Your Achievement Tokens</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-300">
                {balanceNFT.toString()}
              </div>
              <p className="text-purple-200/80">Total NFTs</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="p-1 bg-gray-900 rounded-full">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Personal Information */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center">
                {name}
                <Sparkles className="ml-2 w-5 h-5 text-yellow-400" />
              </h2>
              <p className="text-blue-400 mt-1">
                Software Developer & Engineer
              </p>
            </div>

            {/* Academic Information */}
            <div className="py-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                <GraduationCap className="mr-2" /> Academic Achievement
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">10th Percentage</p>
                  <p className="text-2xl font-bold text-white">
                    {xPercentage}%
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">12th Percentage</p>
                  <p className="text-2xl font-bold text-white">
                    {xiiPercentage}%
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">CGPA</p>
                  <p className="text-2xl font-bold text-white">{cgpa}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="py-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Contact Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Cake className="text-blue-400 w-5 h-5" />
                  <span>{dob}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="text-blue-400 w-5 h-5" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="text-blue-400 w-5 h-5" />
                  <span>{email}</span>
                </div>
              </div>
            </div>

            {/* Core Skills */}
            <div className="pt-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                <Settings className="mr-2" /> Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {coreSkills &&
                  coreSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
