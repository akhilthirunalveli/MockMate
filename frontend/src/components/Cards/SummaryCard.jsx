import React, { useMemo } from "react";
import { FaArrowRight, FaTrashAlt } from "react-icons/fa";
import { getInitials } from "../../utils/helper";
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
}) => {
  const tags = Array.isArray(topicsToFocus)
    ? topicsToFocus
    : (topicsToFocus || "").split(",").map(t => t.trim()).filter(Boolean);
  const gradientIdx = useMemo(() => {
    if (typeof index === "number") return index % gradients.length;
    return getRandomIndex(role + (description || "")) % gradients.length;
  }, [role, description, index]);
  const gradientClass = `bg-gradient-to-br ${gradients[gradientIdx]}`;

  return (
    <div
      className={`relative rounded-2xl ${gradientClass} border border-gray-700/60 shadow-2xl overflow-hidden group hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0)] w-full max-w-[400px] min-w-[220px] min-h-[140px] max-h-[220px] m-[6px]`}
      style={{
        height: "140px",
      }}>
      <div className="pointer-events-none absolute inset-0 z-0 transition-all duration-300 group-hover:bg-white/10" style={{
        background: "linear-gradient(135deg,rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0) 100%)"
      }}/>
      {onDelete && (
        <button
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-900 hover:bg-red-600 text-white text-xs font-bold shadow transition z-20 opacity-0 group-hover:opacity-100"
          style={{ lineHeight: 1 }}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <FaTrashAlt size={13} />
        </button>
      )}
      <div className="relative z-10 flex flex-col h-full px-4 pt-6 pb-4">
        <div className="flex flex-row items-start gap-3">
          {/* Avatar/Initials */}
          <div className="w-12 h-12 rounded-full bg-transparent border border-white flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
            <span className="text-xl font-extrabold text-gray-100" style={{ fontSize: '1.25rem' }}>{getInitials(role)}</span>
          </div>
          <div className="flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-1 truncate" style={{ fontSize: '1.1rem' }}>{role}</h2>
            <div className="flex flex-wrap gap-2 mb-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/90 text-gray-900 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow"
                  style={{ fontSize: '0.7rem' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-300 mb-1 line-clamp-2" style={{ fontSize: '0.85rem' }}>{description}</p>
          </div>
        </div>
        <div className="flex justify-end mt-auto">
          <button
            className="flex items-center gap-1 text-xs font-semibold text-white bg-transparent border border-white px-2 py-1 rounded-full shadow transition cursor-pointer"
            onClick={onSelect}
            style={{ minHeight: 0, minWidth: 0, fontSize: '0.8rem' }}
          >
            Explore
            <span className="inline-flex items-center justify-center w-3 h-3 bg-transparent rounded-full ml-1">
              <FaArrowRight className="text-white" size={10} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;
