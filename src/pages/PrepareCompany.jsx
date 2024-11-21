import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import { Book, HelpCircle, UserCheck, Users } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PrepareCompany() {
  const { id } = useParams();
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [company, setCompany] = useState();
  const navigate = useNavigate();

  const getCompany = async () => {
    try {
      console.log(selectedAccount);
      const res = await axios.get(
        `http://localhost:3000/api/companies/get-company-by-id/${id}?address=` +
          selectedAccount
      );
      console.log(res.data);
      setCompany(res.data.company);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getCompany();
    }
  }, [selectedAccount]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 px-48">
      {/* Company Overview Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={company?.logoUrl}
            alt={`${company?.companyName} Logo`}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              {company?.companyName}
            </h1>
            <p className="text-gray-300 mt-1">{company?.role}</p>
            <p className="text-gray-300">
              <span className="text-green-400 font-bold">
                {company?.ctc} LPA
              </span>{" "}
              CTC |{" "}
              <span className="text-yellow-400 font-bold">
                {company?.baseSalary} LPA
              </span>{" "}
              Base Salary
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            About the Role
          </h2>
          <p className="text-gray-400">{company?.jobDescription}</p>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Mock Interview */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2">
          <UserCheck className="w-6 h-6" />
          <span>Mock Interview</span>
        </button>

        {/* Most Asked Questions */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2"
          onClick={() => navigate(`/faq/${id}`)}
        >
          <HelpCircle className="w-6 h-6" />
          <span>Most Asked Questions</span>
        </button>

        {/* Alumni Connection */}
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2">
          <Users className="w-6 h-6" />
          <span>Alumni Connection</span>
        </button>

        {/* Study Materials */}
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2"
          onClick={() => navigate(`/study-material/${id}`)}
        >
          <Book className="w-6 h-6" />
          <span>Study Materials</span>
        </button>
      </div>
    </div>
  );
}

export default PrepareCompany;
