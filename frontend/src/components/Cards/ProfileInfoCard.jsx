import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Add ref for click-away detection
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="relative" ref={cardRef}>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className="w-10 h-9 bg-gray-900 rounded-full mr-3"
          />
          <div>
            <div className="text-[15px] text-white font-bold leading-3">
              {user.name || ""}
            </div>
            <div className="text-grey-500 text-sm truncate max-w-[200px]">
              {user.email || ""}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 min-w-[220px] max-w-[320px] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-700/60 backdrop-blur-xl transition-all">
            <button
              className="w-full text-left px-5 py-2 text-sm text-red-400 cursor-pointer transition rounded-b-xl"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default ProfileInfoCard;
