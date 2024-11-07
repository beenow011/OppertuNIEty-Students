import React, { useState } from "react";

function CompleteSignup() {
  const [formData, setFormData] = useState({
    name: "",
    xPercentage: "",
    xiiPercentage: "",
    cgpa: "",
    dob: "",
    phone: "",
    email: "",
    coreSkills: [],
    resume: null,
    certificates: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., sending data to backend)
    console.log("Form Data:", formData);
  };

  return (
    <div className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">
          Complete Your Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Core Skills */}
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-300">
              Core Skills:
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "OS",
                "CN",
                "Web Dev",
                "Data Science",
                "AI",
                "Machine Learning",
                "Blockchain",
                "Cybersecurity",
                "Cloud Computing",
                "React.js",
                "Node.js",
                "Database Management",
                "UI/UX Design",
              ].map((skill) => (
                <label
                  key={skill}
                  className="inline-flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={skill}
                    checked={formData.coreSkills.includes(skill)}
                    onChange={handleSkillsChange}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span className="text-gray-300">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-group">
            <label
              htmlFor="resume"
              className="block text-lg font-medium text-gray-300"
            >
              Upload Resume:
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Certificates Upload */}
          <div className="form-group">
            <label
              htmlFor="certificates"
              className="block text-lg font-medium text-gray-300"
            >
              Upload Certificates:
            </label>
            <input
              type="file"
              id="certificates"
              name="certificates"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          All your data will be securely stored on blockchain and IPFS, ensuring
          transparency and safety.
        </p>
      </div>
    </div>
  );
}

export default CompleteSignup;
