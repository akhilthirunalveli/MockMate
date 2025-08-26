import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

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
    <div className="min-h-screen w-full flex" style={{
      opacity: 1,
      backgroundImage: "radial-gradient(#e5e5e5 0.5px,#080708 0.5px)",
      backgroundSize: "21px 21px",
    }}>
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
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold w-fit"
            >
              <IoArrowBack className="w-5 h-5" /> Back
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewPage;
