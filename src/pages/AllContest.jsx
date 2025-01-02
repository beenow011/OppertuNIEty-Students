import React, { useEffect, useState } from "react";
import { Clock, Calendar, ChevronRight, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3Context } from "../context/useWeb3Context";
import axios from "axios";
import { use } from "react";
import { useNavigate } from "react-router-dom";

function AllContest() {
  const [allContest, setAllContest] = useState([]);
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  useEffect(() => {
    const fetchAllContest = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/contest/get-all-contests?address=${selectedAccount}`
        );
        if (res.status === 200) {
          setAllContest(res.data.contests);
        }
      } catch (error) {
        console.error(error);
      }
    };
    selectedAccount && fetchAllContest();
  }, [selectedAccount]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navigate = useNavigate();

  const handleContestClick = (contest) => {
    if (contest.contestStatus) {
      // toast.success(`Opening ${contest.contestName}`);
      navigate(`/contest/${contest._id}`);
    } else {
      toast.error(`Contest ${contest.contestName} is inactive`);
    }
    // Add your navigation logic here
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Available Contests
        </h1>

        <div className="grid gap-6">
          {allContest.map((contest) => (
            <div
              key={contest._id}
              onClick={() => handleContestClick(contest)}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {contest.contestName}
                </h2>
                <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-full">
                  <HelpCircle size={16} className="text-blue-400" />
                  <span className="text-sm text-blue-400">
                    {contest.questions.length} Questions
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={18} />
                  <span>{formatDate(contest.scheduledTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock size={18} />
                  <span>{formatTime(contest.scheduledTime)}</span>
                </div>
                <ChevronRight
                  className="ml-auto text-gray-400 group-hover:text-white transition-colors duration-300"
                  size={20}
                />
              </div>

              <div className="mt-4 flex gap-2">
                {contest.contestStatus ? (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm text-red-400">Inactive</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllContest;
