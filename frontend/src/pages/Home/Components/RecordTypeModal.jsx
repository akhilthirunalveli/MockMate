import React from "react";
import { createPortal } from "react-dom";
import { BsPerson, BsPeople, BsCast } from "react-icons/bs";

const RecordTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
      style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "40px" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Modal box with gradient background like Login.jsx */}
      <div 
        className="w-[80vw] md:w-[45vw] lg:w-[40vw] p-8 flex flex-col justify-center rounded-lg shadow"
        style={{
          background: "linear-gradient(120deg, #ff6a00, #ee0979, #00c3ff, rgb(0,74,25), rgb(0,98,80), #ff6a00)",
          backgroundSize: "300% 100%",
          animation: "gradientBG 8s ease-in-out infinite",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.13)",
          position: "relative",
          overflow: "hidden",
          maxWidth: "500px",
          minHeight: "320px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* White translucent overlay like Login.jsx */}
        <div style={{
          background: "rgba(255,255,255,0.90)",
          borderRadius: "inherit",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none"
        }} />
        
        {/* Content with relative positioning */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Close button with X icon */}
          <button
            type="button"
            className="bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute -top-2.5 -right-2.5 cursor-pointer transition-all duration-200 text-gray-500 hover:text-black"
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

          <h3 className="text-xl font-semibold text-black mb-3">Choose Interview Type</h3>
          <p className="text-sm text-slate-700 mt-[5px] mb-8">Select where you'd like to record the interview</p>

          <div style={{ display: "flex", gap: 32, width: "100%", justifyContent: "center" }}>
            <button
              style={{
                width: 160,
                height: 160,
                borderRadius: 12,
                background: "transparent",
                color: "#111",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 20,
                gap: 12
              }}
              onClick={() => onSelect("hr")}
            >
              <BsPerson size={40} />
              <span>HR Interview</span>
            </button>

            <button
              style={{
                width: 160,
                height: 160,
                borderRadius: 12,
                background: "transparent",
                color: "#111",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 20,
                gap: 12
              }}
              onClick={() => onSelect("session")}
            >
              <BsPeople size={40} />
              <span>Session Interview</span>
            </button>

            <button
              style={{
                width: 160,
                height: 160,
                borderRadius: 12,
                background: "transparent",
                color: "#4c4c4c31",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 20,
                gap: 12
              }}
              onClick={() => onSelect("")}
            >
              <BsCast size={40} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span>Live Interview</span>
                <span style={{
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "12px",
                  color: "#eaeaeaff",
                  fontWeight: "500"
                }}>
                  Coming Soon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render via portal so modal isn't constrained by parent stacking/positioning
  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default RecordTypeModal;