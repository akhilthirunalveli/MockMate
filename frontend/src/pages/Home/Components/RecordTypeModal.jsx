import React from "react";
import { createPortal } from "react-dom";
import { BsPerson, BsPeople } from "react-icons/bs";

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
        className="w-[80vw] md:w-[45vw] lg:w-[40vw] p-10 flex flex-col justify-center rounded-lg shadow"
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
          <button
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              color: "#666",
              width: 32,
              height: 32,
              fontSize: 18,
              cursor: "pointer",
              fontWeight: 700,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ×
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
                border: "1px solid rgba(0,0,0,0.2)",
                boxShadow: "0 2px 10px rgba(2,6,23,0.05)",
                transition: "all 0.16s",
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
                border: "1px solid rgba(0,0,0,0.2)",
                boxShadow: "0 2px 10px rgba(2,6,23,0.05)",
                transition: "all 0.16s",
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
