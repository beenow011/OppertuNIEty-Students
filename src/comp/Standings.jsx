import React from "react";
import { Trophy } from "lucide-react";

function Standings({ standings }) {
  // Only show top 10 students
  const topTen = standings.slice(0, 10);

  // Helper function to get medal color
  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-white";
    }
  };

  // Helper function to get background color
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-400/10"; // Gold tint
      case 1:
        return "bg-gray-400/10"; // Silver tint
      case 2:
        return "bg-amber-600/10"; // Bronze tint
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>

      <div className="space-y-3">
        {topTen.map((result, index) => (
          <div
            key={result._id}
            className={`${getBackgroundColor(
              index
            )} rounded-lg p-4 transition-all hover:scale-[1.01] border border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${getMedalColor(index)}`}>
                  {index < 3 ? (
                    <Trophy className="w-6 h-6" />
                  ) : (
                    <span className="text-lg font-medium w-6 text-center">
                      {index + 1}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {result.studentId.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {result.studentId.usn}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-blue-400">
                  {result.score} points
                </div>
                <div className="text-sm text-gray-400">
                  Time: {result.timeTaken}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {standings.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No results available yet
        </div>
      )}
    </div>
  );
}

export default Standings;
