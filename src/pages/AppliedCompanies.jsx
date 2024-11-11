import React, { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  GraduationCap,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3Context } from "../context/useWeb3Context";
import axios from "axios";

function AppliedCompanies() {
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [appliedCompanies, setAppliedCompanies] = useState([]);
  const [error, setError] = useState(null);

  const getAppliedCompanies = async () => {
    try {
      const res = await axios(
        `http://localhost:3000/api/companies/get-applied-companies?address=${selectedAccount}`
      );

      console.log(res.data);

      setAppliedCompanies(res.data.applications);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Error fetching applied companies");
      toast.error("Error fetching applied companies");
    }
  };
  console.log(appliedCompanies, selectedAccount);

  useEffect(() => {
    if (selectedAccount) getAppliedCompanies();
  }, [selectedAccount]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "accepted":
        return "bg-green-500/20 text-green-500";
      case "rejected":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-blue-500/20 text-blue-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 max-w-[80%] mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Applied Companies</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliedCompanies.map((application) => (
          <div
            key={application._id}
            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden">
                    {application.companyId.logoUrl ? (
                      <img
                        src={application.companyId.logoUrl}
                        alt={application.companyId.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {application.companyId.companyName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {application.companyId.role}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  {application.companyId.location}
                </div>

                <div className="flex items-center text-slate-300">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                  CTC: ₹{application.companyId.ctc} LPA
                </div>

                <div className="flex items-center text-slate-300">
                  <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                  Eligibility Score: {application.eligibilityScore}%
                </div>

                <div className="flex items-center text-slate-300">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  Applied on: {formatDate(application.appliedOn)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {application.companyId.allowedBranches.map((branch) => (
                    <span
                      key={branch}
                      className="bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-sm"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appliedCompanies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No applications found.</p>
        </div>
      )}
    </div>
  );
}

export default AppliedCompanies;
