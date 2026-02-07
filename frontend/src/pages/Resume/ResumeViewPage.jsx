import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft01Icon } from 'hugeicons-react';

// Usage: <ResumeViewPage />
// Expects location.state = { pdfUrl, details }

const getDirectPdfUrl = (url) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const ResumeViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pdfUrl, details } = location.state || {};
  const directUrl = getDirectPdfUrl(pdfUrl);

  return (
    <div className="min-h-screen w-full flex bg-dots-dark">
      <div className="w-full max-w-6xl mx-auto flex flex-row items-stretch py-10 gap-8">
        {/* Left: PDF Viewer */}
        <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <iframe
            src={directUrl}
            title="PDF Viewer"
            className="flex-1 w-full h-[80vh] border-none"
          />
        </div>
        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-between text-white">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold w-fit cursor-pointer"
            >
              <ArrowLeft01Icon className="w-5 h-5" /> Back
            </button>
            <h2 className="text-2xl font-bold mb-4">Resume Details</h2>
            {/* Render details here */}
            {details ? (
              <div className="space-y-2">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-semibold text-slate-300">{key}:</span> <span className="text-slate-100">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No details provided.</p>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xl font-bold mb-3">Tools</h3>
              <button
                onClick={() => navigate("/resume/ats-check")}
                className="flex items-center gap-3 w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.516l-.318 1.843a.75.75 0 00.434.848c.88.297 1.62.91 2.052 1.708.433.799.475 1.745.116 2.57l-.306.703a.75.75 0 00.385 1.01l1.761.64c.25.09.528.02.723-.178.508-.517.587-1.332.197-1.928-.39-.595-.148-1.42.366-1.666a.75.75 0 011.02.261l.525.932a.75.75 0 001.076.27l1.7-.872a.75.75 0 00.334-1.028l-.508-.987a.75.75 0 01.378-1.077c.602-.234.618-1.092.028-1.347l-1.348-.585z" />
                    <path d="M6.5 21a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15.5 21a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM21 6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path fillRule="evenodd" d="M19.108 4.673a1.5 1.5 0 00-2.348-.46l-4.225 4.227a6.002 6.002 0 00-7.395 7.18 3.003 3.003 0 012.78 2.029 3 3 0 004.99 0 3.003 3.003 0 012.78-2.029 6.002 6.002 0 007.419-7.18l.84-.84a1.5 1.5 0 00-.84-2.927zM8.5 15a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-white font-bold">ATS Resume Checker</span>
                  <span className="block text-slate-400 text-sm">Analyze compatibility with job descriptions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewPage;
