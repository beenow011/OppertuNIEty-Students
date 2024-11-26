import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/useWeb3Context";
import { useParams } from "react-router-dom";
import {
  FileTextIcon,
  LinkIcon,
  Loader2,
  BookOpen,
  ExternalLink,
  Download,
  Search,
  FolderOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function StudyMaterial() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { updateWeb3State, Web3State } = useWeb3Context();
  const { selectedAccount } = Web3State;
  const { id } = useParams();

  const getResource = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/companies/get-resources?address=${selectedAccount}&id=${id}`
      );
      setResources(res.data.resources);
    } catch (err) {
      console.log(err);
      toast.error("Failed to get resources");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getResource();
    }
  }, [selectedAccount]);

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ResourceCard = ({ resource }) => (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div
              className={`
              p-3 rounded-lg 
              ${
                resource.resourceType === "link"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-purple-500/10 text-purple-400"
              }
            `}
            >
              {resource.resourceType === "link" ? (
                <LinkIcon className="w-6 h-6" />
              ) : (
                <FileTextIcon className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                {resource.title}
              </h3>
              {resource.resourceType === "link" && (
                <a
                  href={resource.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Resource
                </a>
              )}
            </div>
          </div>
          {resource.resourceType === "file" && (
            <button
              onClick={() => window.open(resource.resourceUrl, "_blank")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all duration-300 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-400">Loading resources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Study Materials</h1>
          </div>
          <p className="text-gray-400">
            Access all your preparation resources in one place
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700/50">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Resources Found
            </h3>
            <p className="text-gray-500">
              No study materials have been uploaded yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        )}

        {/* Show when search has no results */}
        {searchTerm && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-1">
              No matching resources
            </h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyMaterial;
