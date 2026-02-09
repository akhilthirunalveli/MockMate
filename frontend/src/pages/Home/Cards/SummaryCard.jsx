import React, { useMemo } from "react";
import { ArrowRight01Icon, Delete02Icon, File02Icon } from 'hugeicons-react';
import { getInitials } from "../Utils/helper";
const gradients = [
  "from-gray-900 via-black to-black",
  "from-cyan-700 via-black to-black",
  "from-pink-700 via-black to-black",
  "from-emerald-700 via-black to-black",
  "from-yellow-700 via-black to-black",
  "from-indigo-700 via-black to-black",
  "from-purple-700 via-black to-black",
  "from-green-700 via-black to-black",
  "from-orange-700 via-black to-black",
  "from-blue-700 via-black to-black",
];
function getRandomIndex(key) {
  let str = typeof key === "string" ? key : JSON.stringify(key);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  description,
  onSelect,
  onDelete,
  index,
  isResumeSession,
}) => {
  const tags = Array.isArray(topicsToFocus)
    ? topicsToFocus
    : (topicsToFocus ? topicsToFocus.split(",").map((t) => t.trim()) : ["Resume"]);

  const displayRole = role || "Resume Based Session";
  const gradientIdx = useMemo(() => {
    if (typeof index === "number") return index % gradients.length;
    return getRandomIndex(role + (description || "")) % gradients.length;
  }, [role, description, index]);
  const gradientClass = `bg-gradient-to-br ${gradients[gradientIdx]}`;

  return (
    <div
      className={`relative rounded-xl sm:rounded-2xl ${gradientClass} border border-gray-700/60 shadow-xl sm:shadow-2xl overflow-hidden group hover:scale-[1.02] sm:hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0)] w-full max-w-[320px] sm:max-w-[400px] min-w-[200px] sm:min-w-[220px] min-h-[160px] sm:min-h-[140px] max-h-[200px] sm:max-h-[220px] mx-auto sm:m-[6px] transition-all duration-200`}
      style={{
        height: "auto",
        minHeight: "160px",
      }}>
      <div className="pointer-events-none absolute inset-0 z-0 transition-all duration-300 group-hover:bg-white/10" style={{
        background: "linear-gradient(135deg,rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0) 100%)"
      }} />
      {onDelete && (
        <button
          className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-red-900 hover:bg-red-600 text-white text-xs font-bold shadow transition z-20 opacity-0 group-hover:opacity-100 cursor-pointer"
          style={{ lineHeight: 1 }}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <Delete02Icon size={13} />
        </button>
      )}
      <div className="relative z-10 flex flex-col h-full px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex flex-row items-start gap-2 sm:gap-3">
          {/* Avatar/Initials */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-transparent border-2 border-white/50 flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
            {isResumeSession || displayRole === "Resume Session" ? (
              <File02Icon className="text-white" size={24} />
            ) : (
              <span className="text-lg sm:text-xl font-extrabold text-gray-100" style={{ fontSize: '1rem sm:1.25rem' }}>{getInitials(displayRole)}</span>
            )}
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1 truncate" style={{ fontSize: '1rem sm:1.1rem' }}>{displayRole}</h2>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-1">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/90 text-gray-900 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow"
                  style={{ fontSize: '0.65rem sm:0.7rem' }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-white/70 text-gray-700 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                  +{tags.length - 3}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-xs text-gray-300 mb-2 sm:mb-1 line-clamp-2 leading-relaxed" style={{ fontSize: '0.75rem sm:0.85rem' }}>{description}</p>
          </div>
        </div>
        <div className="flex justify-end mt-auto pt-3">
          <button
            className="flex items-center gap-1 text-xs sm:text-xs font-semibold text-white bg-transparent border border-gray-900 px-3 sm:px-2 py-1.5 sm:py-1 rounded-full shadow transition cursor-pointer hover:bg-white/5 active:scale-95"
            onClick={onSelect}
            style={{ minHeight: '32px', minWidth: '80px', fontSize: '0.75rem' }}
          >
            <span className="text-xs ml-1">Explore</span>
            <span className="inline-flex items-center justify-center w-3 h-3 bg-transparent rounded-full ml-1">
              <ArrowRight01Icon className="text-white" size={10} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;
