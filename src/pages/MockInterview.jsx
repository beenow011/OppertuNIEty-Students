import React from "react";
import { Code, Briefcase, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MockInterview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const tiles = [
    {
      title: "Technical Interview",
      description: "Data structures, algorithms, and coding challenges",
      icon: <Code className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-blue-600/20 to-blue-400/20",
      hover: "hover:from-blue-500/30 hover:to-blue-300/30",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      accentColor: "text-blue-400",
      link: `/mock-interview/technical-interview`,
    },
    {
      title: "Managerial Round",
      description: "Leadership, problem-solving, and decision making",
      icon: <Briefcase className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-emerald-600/20 to-emerald-400/20",
      hover: "hover:from-emerald-500/30 hover:to-emerald-300/30",
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      accentColor: "text-emerald-400",

      link: `/mock-interview/managerial-interview`,
    },
    {
      title: "HR Interview",
      description: "Culture fit, soft skills, and career goals",
      icon: <User className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-amber-600/20 to-amber-400/20",
      hover: "hover:from-amber-500/30 hover:to-amber-300/30",
      border: "border-amber-500/30",
      iconBg: "bg-amber-500/20",
      accentColor: "text-amber-400",
      link: `/mock-interview/hr-interview`,
    },
    {
      title: "Group Discussion",
      description: "Team dynamics, communication, and collaboration",
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      gradient: "from-rose-600/20 to-rose-400/20",
      hover: "hover:from-rose-500/30 hover:to-rose-300/30",
      border: "border-rose-500/30",
      iconBg: "bg-rose-500/20",
      accentColor: "text-rose-400",
      link: `/mock-interview/group-discussion`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mock Interview Preparation
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Practice with our comprehensive interview simulation covering all
            aspects of the hiring process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {tiles.map((tile, index) => (
            <button
              key={index}
              className="group relative h-full"
              onClick={() => navigate(`${tile.link}/${id}`)}
            >
              <div
                className={`
                h-full w-full rounded-xl
                bg-gradient-to-br ${tile.gradient}
                border ${tile.border}
                backdrop-blur-sm
                transform transition-all duration-300
                ${tile.hover}
                hover:scale-[1.02]
                hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-gray-100
              `}
              >
                <div className="p-8 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span
                        className={`
                        inline-flex items-center justify-center p-3 
                        ${tile.iconBg} rounded-lg backdrop-blur-sm
                        ${tile.accentColor}
                      `}
                      >
                        {tile.icon}
                      </span>
                      <span
                        className="
                        text-white/80 text-sm font-medium px-4 py-1.5 
                        rounded-full border border-white/10 
                        bg-white/5 backdrop-blur-sm
                        group-hover:bg-white/10 transition-colors
                      "
                      >
                        Start Practice
                      </span>
                    </div>

                    <div className="mt-6">
                      <h3
                        className={`text-xl md:text-2xl font-bold ${tile.accentColor} mb-2`}
                      >
                        {tile.title}
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base">
                        {tile.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div
                  className="
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 pointer-events-none
                  bg-gradient-to-t from-white/[0.04] to-transparent
                "
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Select any interview type above to begin your practice session
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
