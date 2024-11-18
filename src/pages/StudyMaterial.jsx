import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/useWeb3Context";
import { useParams } from "react-router-dom";
import { FileTextIcon, LinkIcon, Loader2, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function StudyMaterial() {
  const [resources, setResources] = useState([]);
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const { id } = useParams();

  const getResource = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/companies/get-resources?address=${selectedAccount}&id=${id}`
      );
      console.log(res.data);
      setResources(res.data.resources);
    } catch (err) {
      console.log(err);
      toast.error("Failed to get resources");
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getResource();
    }
  }, [selectedAccount]);
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 sm:px-12 md:px-32 lg:px-48">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Study Materials
        </h2>
        {resources.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400 text-lg">No resources uploaded yet.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {resources.map((resource, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {/* Icon for resource type */}
                  {resource.resourceType === "link" ? (
                    <LinkIcon className="text-blue-400 w-6 h-6" />
                  ) : (
                    <FileTextIcon className="text-blue-400 w-6 h-6" />
                  )}
                  <div>
                    <p className="text-lg font-bold">{resource.title}</p>
                    {resource.resourceType === "link" && (
                      <a
                        href={resource.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {resource.resourceUrl}
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  {resource.resourceType === "file" && (
                    <button
                      onClick={() =>
                        window.open(resource.resourceUrl, "_blank")
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-sm"
                    >
                      Open File
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudyMaterial;
