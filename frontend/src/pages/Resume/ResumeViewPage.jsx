import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Settings01Icon,
  Idea01Icon,
  ChartBarLineIcon,
  CursorPointer01Icon,
  Tick01Icon,
  Download01Icon,
  ArrowUpRight01Icon,
  SparklesIcon,
  Target01Icon,
  Share01Icon,
  CheckmarkCircle02Icon,
  GoogleDriveIcon,
  PencilEdit01Icon
} from 'hugeicons-react';
import { UserContext } from "../../context/userContext.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../constants/apiPaths.js";
import toast from "react-hot-toast";
import Navbar from "../Navbar/Navbar.jsx";

const getDirectPdfUrl = (url) => {
  if (!url) return "";
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const RESUME_TIPS = [
  {
    title: "Quantify Impact",
    description: "Use numbers (e.g., 'Increased efficiency by 20%') to make your achievements more tangible."
  },
  {
    title: "Keywords Matter",
    description: "Align your skills with job descriptions to pass ATS filters effectively."
  },
  {
    title: "Keep it Concise",
    description: "Aim for a single page if you have less than 10 years of experience."
  }
];

const RECOMMENDED_SECTIONS = [
  "Core Competencies",
  "Professional Summary",
  "Key Projects",
];

const ResumeViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useContext(UserContext);

  // State from location or context fallback
  const initialPdfUrl = location.state?.pdfUrl || user?.resumeLink || "";
  const initialDetails = location.state?.details || { name: user?.name, email: user?.email };

  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl);
  const [editUrl, setEditUrl] = useState(initialPdfUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const directUrl = getDirectPdfUrl(pdfUrl);

  const handleUpdateResume = async () => {
    if (!editUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setSaving(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_RESUME_LINK, {
        resumeLink: editUrl.trim(),
      });

      updateUser(response.data.user);
      setPdfUrl(editUrl.trim());
      setIsEditing(false);
      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0A0A0A] bg-dots-dark text-white selection:bg-white/20 overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-8xl mx-auto px-4 sm:px-6 lg:px-9 pt-28 pb-6 w-full flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full min-h-0 flex-1">

          {/* Left: PDF Viewer - Full Visibility */}
          <div className="xl:col-span-8 h-full min-h-0 flex flex-col">
            <div className="bg-black rounded-[30px] border border-[#222] overflow-hidden shadow-2xl relative flex-1 flex flex-col">
              {pdfUrl ? (
                <iframe
                  src={directUrl}
                  title="PDF Viewer"
                  className="w-full h-full border-none flex-1"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-10">
                  <Idea01Icon size={64} className="text-gray-700 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resume Linked</h3>
                  <p className="text-gray-500 max-w-sm mb-6">
                    Link your resume to start analyzing it with MockMate Intelligence tools.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl cursor-pointer"
                  >
                    Add Resume Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Bento Side Console */}
          <div className="xl:col-span-4 grid grid-cols-2 grid-rows-6 gap-4 h-full min-h-0">

            {/* Management Card - Bento A */}
            <div className="col-span-2 row-span-1 bg-black rounded-[30px] p-5 shadow-2xl flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white uppercase py-2">Source Control</span>
                {!isEditing && pdfUrl && (
                  <button onClick={() => setIsEditing(true)} className="p-1.5 text-white/50 cursor-pointer hover:text-white transition-colors">
                    <PencilEdit01Icon size={18} />
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-xl px-3 py-2 text-[13px] focus:outline-none placeholder:text-gray-600"
                    placeholder="Resume URL..."
                  />
                  <button onClick={handleUpdateResume} className="bg-white text-black px-4 py-2 rounded-xl text-[12px] font-bold cursor-pointer">Save</button>
                </div>
              ) : (
                <div className="bg-[#0A0A0A] px-4 py-3 rounded-2xl border border-[#222] flex items-center gap-2">
                  <p className="text-[13px] font-medium truncate text-white/50 tracking-tight">Active Source </p>
                  <GoogleDriveIcon size={18} className="text-white/50" />
                </div>
              )}
            </div>

            {/* Intelligence Card - Bento B */}
            <div className="col-span-2 row-span-3 bg-black rounded-[30px] p-6 shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                  Good Resume has these things
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTipIndex(prev => (prev === 0 ? RESUME_TIPS.length - 1 : prev - 1))}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-pointer hover:text-white transition-colors"
                  >
                    <ArrowLeft01Icon size={14} />
                  </button>
                  <button
                    onClick={() => setTipIndex(prev => (prev === RESUME_TIPS.length - 1 ? 0 : prev + 1))}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-pointer hover:text-white transition-colors"
                  >
                    <ArrowRight01Icon size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center px-2">
                <div key={tipIndex} className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h4 className="font-bold text-[14px] text-white uppercase tracking-tight mb-3">{RESUME_TIPS[tipIndex].title}</h4>
                  <p className="text-[12px] text-white/50 leading-relaxed">{RESUME_TIPS[tipIndex].description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1A1A1A]">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {RECOMMENDED_SECTIONS.map((sec, idx) => (
                    <span key={idx} className="shrink-0 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400">
                      + {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ATS Power Tool - Bento C */}
            <div className="col-span-1 row-span-2 bg-black rounded-[30px] p-6 shadow-2xl flex flex-col justify-between">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]"></div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white">85</span>
                <span className="text-[10px] text-white/50 font-bold">Estimated</span>
              </div>
              <button
                onClick={() => navigate("/resume/ats-check")}
                className="w-full bg-white text-black py-3 rounded-2xl text-[11px] font-bold cursor-pointer shadow-lg"
              >
                Analyze
              </button>
            </div>

            {/* Skill Match Tool - Bento D */}
            <div className="col-span-1 row-span-2 bg-black rounded-[30px] p-6 shadow-2xl flex flex-col justify-between">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"></div>
              <div className="flex flex-col items-center">
                <Target01Icon size={32} className="text-white mb-2" />
                <span className="text-xl font-bold text-white">Target Fit</span>
              </div>
              <div className="bg-[#1A1A1A] h-1.5 w-full rounded-full overflow-hidden">
                <div className="bg-white h-full w-[75%]"></div>
              </div>
              <p className="text-[9px] text-white font-medium text-center">Top 5% of Candidates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewPage;
