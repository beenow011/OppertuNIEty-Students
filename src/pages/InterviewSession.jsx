import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Send,
  Play,
  Loader2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from "lucide-react";

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

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  let recognition;

  const [audioVisualizer, setAudioVisualizer] = useState(Array(20).fill(10));
  const [bgGradient, setBgGradient] = useState("0deg");

  // Animation frame ref for background
  const animationRef = useRef(null);

  // Effect for dynamic background during speech
  useEffect(() => {
    let degree = 0;
    const animateGradient = () => {
      degree = (degree + 0.2) % 360;
      setBgGradient(`${degree}deg`);
      animationRef.current = requestAnimationFrame(animateGradient);
    };

    if (isSpeaking || isListening) {
      animationRef.current = requestAnimationFrame(animateGradient);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isListening]);

  // Audio visualizer animation
  useEffect(() => {
    let interval;
    if (isSpeaking || isListening) {
      interval = setInterval(() => {
        setAudioVisualizer((prevState) =>
          prevState.map(() => Math.random() * 40 + 10)
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // ... [previous functions remain the same]
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcriptArray = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setUserMessage(transcriptArray);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  } else {
    console.error("Speech recognition not supported in this browser");
  }

  const startListening = () => {
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

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
    const voices = synth.getVoices();
    utterance.voice = voices.find(
      //i need a realistic voice, Google UK English is not that realistic?
      (voice) => voice.name === "Google US English"
    );
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

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Loader2 className="animate-spin text-blue-500" size={48} />
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="absolute inset-0 blur-xl bg-blue-500/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div
        className="relative max-w-6xl mx-auto p-6 min-h-screen transition-all duration-300"
        style={{
          background: `linear-gradient(${bgGradient}, rgba(0,0,30,0.95), rgba(0,10,60,0.95))`,
        }}
      >
        {/* Ambient background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/10" />
          {audioVisualizer.map((height, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-1 bg-blue-500/30 transform transition-all duration-200"
              style={{
                height: `${height}%`,
                left: `${(i / audioVisualizer.length) * 100}%`,
                opacity: 0.3 + height / 100,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {convertType(type)} Interview Session
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={toggleSpeech}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isSpeaking
                    ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                }`}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div
            ref={conversationRef}
            className="p-6 space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent"
          >
            {!isInterviewStarted ? (
              <div className="flex flex-col items-center space-y-6 py-20">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
                  <button
                    onClick={startInterview}
                    className="relative bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold py-4 px-8 rounded-full transition-all duration-300 flex items-center space-x-3 group"
                  >
                    <Play
                      size={24}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>Initialize Interview</span>
                  </button>
                </div>
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
                    className={`max-w-[70%] p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                      msg.isUserMsg
                        ? "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                        : "bg-purple-500/20 text-purple-100 border border-purple-500/30"
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

          {/* Input Area */}
          {isInterviewStarted && (
            <div className="p-6 border-t border-white/10">
              <div className="relative">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response or use the microphone..."
                  className="w-full p-4 pr-12 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none placeholder-white/30"
                  rows={3}
                  disabled={isSubmitting}
                />
                <button
                  onClick={continueInterview}
                  className="absolute bottom-3 right-3 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Send
                      size={24}
                      className="transform hover:scale-110 transition-transform"
                    />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewSession;
