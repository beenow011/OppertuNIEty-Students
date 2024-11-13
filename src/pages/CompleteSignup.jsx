import axios from "axios";
import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/useWeb3Context";
import toast from "react-hot-toast";
import { getContractInstance } from "../utils/getContractInstance";
import { GemIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CompleteSignup() {
  const { updateWeb3State, Web3State } = useWeb3Context();
  const [file, setFile] = useState(null);
  const { selectedAccount, setSelectedAccount } = Web3State;
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const navigate = useNavigate();
  const [aiLoading, setAiLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    xPercentage: "",
    xiiPercentage: "",
    cgpa: "",
    dob: "",
    phone: "",
    email: "",
    coreSkills: [],
  });
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      let newSkills = [...prevState.coreSkills];
      if (checked) {
        newSkills.push(value);
      } else {
        newSkills = newSkills.filter((skill) => skill !== value);
      }
      return {
        ...prevState,
        coreSkills: newSkills,
      };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

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
        console.log("Resume already uploaded");
        const contract = await getContractInstance();
        const tx = await contract.viewResume();
        console.log("tx1", tx);
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

  const uploadImageHash = async (hash) => {
    const contract = await getContractInstance();
    const tx = await contract.uploadResume(hash);

    console.log("tx", tx);
  };

  const handleResumeUpload = async () => {
    try {
      setResumeLoading(true);
      if (file) {
        const formDataInstance = new FormData();
        formDataInstance.append("file", file);

        const res = await axios.post(
          "http://localhost:3000/api/student-auth/upload-resume?address=" +
            selectedAccount,
          formDataInstance
        );

        await uploadImageHash(res.data.ipfsHash);
        const res2 = await axios.post(
          "http://localhost:3000/api/student-auth/resume-status?address=" +
            selectedAccount
        );
        if (res2.status === 200) {
          toast.success("Resume uploaded successfully!");
        }
        setIsResumeUploaded(true);
      } else {
        alert("Please upload your resume first.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error uploading resume");
    } finally {
      setResumeLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Handle form submission logic here (e.g., sending data to backend)
      const contract = await getContractInstance();
      const tx = await contract.setUserProfile(
        formData.name,
        formData.xPercentage.toString(),
        formData.xiiPercentage.toString(),
        formData.cgpa.toString(),
        formData.dob.toString(),
        formData.phone,
        formData.email,
        formData.coreSkills
      );
      const res = await axios.post(
        "http://localhost:3000/api/student-auth/set-student-status?address=" +
          selectedAccount
      );
      if (res.status === 200) navigate("/dashboard");
      console.log("Form Data:", tx);
    } catch (err) {
      console.log(err);
      toast.error("Error submitting form");
    } finally {
      setSubmitLoading(false);
    }
  };

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
  const handleFillByAI = async () => {
    try {
      setAiLoading(true);
      const formDataInstance = new FormData();
      let file = base64ToFile(
        "data:application/pdf;base64," + resume,
        "resume.pdf"
      );
      console.log(file);
      formDataInstance.append("file", file);
      const res = await axios.post(
        "http://localhost:3000/api/openai/fillByResume",
        formDataInstance
      );

      if (res.status === 200) {
        const jsonString = res.data.data.replace(/```json|```/g, "").trim();
        const data = JSON.parse(jsonString);

        console.log(data);

        setFormData({
          name: data.name,
          xPercentage: data.xPercentage,
          xiiPercentage: data.xiiPercentage,
          cgpa: data.cgpa,
          dob: data.dob,
          phone: data.phone,
          email: data.email,
          coreSkills: data.coreSkills,
        });
      }
      console.log(res);
      toast.success("Filled by AI successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error filling by AI");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">
          Complete Your Signup
        </h2>

        {/* Resume Upload Section */}
        {!isResumeUploaded ? (
          <div>
            <h3 className="text-2xl text-center text-gray-300 mb-4">
              Upload Your Resume
            </h3>
            <div className="form-group mb-6">
              <label
                htmlFor="resume"
                className="block text-lg font-medium text-gray-300"
              >
                Resume:
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={resumeLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              {resumeLoading ? <Loader2 className="animate-spin" /> : "Upload"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* After Resume is Uploaded, Show the Other Fields */}
            <iframe
              src={`data:application/pdf;base64,${resume}`}
              width="100%"
              height="500px"
            ></iframe>

            <button
              className="flex gap-2 justify-center items-center mx-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:from-purple-500 hover:to-indigo-500"
              onClick={handleFillByAI}
              disabled={aiLoading}
            >
              Fill by AI{" "}
              {aiLoading ? <Loader2 className="animate-spin" /> : <GemIcon />}
            </button>

            <div className="form-group">
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-300"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* 10th Percentage */}
            <div className="form-group">
              <label
                htmlFor="xPercentage"
                className="block text-lg font-medium text-gray-300"
              >
                10th Percentage:
              </label>
              <input
                type="number"
                id="xPercentage"
                name="xPercentage"
                value={formData.xPercentage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* 12th Percentage */}
            <div className="form-group">
              <label
                htmlFor="xiiPercentage"
                className="block text-lg font-medium text-gray-300"
              >
                12th Percentage:
              </label>
              <input
                type="number"
                id="xiiPercentage"
                name="xiiPercentage"
                value={formData.xiiPercentage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* B.E CGPA */}
            <div className="form-group">
              <label
                htmlFor="cgpa"
                className="block text-lg font-medium text-gray-300"
              >
                B.E CGPA:
              </label>
              <input
                type="number"
                step="0.01"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label
                htmlFor="dob"
                className="block text-lg font-medium text-gray-300"
              >
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-300"
              >
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* Email ID */}
            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-300"
              >
                Email ID:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>

            {/* Core Skills */}
            <div className="form-group">
              <label className="block text-lg font-medium text-gray-300">
                Core Skills:
              </label>
              <textarea
                type="text"
                value={formData.coreSkills.join(", ")} // Display skills as a comma-separated string
                onChange={(e) => {
                  // Split the entered text by commas and store as an array in formData
                  const skillsArray = e.target.value
                    .split(",")
                    .map((skill) => skill.trim()) // Trim whitespace around each skill
                    .filter((skill) => skill); // Remove any empty strings from the array
                  setFormData({ ...formData, coreSkills: skillsArray });
                }}
                rows={5}
                placeholder="Enter skills separated by commas"
                className="form-input mt-2 block w-full rounded-md bg-gray-700 text-gray-300"
              />
            </div>

            {/* Certificates Upload */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              disabled={submitLoading}
            >
              {
                // Show a loading spinner if the form is being submitted
                submitLoading ? <Loader2 className="animate-spin" /> : "Submit"
              }
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CompleteSignup;
