import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LiveStreaming01Icon, UserSettings01Icon, UserStar01Icon } from "hugeicons-react";

const RecordTypeModal = ({ isOpen, onClose, onSelect }) => {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50 p-4 sm:p-8"
          onClick={onClose}
        >
          <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative flex flex-col justify-center rounded-lg shadow-lg w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[45vw] lg:max-w-[40vw] min-h-[220px] p-4 sm:p-8 overflow-hidden"
            style={{
              background: "#FFFFFF",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 z-0 bg-white/90 rounded-lg pointer-events-none" />
            <div className="relative z-10">
              <button
                type="button"
                className="bg-transparent rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute -top-3 -right-3 cursor-pointer transition-all duration-200 text-gray-500 hover:text-black"
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
              <p className="text-sm text-slate-700 mt-1 mb-8">Select where you'd like to record the interview. Simply, Turn on your camera and mic, see the question and answer on screen and get AI feedbacks</p>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full justify-center items-center">
                <button
                  className="w-36 h-36 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 transition cursor-pointer"
                  onClick={() => onSelect("hr")}
                >
                  <UserStar01Icon size={40} />
                  <span>HR Interview</span>
                </button>
                <button
                  className="w-48 h-40 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 cursor-pointer transition"
                  onClick={() => onSelect("session")}
                >
                  <UserSettings01Icon size={40} />
                  <span>Session Interview</span>
                </button>
                <button
                  className="w-36 h-36 rounded-xl bg-transparent text-[#111] font-semibold text-base flex flex-col items-center justify-center text-center p-5 gap-3 cursor-pointer transition"
                  onClick={() => onSelect("live")}
                >

                  <LiveStreaming01Icon size={40} className="text-black stroke-1" />
                  <span>1:1 Interview </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render via portal so modal isn't constrained by parent stacking/positioning
  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default RecordTypeModal;