import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import toast from "react-hot-toast";

function FaqQuestions() {
  const { id } = useParams();
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/mock-interview/get-interview-questions/${id}?address=${selectedAccount}`
        );
        setQuestions(res.data.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions.");
      }
    };

    if (selectedAccount) {
      fetchQuestions();
    }
  }, [id, selectedAccount]);

  if (!selectedAccount) {
    return (
      <div className="p-6 text-center text-red-500">
        Please connect your wallet to view the questions.
      </div>
    );
  }

  console.log("question", questions);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-lg max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      {questions.length === 0 ? (
        <p className="text-gray-400">No questions available for this ID.</p>
      ) : (
        <div className="space-y-6">
          {questions?.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-600 pb-4 mb-4 space-y-2"
            >
              <h2 className="text-xl font-semibold text-green-400">
                {item.round} Round
              </h2>
              <ul className="list-none list-inside space-y-1 text-gray-200">
                {item.questions.split("\n").map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FaqQuestions;
