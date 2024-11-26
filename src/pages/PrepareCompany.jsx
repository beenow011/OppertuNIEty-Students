import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import {
  Book,
  HelpCircle,
  UserCheck,
  Users,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
} from "lucide-react";
import axios from "axios";

function PrepareCompany() {
  const { id } = useParams();
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [company, setCompany] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const getCompany = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/companies/get-company-by-id/${id}?address=${selectedAccount}`
      );
      setCompany(res.data.company);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getCompany();
    }
  }, [selectedAccount]);

  const actionButtons = [
    {
      title: "Mock Interview",
      description: "Practice with AI-powered interviews",
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-blue-600 to-blue-400",
      hover: "hover:from-blue-500 hover:to-blue-300",
      onClick: () => navigate(`/mock-interview/${id}`),
    },
    {
      title: "Most Asked Questions",
      description: "Common interview questions and answers",
      icon: <HelpCircle className="w-6 h-6" />,
      color: "from-emerald-600 to-emerald-400",
      hover: "hover:from-emerald-500 hover:to-emerald-300",
      onClick: () => navigate(`/faq/${id}`),
    },
    {
      title: "Alumni Connection",
      description: "Connect with company employees",
      icon: <Users className="w-6 h-6" />,
      color: "from-amber-600 to-amber-400",
      hover: "hover:from-amber-500 hover:to-amber-300",
      onClick: () => {},
    },
    {
      title: "Study Materials",
      description: "Curated resources and guides",
      icon: <Book className="w-6 h-6" />,
      color: "from-purple-600 to-purple-400",
      hover: "hover:from-purple-500 hover:to-purple-300",
      onClick: () => navigate(`/study-material/${id}`),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Company Overview Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={company?.logoUrl}
                  alt={`${company?.companyName} Logo`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Company Info Section */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {company?.companyName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>{company?.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span>Multiple Locations</span>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">Total CTC</div>
                    <div className="text-xl font-bold text-green-400">
                      {company?.ctc} LPA
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Base Salary</div>
                    <div className="text-xl font-bold text-yellow-400">
                      {company?.baseSalary} LPA
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-2">
                  About the Role
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {company?.jobDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionButtons.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative h-full"
            >
              <div
                className={`
                h-full w-full rounded-xl
                bg-gradient-to-br ${action.color}
                transform transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-100
              `}
              >
                <div className="p-6">
                  <div className="flex flex-col h-full">
                    <span className="inline-flex items-center justify-center p-3 bg-white/10 rounded-lg backdrop-blur-sm mb-4">
                      {action.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrepareCompany;
