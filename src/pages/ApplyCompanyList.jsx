import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import toast from "react-hot-toast";

function ApplyCompanyList() {
  const { Web3State, StudentState } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const { name, branch, usn } = StudentState;
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();
  console.log(selectedAccount);
  const getAllCompanies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/companies/get-companies?address=" +
          selectedAccount +
          "&branch=" +
          branch
      );
      setCompanies(res.data.companies);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(branch);
  useEffect(() => {
    console.log("AllCompanies");
    if (selectedAccount && branch) getAllCompanies();
  }, [selectedAccount, branch]);
  return (
    <section className="bg-gray-900 text-white py-8 px-4 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">
          Active Companies
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...companies].reverse().map((company) => (
            <div
              key={company.companyName}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              onClick={() => navigate(`/apply-company-list/${company._id}`)}
            >
              <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                <img
                  src={company.logoUrl}
                  alt={`${company.companyName} logo`}
                  className="object-cover w-40 h-40 rounded-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-2xl font-semibold text-cyan-400">
                  {company.companyName}
                </h3>
                <p className="text-gray-300 mt-2">
                  <strong>Role:</strong> {company.role}
                </p>
                <p className="text-gray-300 mt-1">
                  <strong>CTC:</strong> {company.ctc} LPA
                </p>
                <div className="text-gray-300 mt-1">
                  <strong>Allowed Branches:</strong>
                  <ul className="mt-1">
                    {company.allowedBranches.map((branch, index) => (
                      <li key={index} className="inline-block mr-2">
                        <span className="px-2 py-1 bg-cyan-600 rounded-full text-sm">
                          {branch}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ApplyCompanyList;
