import React from "react";
import { Briefcase, CheckCircle, Rocket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const userName = "Abhinav"; // Placeholder for the user’s name, which can be dynamic if fetched
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen px-52 p-8">
      {/* Greeting Message */}
      <div className="text-3xl font-bold mb-6">
        <h1>
          Welcome, <span className="text-blue-500">{userName}</span>!
        </h1>
        <p className="text-gray-400 mt-2">
          Your journey starts here. Let’s explore opportunities!
        </p>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Applied Companies Section */}
        <div
          className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer shadow-lg"
          onClick={() => alert("Navigating to Applied Companies")}
        >
          <CheckCircle className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">View Applied Companies</h2>
          <p className="text-gray-400 mt-2">
            Check the status of your applications and manage them easily.
          </p>
        </div>

        {/* Apply to Companies Section */}
        <div
          className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer shadow-lg"
          onClick={() => navigate("/apply-company-list")}
        >
          <Briefcase className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold">Apply to Companies</h2>
          <p className="text-gray-400 mt-2">
            Explore open positions and apply with just a click.
          </p>
        </div>

        {/* Features Section */}
        <div
          className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer shadow-lg"
          onClick={() => alert("Navigating to Features")}
        >
          <Rocket className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold">Explore Features</h2>
          <p className="text-gray-400 mt-2">
            Access powerful tools and resources to boost your career journey.
          </p>
        </div>

        {/* Premium Features Section */}
        <div
          className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer shadow-lg"
          onClick={() => alert("Navigating to Premium Features")}
        >
          <Star className="w-12 h-12 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold">Premium Features</h2>
          <p className="text-gray-400 mt-2">
            Unlock advanced tools and exclusive resources to stay ahead.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
