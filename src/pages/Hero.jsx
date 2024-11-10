import React, { useState } from "react";
import {
  ShieldCheck,
  Database,
  Briefcase,
  GraduationCap,
  FileText,
  Zap,
} from "lucide-react";
import AccountCheck from "../comp/AccountCheck";

function Hero() {
  const [showMsg, setShowMsg] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-8">
      {/* Show AccountCheck component if button is clicked */}
      {showMsg && <AccountCheck />}

      <section
        className={`hero flex flex-col justify-center items-center px-8 py-12 ${
          showMsg && "blur-md"
        }`}
        onClick={() => {
          if (showMsg === true) {
            setShowMsg(false);
          }
        }}
      >
        {/* Welcome and Introduction */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary drop-shadow-lg">
            Welcome to <span className="text-blue-500">Opportu</span>
            <span className="text-slate-400">NIE</span>
            <span className="text-blue-500">ty</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-300">
            OpportuNIEty is a decentralized career development platform built to
            empower students. Leveraging blockchain, AI, and community insights,
            we offer an all-in-one solution for your career growth.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-dark-blue px-10 py-3 text-lg font-semibold rounded-full transition-transform transform duration-300 hover:scale-105 shadow-lg"
            onClick={() => setShowMsg((prev) => !prev)}
          >
            Get Started
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature Card */}
          {[
            {
              title: "Blockchain Security",
              icon: <ShieldCheck />,
              description:
                "Experience secure and transparent data management with blockchain technology.",
            },
            {
              title: "IPFS Document Storage",
              icon: <Database />,
              description:
                "Store your important documents securely on IPFS, ensuring accessibility and safety.",
            },
            {
              title: "Job Opportunities",
              icon: <Briefcase />,
              description:
                "Discover and apply to exclusive job postings tailored for your growth and skills.",
            },
            {
              title: "Alumni Networking",
              icon: <GraduationCap />,
              description:
                "Connect with alumni, gain industry insights, and receive guidance on career paths.",
            },
            {
              title: "Resume Guidance",
              icon: <FileText />,
              description:
                "Get personalized resume tips to help you stand out in today’s competitive job market.",
            },
            {
              title: "AI-Driven Insights",
              icon: <Zap />,
              description:
                "Receive company-specific information powered by AI to prepare for interviews.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Image Section */}
        <div className="mt-16 flex justify-center">
          <img
            src="clg.jpg"
            alt="Placement Opportunities"
            className="w-3/4 md:w-1/2 rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105"
          />
        </div>
      </section>
    </div>
  );
}

export default Hero;
