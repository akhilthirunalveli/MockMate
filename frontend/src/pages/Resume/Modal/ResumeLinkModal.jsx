import React, { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { UserContext } from "../../../context/userContext.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";
import { API_PATHS } from "../../../constants/apiPaths.js";
import toast from "react-hot-toast";
import Input from "../../Home/Components/Input.jsx";
import PdfViewModal from "./PdfViewModal.jsx";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoCreateOutline, IoBarChartOutline } from "react-icons/io5";

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
          details: { name: user?.name, email: user?.email },
        },
      });
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/30 p-4 sm:p-8"
      onClick={onClose}
    >
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div
        className="relative flex flex-col justify-center rounded-lg shadow-lg w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[45vw] lg:max-w-[40vw] min-h-[220px] p-4 sm:p-8 overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #ff6a00, #ee0979, #00c3ff, rgb(0,74,25), rgb(0,98,80), #ff6a00)",
          backgroundSize: "300% 100%",
          animation: "gradientBG 8s ease-in-out infinite"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 z-0 bg-white/90 rounded-lg pointer-events-none" />
        <div className="relative z-10 w-full">
          <button
            type="button"
            className="bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute -top-3 -right-3 cursor-pointer transition-all duration-200 text-gray-500 hover:text-black cursor-pointer"
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

          <h3 className="text-xl font-semibold text-black mb-3">
            {!user?.resumeLink ? "Add Your Resume" : isEditing ? "Update Link" : "Resume Options"}
          </h3>
          <p className="text-sm text-slate-700 mt-1 mb-8">
            {!user?.resumeLink ? "Link your resume to unlock full features." : isEditing ? "Enter the new URL for your resume." : "Select an action to proceed with your resume"}
          </p>

          {!isEditing && user?.resumeLink ? (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full justify-center items-center">
              <button
                className="w-36 h-36 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 transition cursor-pointer"
                onClick={handleEdit}
              >
                <IoCreateOutline size={40} />
                <span>Edit Link</span>
              </button>
              <button
                className="cursor-pointer w-36 h-36 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 cursor-pointer transition"
                onClick={handleOpen}
              >
                <IoEyeOutline size={40} />
                <span>View Resume</span>
              </button>
              <button
                className="cursor-pointer w-36 h-36 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 cursor-pointer transition"
                onClick={() => navigate("/resume/ats-check")}
              >
                <IoBarChartOutline size={40} />
                <span>ATS Check <span className="text-xs font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-transparent bg-clip-text block mt-1">New</span></span>
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="w-full flex flex-col gap-6"
            >
              <div className="w-full space-y-2">
                <label className="text-sm font-medium text-gray-600 ml-1">Resume URL</label>
                <div className="border border-gray-200 rounded-xl px-4 py-3">
                  <input
                    value={resumeLink}
                    onChange={({ target }) => setResumeLink(target.value)}
                    placeholder="https://drive.google.com/..."
                    type="url"
                    className="w-full border-none focus:ring-0 focus:outline-none text-sm text-black placeholder-gray-400 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 w-full pt-2">
                {user?.resumeLink && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="cursor-pointer flex-1 py-3.5 font-bold text-gray-500 hover:text-black transition-all rounded-full"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !resumeLink.trim()}
                  className=" cursor-pointer flex-1 bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-900 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform active:scale-95"
                >
                  {loading ? "Saving..." : "Save Link"}
                </button>
              </div>
            </form>
          )}

          {showPdf && (
            <PdfViewModal pdfUrl={user.resumeLink} onClose={() => setShowPdf(false)} />
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default ResumeLinkModal;