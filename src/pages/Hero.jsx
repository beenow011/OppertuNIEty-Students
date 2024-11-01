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
    <div className={``}>
      {
        // Show message if button is clicked
        showMsg && <AccountCheck />
      }
      <section
        className={`hero bg-dark-blue text-white min-h-screen flex flex-col justify-center items-center p-8 ${
          showMsg && "blur-md"
        } `}
        onClick={() => {
          if (showMsg === true) {
            setShowMsg(false);
          }
        }}
      >
        <div className="text-center mb-16 mt-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Welcome to OpportuNIEty
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl">
            OpportuNIEty is a decentralized career development platform built to
            empower students. Leveraging blockchain, AI, and community insights,
            we offer an all-in-one solution for your career growth.
          </p>
          <button
            className="bg-primary hover:bg-blue-600 text-dark-blue px-8 py-3 text-lg font-semibold rounded-full transition duration-300"
            onClick={() => setShowMsg((prev) => !prev)}
          >
            Get Started
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <ShieldCheck size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
            <p>
              Experience secure and transparent data management with blockchain
              technology.
            </p>
          </div>

          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <Database size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              IPFS Document Storage
            </h3>
            <p>
              Store your important documents securely on IPFS, ensuring
              accessibility and safety.
            </p>
          </div>

          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <Briefcase size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
            <p>
              Discover and apply to exclusive job postings tailored for your
              growth and skills.
            </p>
          </div>

          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <GraduationCap size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Alumni Networking</h3>
            <p>
              Connect with alumni, gain industry insights, and receive guidance
              on career paths.
            </p>
          </div>

          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <FileText size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Resume Guidance</h3>
            <p>
              Get personalized resume tips to help you stand out in today’s
              competitive job market.
            </p>
          </div>

          <div className="feature-card flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
            <Zap size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Driven Insights</h3>
            <p>
              Receive company-specific information powered by AI to prepare for
              interviews.
            </p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <img
            src="clg.jpg"
            alt="Placement Opportunities"
            className="w-2/3 rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </section>
    </div>
  );
}

export default Hero;
