import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import { AlertCircle, Trophy, Gift } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { getNFTContractInstance } from "../utils/getContractInstance";

const getRandomColor = () => {
  const colors = [
    "bg-yellow-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomAnimation = () => {
  const animations = [
    "animate-confetti-slow",
    "animate-confetti-medium",
    "animate-confetti-fast",
  ];
  return animations[Math.floor(Math.random() * animations.length)];
};

const ConfettiParticle = ({ index }) => {
  const left = `${Math.random() * 100}%`;
  const size = Math.random() * 0.5 + 0.5; // Random size between 0.5 and 1

  return (
    <div
      className={`absolute ${getRandomAnimation()} ${getRandomColor()}`}
      style={{
        left,
        top: "-20px",
        width: `${size}rem`,
        height: `${size}rem`,
        transform: `rotate(${Math.random() * 360}deg)`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 2 + 2}s`,
      }}
    />
  );
};

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(100)].map((_, i) => (
      <ConfettiParticle key={i} index={i} />
    ))}
  </div>
);

function CompletedContest() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState(false);
  const [balanceNFT, setBalanceNFT] = useState(0);

  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;

  const fetchContestData = async () => {
    try {
      const [contestRes, standingsRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/contest/get-contest-by-id/${id}?address=${selectedAccount}`
        ),
        axios.get(
          `http://localhost:3000/api/contest/get-result/${id}?address=${selectedAccount}`
        ),
      ]);
      setContest(contestRes.data.contest);
      setStandings(standingsRes.data.results);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching contest data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    const contract = await getNFTContractInstance();
    const balance = await contract.balanceOfNFT(selectedAccount);
    setBalanceNFT(balance);
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchContestData();
      fetchBalance();
    }
  }, [id, selectedAccount]);

  useEffect(() => {
    if (standings[0]?.studentId.userAddress === selectedAccount) {
      setWinner(true);
    }
  }, [selectedAccount, standings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <AlertCircle className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    );
  }

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-white";
    }
  };

  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-400/10";
      case 1:
        return "bg-gray-400/10";
      case 2:
        return "bg-amber-600/10";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {winner && <Confetti />}
      <div className="max-w-4xl mx-auto">
        {/* Winner Message */}
        {winner && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-yellow-500">
                🎉 Congratulations Champion! 🏆
              </h3>
            </div>
            <p className="text-yellow-100">
              You've won the contest! Your NFT collection now stands at{" "}
              {balanceNFT.toString()} tokens. Keep up the excellent work!
            </p>
          </div>
        )}

        {/* Contest Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {contest?.contestName}
              </h1>
              <p className="text-gray-400">
                Total Participants: {standings.length}
              </p>
            </div>
          </div>
        </div>

        {/* Standings Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Standings</h2>
          </div>

          <div className="p-4">
            {standings.length > 0 ? (
              <div className="space-y-3">
                {standings.slice(0, 10).map((result, index) => (
                  <div
                    key={result._id}
                    className={`${getBackgroundColor(
                      index
                    )} rounded-lg p-4 transition-all hover:scale-[1.01] border border-gray-700 ${
                      result.studentId.userAddress === selectedAccount
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex items-center ${getMedalColor(
                            index
                          )}`}
                        >
                          {index < 3 ? (
                            <Trophy className="w-6 h-6" />
                          ) : (
                            <span className="text-lg font-medium w-6 text-center">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium text-white">
                            {result.studentId.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {result.studentId.usn}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-400">
                          {result.score} points
                        </div>
                        <div className="text-sm text-gray-400">
                          Time: {result.timeTaken}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No participants yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedContest;
