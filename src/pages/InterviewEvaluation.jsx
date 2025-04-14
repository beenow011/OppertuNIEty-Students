import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, MessageSquare, Star, TrendingUp } from "lucide-react";

function InterviewEvaluation() {
  const { id } = useParams();
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;

  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [evaluatingId, setEvaluatingId] = useState(null);

  const fetchConversation = async () => {
    if (!id || !selectedAccount) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/mock-interview/get-interview-conversation?address=${selectedAccount}`,
        { sessionId: id }
      );

      if (res.data.data.length > 0) {
        setConversation(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to retrieve conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateAnswer = async (question, answer, messageId) => {
    setEvaluatingId(messageId);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/mock-interview/evaluate-answer?address=${selectedAccount}`,
        {
          question,
          answer,
          sessionId: id,
        }
      );

      if (res.data.data) {
        setEvaluations((prev) => ({
          ...prev,
          [messageId]: res.data.data,
        }));
        toast.success("Evaluation completed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate answer");
    } finally {
      setEvaluatingId(null);
    }
  };

  useEffect(() => {
    if (selectedAccount && id) {
      fetchConversation();
    }
  }, [id, selectedAccount]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Group questions and answers together
  const getQAPairs = () => {
    const pairs = [];
    for (let i = 0; i < conversation.length - 1; i++) {
      if (!conversation[i].isUserMsg && conversation[i + 1].isUserMsg) {
        pairs.push({
          question: conversation[i],
          answer: conversation[i + 1],
        });
      }
    }
    return pairs;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Interview Evaluation
          </h1>
          <p className="text-gray-400">Question and Answer Analysis</p>
        </div>

        {/* Questions and Answers with Evaluation */}
        {getQAPairs().map(({ question, answer }, index) => (
          <div
            key={question._id}
            className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 shadow-xl backdrop-blur"
          >
            {/* Question */}
            <div className="mb-4 rounded-lg bg-gray-700 p-4 text-white">
              <p className="mb-2 font-semibold text-green-400">
                Question {index + 1}:
              </p>
              <p>{question.message}</p>
            </div>

            {/* Answer */}
            <div className="mb-4 rounded-lg bg-gray-700 p-4 text-white">
              <p className="mb-2 font-semibold text-blue-400">Your Answer:</p>
              <p>{answer.message}</p>
            </div>

            {/* Evaluate Button */}
            <div className="mb-4">
              <button
                onClick={() =>
                  evaluateAnswer(question.message, answer.message, answer._id)
                }
                disabled={
                  evaluatingId === answer._id || evaluations[answer._id]
                }
                className={`rounded-lg px-4 py-2 font-semibold text-white transition-all
                  ${
                    evaluatingId === answer._id
                      ? "bg-gray-500 cursor-not-allowed"
                      : evaluations[answer._id]
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {evaluatingId === answer._id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Evaluating...
                  </span>
                ) : evaluations[answer._id] ? (
                  "Evaluated"
                ) : (
                  "Evaluate Answer"
                )}
              </button>
            </div>

            {/* Feedback Section */}
            {evaluations[answer._id] && (
              <div className="rounded-lg bg-gray-700/50 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  Feedback
                </h3>
                <p className="text-gray-200 whitespace-pre-line">
                  {evaluations[answer._id]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewEvaluation;
