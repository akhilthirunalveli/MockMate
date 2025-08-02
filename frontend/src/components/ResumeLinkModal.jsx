import React, { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

const ResumeLinkModal = ({ onClose, onSave }) => {
  const { user, updateUser } = useContext(UserContext);
  const [resumeLink, setResumeLink] = useState(user?.resumeLink || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!user?.resumeLink); // Auto-edit mode if no resume link exists

  const handleSave = async () => {
    if (!resumeLink.trim()) {
      toast.error("Please enter a valid resume link");
      return;
    }

    try {
      new URL(resumeLink);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_RESUME_LINK, {
        resumeLink: resumeLink.trim(),
      });

      // Update user context with new resume link
      updateUser(response.data.user);
      toast.success("Resume link saved successfully!");
      setIsEditing(false); // Exit edit mode after saving
      onSave?.(resumeLink.trim());
      onClose();
    } catch (error) {
      console.error("Error saving resume link:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to save resume link";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setResumeLink(user?.resumeLink || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setResumeLink(user?.resumeLink || "");
  };

  const handleOpen = () => {
    if (user?.resumeLink) {
      window.open(user.resumeLink, "_blank");
      onClose();
    }
  };

  return (
    <div className="p-6 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl min-w-[500px] max-w-[600px]">
      <h2 className="text-2xl font-semibold mb-2 text-white">
        {!user?.resumeLink ? "Add Resume Link" : isEditing ? "Edit Resume Link" : "Resume Link"}
      </h2>
      {user?.resumeLink && !isEditing && (
        <p className="text-gray-400 text-sm mb-6">You can view your resume or edit the link below</p>
      )}
      {(!user?.resumeLink || isEditing) && (
        <p className="text-gray-400 text-sm mb-6">
          {!user?.resumeLink ? "Add a link to your resume for easy access" : "Update your resume link"}
        </p>
      )}
      
      {user?.resumeLink && !isEditing ? (
        <div className="space-y-4">
          <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Current Resume Link:</p>
            <p className="text-blue-400 break-all font-medium">{user.resumeLink}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleOpen}
              className="flex-1 bg-blue-600/80 backdrop-blur-sm border border-blue-400/30 text-white py-3 px-6 rounded-lg hover:bg-blue-500/90 transition-all duration-200 font-medium"
            >
              Open Resume
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 bg-amber-600/80 backdrop-blur-sm border border-amber-400/30 text-white py-3 px-6 rounded-lg hover:bg-amber-500/90 transition-all duration-200 font-medium"
            >
              Edit Link
            </button>
          </div>
        </div>
      ) : null}

      {(!user?.resumeLink || isEditing) && (
        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Resume Link (Google Drive, Dropbox, etc.)
            </label>
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-white placeholder-gray-400 transition-all duration-200"
            />
            <p className="text-xs text-gray-400 mt-2">
              Make sure your resume link is publicly accessible
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={loading || !resumeLink.trim()}
              className="flex-1 bg-green-600/80 backdrop-blur-sm border border-green-400/30 text-white py-3 px-6 rounded-lg hover:bg-green-500/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Saving..." : (user?.resumeLink ? "Update Resume Link" : "Save Resume Link")}
            </button>
            {user?.resumeLink && isEditing ? (
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-600/80 backdrop-blur-sm border border-gray-400/30 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-500/90 hover:text-white transition-all duration-200 font-medium"
              >
                Cancel Edit
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-gray-300 py-3 px-6 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeLinkModal;
