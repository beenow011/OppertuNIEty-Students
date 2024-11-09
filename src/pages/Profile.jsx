import React from "react";
import { getContractInstance } from "../utils/getContractInstance";
import { User, Phone, Mail, GraduationCap, Settings, Cake } from "lucide-react";

function Profile() {
  const [user, setUser] = React.useState(null);

  const getUser = async () => {
    try {
      const contract = await getContractInstance();
      const tx = await contract.getUserProfile();
      setUser(tx);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

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

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">User Profile</h1>

      <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg p-8 space-y-8">
        {/* Personal Information */}
        <div className="border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-semibold flex items-center text-blue-300">
            <User className="mr-3 text-xl" /> {name}
          </h2>
          <p className="text-gray-400 mt-2">Software Developer & Engineer</p>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">
            Academic Information
          </h3>
          <div className="flex justify-between">
            <p className="text-gray-300">
              <strong>10th Percentage:</strong> {xPercentage}%
            </p>
            <p className="text-gray-300">
              <strong>12th Percentage:</strong> {xiiPercentage}%
            </p>
            <p className="text-gray-300">
              <strong>CGPA:</strong> {cgpa}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400">
            Contact Information
          </h3>
          <div className="flex items-center space-x-2 text-gray-300">
            <Cake className="text-blue-300" />
            <span>
              <strong>Date of Birth:</strong> {dob}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Phone className="text-blue-300" />
            <span>
              <strong>Phone:</strong> {phone}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Mail className="text-blue-300" />
            <span>
              <strong>Email:</strong> {email}
            </span>
          </div>
        </div>

        {/* Core Skills */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-400 flex items-center">
            <Settings className="mr-2" /> Core Skills
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-gray-300">
            {coreSkills &&
              coreSkills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-gray-800 rounded-md py-1 px-3 text-center text-sm shadow-md"
                >
                  {skill}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
