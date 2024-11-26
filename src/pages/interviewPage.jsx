import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useWeb3Context } from "../context/useWeb3Context";
import { getContractInstance } from "../utils/getContractInstance";

function InterviewPage() {
  const { id } = useParams();
  const { type } = useParams();
  const [questions, setQuestions] = useState([]);
  const [company, setCompany] = useState({
    companyName: "",
    role: "",
    jobDescription: "",
  });
  const [resume, setResume] = useState(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const { Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;

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

  const convertType = (type) => {
    switch (type) {
      case "technical-interview":
        return "Technical";
      case "managerial-interview":
        return "Managerial";
      case "hr-interview":
        return "HR";
      case "group-discussion":
        return "GD";
      default:
        return "Technical Interview";
    }
  };

  useEffect(() => {
    console.log(id, type);
    const fetchQuestiosn = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/mock-interview/get-interview-questions/${id}/${convertType(
            type
          )}?address=${selectedAccount}`
        );
        if (res.data.data.length > 0) setQuestions(res.data.data[0].questions);

        // console.log(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to get questions");
      }
    };

    const getComapny = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api//companies/get-company-by-id/${id}?address=${selectedAccount}`
        );
        // console.log(res.data);
        setCompany({
          companyName: res.data.company.companyName,
          role: res.data.company.role,
          jobDescription: res.data.company.jobDescription,
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (id && type && selectedAccount) fetchQuestiosn();
    if (id && selectedAccount) getComapny();
    if (selectedAccount) getResumeStatus();
  }, [id, type, selectedAccount]);
  console.log("resume,resume", resume);
  return <div className="text-white"></div>;
}

export default InterviewPage;
