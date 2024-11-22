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
      console.log("Question:", question);
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
    <div className="p-4 md:p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-green-400 text-center">
          Interactive FAQ Assistant
        </h1>

        <div className="flex flex-col-reverse  lg:flex-row gap-6">
          {/* Questions Panel */}
          <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 backdrop-blur-sm flex-1">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <GemIcon className="h-12 w-12 mb-4 opacity-50" />
                <p>No questions available for this ID.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-lg bg-gray-800/40 p-4 transition-all duration-200 hover:bg-gray-800/60"
                  >
                    <h2 className="text-lg md:text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                      {item.round} Round
                    </h2>
                    <ul className="space-y-3">
                      {item.questions.split(/[.?]/).map((question, qIndex) => {
                        const trimmedQuestion = question.trim();
                        if (!trimmedQuestion) return null;

                        return (
                          <li
                            key={qIndex}
                            className="flex items-start justify-between gap-4 text-gray-300 hover:text-white transition-colors group/item"
                          >
                            <span className="text-sm md:text-base">
                              {trimmedQuestion}?
                            </span>
                            <button
                              className="shrink-0 mt-1 p-2 rounded-full transition-all duration-300 hover:scale-110 
                                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                                       opacity-0 group-hover/item:opacity-100"
                              onClick={() => handleAnswer(trimmedQuestion)}
                              disabled={isLoading}
                            >
                              <GemIcon
                                className={`h-4 w-4 text-white ${
                                  isLoading ? "animate-pulse" : ""
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answer Panel */}
          <div className="lg:sticky lg:top-6 h-fit flex-1">
            <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-green-400 flex items-center gap-3">
                <GemIcon
                  className={`h-6 w-6 ${
                    isLoading
                      ? "animate-spin text-purple-500"
                      : "text-green-400"
                  }`}
                />
                AI Generated Answer
              </h2>

              <div className="min-h-[200px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 h-40">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      <GemIcon className="h-8 w-8 text-white relative animate-bounce" />
                    </div>
                    <span className="text-gray-400">Generating answer...</span>
                  </div>
                ) : answersByAi.answer ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown components={components}>
                      {answersByAi.answer}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <GemIcon className="h-8 w-8 mb-3 opacity-50" />
                    <p>Select a question to see the AI-generated answer</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqQuestions;
