import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import toast from "react-hot-toast";
import { GemIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

function FaqQuestions() {
  const { id } = useParams();
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [questions, setQuestions] = useState([]);
  const [answersByAi, setAnswersByAI] = useState({
    question: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAnswer = async (question) => {
    try {
      setIsLoading(true);
      setAnswersByAI({ question, answer: "" });
      const res = await axios.post(
        "http://localhost:3000/api/openai/get-answer",
        { question }
      );
      setAnswersByAI({ question, answer: res.data.data });
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast.error("Failed to load answer.");
    } finally {
      setIsLoading(false);
    }
  };

  const components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={darcula}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-md shadow-lg max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
      <div className="overflow-scroll">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Frequently Asked Questions
        </h1>
        {questions.length === 0 ? (
          <p className="text-gray-400">No questions available for this ID.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-700 pb-4 mb-4 space-y-2"
              >
                <h2 className="text-xl font-semibold text-green-400">
                  {item.round} Round
                </h2>
                <ul className="space-y-2">
                  {item.questions.split(/[.?]/).map((question, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-gray-300"
                    >
                      {question.trim()}
                      <button
                        className="bg-gradient-to-r p-2 rounded-full group relative from-pink-500 to-purple-500"
                        onClick={() => handleAnswer(question.trim())}
                        disabled={isLoading}
                      >
                        <GemIcon className="h-5 w-5 text-white" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-sm bg-gray-800 text-white py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Get answer via AI
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          AI Generated Answer
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-green-400" />
            <span>Loading...</span>
          </div>
        ) : answersByAi.answer ? (
          <ReactMarkdown components={components} className="prose prose-invert">
            {answersByAi.answer}
          </ReactMarkdown>
        ) : (
          <p className="text-gray-400">Select a question to see the answer.</p>
        )}
      </div>
    </div>
  );
}

export default FaqQuestions;
