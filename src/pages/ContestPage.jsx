import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Award, Clock, Send } from "lucide-react";
import { useWeb3Context } from "../context/useWeb3Context";
import toast from "react-hot-toast";
import Standings from "../comp/Standings";

const ContestPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState(false);
  const [contest, setContest] = useState(null);
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  const getContest = async () => {
    try {
      const res = await axios(
        `http://localhost:3000/api/contest/get-contest-by-id/${id}?address=${selectedAccount}`
      );
      setContest(res.data.contest);
      setStatus(res.data.status);

      if (res.data.status) {
        setShowResults(true);
        if (res.data.previousScore) {
          setScore(res.data.previousScore[0].score);
          setTimeTaken(res.data.previousScore[0].timeTaken); // Assuming API returns timeTaken
        }
      } else {
        setStartTime(new Date());
        setIsTimerActive(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    selectedAccount && getContest();
  }, [selectedAccount]);

  useEffect(() => {
    let timer;
    if (startTime && isTimerActive) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isTimerActive]);
  const [standing, setStanding] = useState([]);
  useEffect(() => {
    if (showResults) {
      const fetchResults = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/contest/get-result/${id}?address=${selectedAccount}`
          );
          if (res.status === 200) {
            setStanding(res.data.results);
          }
        } catch (error) {
          console.error(error);
        }
      };
      selectedAccount && fetchResults();
    }
  }, [showResults]);
  console.log("a", standing);
  const handleSubmit = async () => {
    try {
      setIsTimerActive(false);
      let correctCount = 0;
      contest.questions.forEach((question) => {
        if (selectedAnswers[question._id] === question.correctAnswer) {
          correctCount++;
        }
      });

      // Calculate final time taken
      const endTime = new Date();
      const totalSeconds = Math.floor((endTime - startTime) / 1000);
      const finalMinutes = Math.floor(totalSeconds / 60);
      const finalSeconds = totalSeconds % 60;
      const finalTime = `${finalMinutes}:${
        finalSeconds < 10 ? "0" : ""
      }${finalSeconds}`;

      setScore(correctCount);
      setTimeTaken(finalTime);

      const res = await axios.post(
        `http://localhost:3000/api/contest/add-result?address=${selectedAccount}`,
        {
          contestId: id,
          score: correctCount,
          timeTaken: finalTime,
        }
      );
      toast.success("Answers submitted successfully");

      setShowResults(true);
    } catch (error) {
      console.error(error);
      toast.error("Error submitting answers");
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  if (!contest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <AlertCircle className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    );
  }

  const ResultsCard = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Award className="w-6 h-6 mr-2 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Results</h2>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-blue-400">
          {score} / {contest.questions.length}
        </h3>
        <p className="text-gray-400">
          {Math.round((score / contest.questions.length) * 100)}% Correct
        </p>
        <p className="text-gray-400 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Time Taken: {timeTaken}
        </p>
        <div className="mt-6 space-y-4">
          {contest.questions.map((question, index) => (
            <div
              key={question._id}
              className="text-left p-4 bg-gray-700 rounded-lg"
            >
              <p className="text-white mb-2">
                {index + 1}. {question.questionText}
              </p>

              {status && (
                <p className="text-sm mt-1">
                  <span className="text-gray-400">Correct answer: </span>
                  <span className="text-green-400">
                    {question.correctAnswer}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Standings standings={standing} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              {contest.contestName}
            </h1>
            {!status && !showResults && (
              <div className="flex items-center space-x-2 text-blue-400">
                <Clock className="w-5 h-5" />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
        </div>

        {!showResults && !status ? (
          <div className="space-y-6">
            {contest.questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">
                  {index + 1}. {question.questionText}
                </h3>
                <div className="grid gap-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedAnswers[question._id] === option
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                      }`}
                      onClick={() => handleAnswerSelect(question._id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                Object.keys(selectedAnswers).length === contest.questions.length
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length !== contest.questions.length
              }
            >
              <Send className="w-4 h-4" />
              <span>Submit Answers</span>
            </button>
          </div>
        ) : (
          <ResultsCard />
        )}
      </div>
    </div>
  );
};

export default ContestPage;
