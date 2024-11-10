import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/useWeb3Context";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getContractInstance } from "../utils/getContractInstance";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EligibilityDisplay from "../comp/EligibiltyNote";

function CompanyPage() {
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const [company, setCompany] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [file, setFile] = useState(null);
  const [eligibility, setEligibility] = useState(false);

  const { id } = useParams();
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

  const [resume, setResume] = useState(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [eligibilityNote, setEligibilityNote] = useState(null);
  const getResume = async (hash) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/student-auth/get-resume?address=${selectedAccount}`,
        { resumeIpfsHash: hash }
      );
      console.log(res);
      setResume(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching resume");
    }
  };
  console.log(selectedAccount);
  const getResumeStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/student-auth/get-resume-status?address=${selectedAccount}`
      );
      if (res.data.resumeCollected) {
        setIsResumeUploaded(true);
        const contract = await getContractInstance();
        const tx = await contract.viewResume();
        console.log("tx", tx);
        await getResume(tx);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching resume status");
    }
  };

  useEffect(() => {
    if (selectedAccount) getResumeStatus();
  }, [selectedAccount]);
  function base64ToFile(base64String, filename) {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1]; // Get the MIME type (e.g., application/pdf)
    const bstr = atob(arr[1]); // Decode base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  const handleEligibility = async () => {
    try {
      const studentXIIPercentage = parseFloat(xiiPercentage.replace("%", ""));
      const cutoffXIIPercentage = parseFloat(company.cutOffXiiPercentage);

      if (studentXIIPercentage < cutoffXIIPercentage) {
        console.log(
          "Student does not meet the minimum percentage requirement."
        );
        setEligibilityNote(
          "Student does not meet the minimum XII percentage requirement."
        );
        return;
      } else {
        console.log("Student meets the minimum percentage requirement.");
      }
      const studentCGPA = parseFloat(cgpa);
      const cutoffCGPA = parseFloat(company.cutOffCgpa);
      if (studentCGPA < cutoffCGPA) {
        console.log("Student does not meet the minimum CGPA requirement.");
        setEligibilityNote(
          "Student does not meet the minimum BE CGPA requirement."
        );
        return;
      } else {
        console.log("Student meets the minimum CGPA requirement.");
      }
      const studentXPercentage = parseFloat(xPercentage.replace("%", ""));
      const cutoffXPercentage = parseFloat(company.cutOffXPercentage);
      if (studentXPercentage < cutoffXPercentage) {
        console.log(
          "Student does not meet the minimum percentage requirement."
        );
        setEligibilityNote(
          "Student does not meet the minimum X percentage requirement."
        );
        return;
      } else {
        console.log("Student meets the minimum percentage requirement.");
      }

      if (!resume) {
        toast.error("Resume not loaded");
        return;
      }

      let file = base64ToFile(
        "data:application/pdf;base64," + resume,
        "resume.pdf"
      );

      const formDataInstance = new FormData();
      formDataInstance.append("file", file);
      formDataInstance.append("jd", company.jobDescription);

      const res = await axios.post(
        "http://localhost:3000/api/openai/check-eligibility",
        formDataInstance
      );
      console.log(res);
      setEligibilityNote(res.data.data);
      setEligibility(true);
      toast.success("Eligibility check completed");
    } catch (e) {
      console.log(e);
      toast.error("Error checking eligibility");
    }
  };

  const studentData = async () => {
    try {
      const contract = await getContractInstance();
      const tx = await contract.getUserProfile();
      setUser(tx);
    } catch (e) {
      console.log(e);
      toast.error("Error fetching student data");
    }
  };
  useEffect(() => {
    if (selectedAccount) {
      getCompany();
      studentData();
    }
  }, [selectedAccount]);
  const [
    name,
    xPercentage,
    xiiPercentage,
    cgpa,
    dob,
    phone,
    email,
    coreSkills,
  ] = user;
  if (!company) {
    return (
      <div className="text-white text-center">Loading company details...</div>
    );
  }

  return (
    <section className="bg-[#1A1A2E] text-white py-8 px-4 min-h-screen flex justify-center items-center">
      <div className="container  bg-[#16213E] rounded-3xl shadow-lg p-8 text-center">
        <div className="flex gap-6  items-center">
          <img
            src={company.logoUrl}
            alt={`${company.companyName} logo`}
            className="w-28 h-28 object-cover rounded-full shadow-lg border-2 border-[#E94560] " // Added pulse animation
          />
          <div className="flex flex-col items-start">
            <h2 className="text-3xl font-bold text-[#E94560]">
              {company.companyName}
            </h2>
            <p className="text-xl  font-semibold">{company.role}</p>
            <p className="text-md text-gray-400 text-left">
              {company.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-start mt-5">
          <button
            class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            disabled={!eligibility}
          >
            Apply
          </button>
          <button
            class="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            onClick={handleEligibility}
          >
            Check Eligibility
          </button>
        </div>
        <div>
          {eligibilityNote && (
            <EligibilityDisplay eligibilityNote={eligibilityNote} />
          )}
        </div>
        <div className="border-t border-gray-600 pt-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-[#E94560]">
            Job Details
          </h3>
          <ul className="list-none p-0 space-y-2">
            <li className="flex gap-3">
              <span className="text-gray-300">CTC:</span>
              <span>{company.ctc} LPA</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300">Base Salary:</span>
              <span>{company.baseSalary} LPA</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300">Opportunity Type:</span>
              <span>{company.opportunityType}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300">Stipend:</span>
              <span>{company.stipend}</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-600 pt-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-[#E94560]">
            Job Description
          </h3>
          <p className="text-gray-300 text-justify">{company.jobDescription}</p>
        </div>

        <div className="border-t border-gray-600 pt-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-[#E94560]">
            Eligibility Criteria
          </h3>
          <ul className="list-none p-0 space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-300">Cutoff CGPA:</span>
              <span>{company.cutOffCgpa}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">10th %:</span>
              <span>{company.cutOffXPercentage}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">12th %:</span>
              <span>{company.cutOffXiiPercentage}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-300">Allowed Branches:</span>
              <span>{company.allowedBranches.join(", ")}</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-600 pt-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-[#E94560]">
            Application Process
          </h3>
          <p className="text-gray-300">{company.process}</p>
          <p className="mt-2">
            <span className="text-gray-300">Schedule:</span> {company.schedule}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CompanyPage;
