import React, { useContext, useState } from "react";
import { Home01Icon, BookOpen01Icon, Logout01Icon } from 'hugeicons-react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    navigate("/dashboard"); // Change this path if your home route is different
  };

  return (
    user && (
      <div
        className="relative"
        ref={cardRef}
        onMouseEnter={handleShowButtons}
        onMouseLeave={handleHideButtons}
        onClick={handleCardClick}
        style={{ minWidth: 120 }}
      >
        {/* Profile Info (hidden when buttons are visible on large screens) */}
        {!(isButtonsVisible && window.innerWidth >= 640) && !isOpen && (
          <div className="flex items-center cursor-pointer transition-all duration-200">
            {(user.profileImageUrl || user.photoURL) && !imageError ? (
              <img
                src={user.profileImageUrl || user.photoURL}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundColor: user?.name ?
                    ['#EF4444', '#F97316', '#F59E0B', '#EC4899'][
                    Math.abs(user.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 10
                    ] : '#6B7280'
                }}
              >
                {user?.name ?
                  (() => {
                    const words = user.name.trim().split(' ').filter(word => word.length > 0);
                    if (words.length === 0) return 'U';
                    if (words.length === 1) return words[0][0].toUpperCase();
                    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                  })() : 'U'
                }
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
              className="p-2 text-black bg-gray-100 cursor-pointer rounded-full shadow hover:bg-gray-200 hover:text-black transition-all flex items-center justify-center"
              onClick={e => { e.stopPropagation(); handleHome(); }}
              title="Home"
            >
              <Home01Icon size={18} />
            </button>
            <button
              className="p-2 bg-amber-600 cursor-pointer rounded-full shadow hover:bg-amber-500 text-white transition-all flex items-center justify-center"
              onClick={e => { e.stopPropagation(); navigate("/docs"); }}
              title="Docs"
            >
              <BookOpen01Icon size={18} />
            </button>

            <button
              className="p-2 text-white bg-red-700 cursor-pointer rounded-full shadow hover:bg-red-500 transition-all flex items-center justify-center"
              onClick={e => { e.stopPropagation(); handleLogout(); }}
              title="Logout"
            >
              <Logout01Icon size={18} />
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default ProfileInfoCard;
