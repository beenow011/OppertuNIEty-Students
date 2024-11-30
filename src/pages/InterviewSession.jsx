import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Play, Loader2, Volume2, VolumeX } from "lucide-react";

function InterviewSession() {
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const { id, type } = useParams();

  const [conversation, setConversation] = useState([]);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentStreamingIndex, setCurrentStreamingIndex] = useState(-1);

  const synth = window.speechSynthesis;
  const conversationRef = useRef(null);

  const convertType = (type) => {
    const typeMap = {
      "technical-interview": "Technical",
      "managerial-interview": "Managerial",
      "hr-interview": "HR",
      "group-discussion": "Group Discussion",
      default: "Technical Interview",
    };
    return typeMap[type] || typeMap.default;
  };

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
        setIsInterviewStarted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to retrieve conversation");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
    return () => {
      synth.cancel();
    };
  }, [id, selectedAccount]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation, displayedText]);

  // Text streaming effect
  useEffect(() => {
    if (currentStreamingIndex >= 0 && conversation[currentStreamingIndex]) {
      const message = conversation[currentStreamingIndex].message;
      let currentIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentIndex <= message.length) {
          setDisplayedText(message.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(streamInterval);
          setCurrentStreamingIndex(-1);
          setDisplayedText("");
        }
      }, 30); // Adjust speed as needed

      return () => clearInterval(streamInterval);
    }
  }, [currentStreamingIndex, conversation]);

  const speakMessage = (message) => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/mock-interview/start-interview-session?address=${selectedAccount}`,
        { sessionId: id }
      );
      fetchConversation();
      setIsInterviewStarted(true);
      toast.success("Interview Started");
    } catch (err) {
      console.error(err);
      toast.error("Error starting interview");
    } finally {
      setIsLoading(false);
    }
  };

  const continueInterview = async () => {
    if (!userMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/mock-interview/continue-interview-conversation?address=${selectedAccount}`,
        {
          sessionId: id,
          message: userMessage,
        }
      );

      const newConversation = [
        ...conversation,
        {
          message: userMessage,
          isUserMsg: true,
          createdAt: new Date().toISOString(),
        },
        {
          message: res.data.data,
          isUserMsg: false,
          createdAt: new Date().toISOString(),
        },
      ];

      setConversation(newConversation);
      setCurrentStreamingIndex(newConversation.length - 1);
      speakMessage(res.data.data);
      setUserMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Error continuing interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      continueInterview();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else if (conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1];
      if (!lastMessage.isUserMsg) {
        speakMessage(lastMessage.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {convertType(type)} Interview Session
          </h1>
          <button
            onClick={toggleSpeech}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        <div
          ref={conversationRef}
          className="p-6 space-y-4 max-h-[600px] overflow-y-auto"
        >
          {!isInterviewStarted ? (
            <div className="text-center">
              <button
                onClick={startInterview}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center mx-auto space-x-2"
              >
                <Play size={20} />
                <span>Start Interview</span>
              </button>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isUserMsg ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    msg.isUserMsg
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {currentStreamingIndex === index
                    ? displayedText
                    : msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {isInterviewStarted && (
          <div className="p-6 border-t border-gray-700">
            <div className="relative">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                className="w-full p-3 pr-12 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isSubmitting}
              />
              <button
                onClick={continueInterview}
                className="absolute bottom-3 right-3 text-blue-400 hover:text-blue-600 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <Send size={24} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewSession;
