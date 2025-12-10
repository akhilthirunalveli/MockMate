import React, { useState, useContext } from "react";
import { UserContext } from "../../../context/userContext.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";
import { API_PATHS } from "../../../constants/apiPaths.js";
import toast from "react-hot-toast";
import Input from "../../Home/Components/Input.jsx";
import PdfViewModal from "./PdfViewModal.jsx";
import { useNavigate } from "react-router-dom";

const ResumeLinkModal = ({ onClose, onSave }) => {
  const { user, updateUser } = useContext(UserContext);
  const [resumeLink, setResumeLink] = useState(user?.resumeLink || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!user?.resumeLink);
  const [showPdf, setShowPdf] = useState(false);
  const navigate = useNavigate();

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
      navigate("/resume-view", {
        state: {
          pdfUrl: user.resumeLink,
          details: {
            name: user?.name,
            email: user?.email,
            // Add more user details as needed
          },
        },
      });
    }
  };

  return (
    <div
      className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center relative rounded-lg shadow"
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div style={{
        background: "rgba(255, 255, 255, 1)",
        borderRadius: "inherit",
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }} />

      {/* Close button */}
      <button
        type="button"
        className="bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer transition-all duration-200 text-gray-500 hover:text-black z-20"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 className="text-lg font-semibold text-black">
          {!user?.resumeLink ? "Add Resume Link" : isEditing ? "Edit Resume Link" : "Resume Link"}
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-3">
          {user?.resumeLink && !isEditing
            ? "You can view your resume or edit the link below"
            : !user?.resumeLink
              ? "Add a link to your resume for easy access"
              : "Update your resume link"}
        </p>
        {user?.resumeLink && !isEditing ? (
          <div className="flex flex-col gap-3 mt-2">
            <div className=" rounded-lg px-4 py-3 flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">Current Resume Link:</span>
              <span className="text-black break-all font-medium text-base text-center">{user.resumeLink}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleOpen}
                className="btn-primary w-1/2"
              >
                Open Resume
              </button>
              <button
                onClick={handleEdit}
                className="btn-primary w-1/2"
              >
                Edit Link
              </button>
            </div>
          </div>
        ) : null}
        {(!user?.resumeLink || isEditing) && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-3 mt-2"
          >
            <Input
              value={resumeLink}
              onChange={({ target }) => setResumeLink(target.value)}
              label="Resume Link (Google Drive, Dropbox, etc.)"
              placeholder="https://drive.google.com/file/d/..."
              type="url"
            />
            <p className="text-xs text-slate-700 mt-1 mb-1 text-center">
              Make sure your resume link is publicly accessible
            </p>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !resumeLink.trim()}
                className="btn-primary w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : (user?.resumeLink ? "Update Resume Link" : "Save Resume Link")}
              </button>
              {user?.resumeLink && isEditing ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-primary w-1/2"
                >
                  Cancel Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary w-1/2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
        {showPdf && (
          <PdfViewModal pdfUrl={user.resumeLink} onClose={() => setShowPdf(false)} />
        )}
      </div>
    </div>
  );
};

export default ResumeLinkModal;