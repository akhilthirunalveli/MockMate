import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  // Add ref for click-away detection
  const cardRef = React.useRef(null);

  // Show buttons on hover (desktop)
  const handleShowButtons = () => {
    if (window.innerWidth >= 640) setIsButtonsVisible(true);
  };
  const handleHideButtons = () => {
    if (window.innerWidth >= 640) setIsButtonsVisible(false);
  };

  // Show drawer on tap (mobile)
  const handleCardClick = () => {
    if (window.innerWidth < 640) {
      setIsOpen(true);
    }
  };

  React.useEffect(() => {
    if (!isButtonsVisible) return;
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsButtonsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isButtonsVisible]);

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

  const handleHome = () => {
    navigate("/"); // Change this path if your home route is different
  };

  return (
    user && (
      <div
        className="relative mr-[9%] sm:mr-0"
        ref={cardRef}
        onMouseEnter={handleShowButtons}
        onMouseLeave={handleHideButtons}
        onClick={handleCardClick}
        style={{ minWidth: 120 }}
      >
        {/* Profile Info (hidden when buttons are visible on large screens) */}
        {!(isButtonsVisible && window.innerWidth >= 640) && !isOpen && (
          <div className="flex items-center cursor-pointer transition-all duration-200">
            {user.profileImageUrl || user.photoURL ? (
              <img
                src={user.profileImageUrl || user.photoURL}
                alt={user.name}
                className="w-10 h-10 bg-gray-900 rounded-full mr-3 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-900 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg">
                {user.name ? user.name[0] : "U"}
              </div>
            )}
            <div className="hidden sm:block">
              <div className="text-[15px] text-white font-bold leading-3">
                {user.name || ""}
              </div>
              <div className="text-grey-500 text-sm truncate max-w-[200px]">
                {user.email || ""}
              </div>
            </div>
          </div>
        )}
        {/* Buttons (shown on hover for large screens only) */}
        {isButtonsVisible && window.innerWidth >= 640 && (
          <div className="flex gap-2 items-center justify-center transition-all duration-200">
            <button
              className="px-3 py-1 text-sm font-semibold text-white bg-gray-700 rounded-full shadow hover:bg-gray-600 transition-all"
              onClick={e => { e.stopPropagation(); handleHome(); }}
            >
              Home
            </button>
            <button
              className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full shadow hover:bg-red-400 transition-all"
              onClick={e => { e.stopPropagation(); handleLogout(); }}
            >
              Logout
            </button>
          </div>
        )}
        {/* Drawer for small screens only */}
        {isOpen && window.innerWidth < 640 && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed top-20 right-6 h-full w-72 min-h-[300px] max-h-[350px] z-50 shadow-2xl backdrop-blur-5xl border border-gray-100/30 rounded-2xl transition-all bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="flex flex-col items-center py-8 px-6">
                {user.profileImageUrl || user.photoURL ? (
                  <img
                    src={user.profileImageUrl || user.photoURL}
                    alt={user.name}
                    className="w-16 h-16 bg-gray-900 rounded-full object-cover mb-4"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div className="text-lg text-white font-bold mb-1">
                  {user.name || ""}
                </div>
                <div className="text-grey-500 text-sm mb-6">
                  {user.email || ""}
                </div>
                <button
                  className="w-full text-left px-5 py-2 text-sm text-gray-200 cursor-pointer transition rounded-xl bg-gray-800 hover:bg-gray-700 mb-2"
                  onClick={e => { e.stopPropagation(); handleHome(); setIsOpen(false); }}
                >
                  Home
                </button>
                <button
                  className="w-full text-left px-5 py-2 text-sm text-red-400 cursor-pointer transition rounded-xl bg-gray-800 hover:bg-gray-700"
                  onClick={e => { e.stopPropagation(); handleLogout(); setIsOpen(false); }}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
};

export default ProfileInfoCard;
