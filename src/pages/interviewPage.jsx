import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import { getContractInstance } from "../utils/getContractInstance";
import { Loader2, PlusCircle, X, Check } from "lucide-react";

function InterviewPage() {
  const { id, type } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coreSkills, setCoreSkills] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const navigate = useNavigate();

  // Interview type conversion utility
  const convertType = (inputType) => {
    const typeMap = {
      "technical-interview": "Technical",
      "managerial-interview": "Managerial",
      "hr-interview": "HR",
      "group-discussion": "Group Discussion",
      default: "Technical Interview",
    };
    return typeMap[inputType] || typeMap.default;
  };

  // Fetch user skills from contract
  const fetchUserSkills = async () => {
    try {
      setUserLoading(true);
      const contract = await getContractInstance();
      const userProfile = await contract.getUserProfile();

      // Convert skills to comma-separated string
      const skills = Array.isArray(userProfile[7])
        ? userProfile[7].join(", ")
        : userProfile[7];

      setCoreSkills(skills);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user skills");
    } finally {
      setUserLoading(false);
    }
  };

  // Create interview session
  const createSession = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/mock-interview/create-interview-session?address=${selectedAccount}`,
        {
          companyId: id,
          interviewType: convertType(type),
          skills: coreSkills, // Send skills as a string
        }
      );
      setSessions((prev) => [...prev, res.data.data]);
      toast.success("Session created successfully!");
      navigate(`/interview/${type}/${res.data.data._id}`);
    } catch (err) {
      console.log(err);
      toast.error("Error creating session");
    }
  };

  // Fetch existing sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!id || !type || !selectedAccount) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/mock-interview/get-interview-session/${id}/${convertType(
            type
          )}?address=${selectedAccount}`
        );

        if (res.data.data.length > 0) {
          setSessions(res.data.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to get sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [id, type, selectedAccount]);

  // Skills Modal Component
  const SkillsModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Add Skills</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Fetch Skills Button */}
          <button
            onClick={fetchUserSkills}
            disabled={userLoading}
            className="w-full mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
          >
            {userLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <>
                <PlusCircle className="mr-2" size={20} />
                Get User Skills
              </>
            )}
          </button>

          {/* Skills Textarea */}
          <textarea
            value={coreSkills}
            onChange={(e) => setCoreSkills(e.target.value)}
            placeholder="Enter skills separated by commas..."
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                createSession();
                setShowModal(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <Check className="mr-2" size={20} />
              Create Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Skills Modal */}
      {showModal && <SkillsModal />}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {convertType(type)} Interview Sessions
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            Create Session
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-blue-500" />
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => navigate(`/interview/${type}/${session._id}`)}
                className="bg-gray-800 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:bg-gray-700 transition transform hover:-translate-y-1 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">
                    {session.interviewType}
                  </h2>
                  <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {session.skills || "Created for your career growth"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-xl text-gray-500 mb-4">
              No interview sessions available
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircle size={20} />
              Create First Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewPage;
