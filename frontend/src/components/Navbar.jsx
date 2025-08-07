import React, { useContext, useState } from 'react'
import ProfileInfoCard from "./Cards/ProfileInfoCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Navbar = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-3 md:px-6 lg:px-9 pt-6 pb-4 sm:py-3 md:py-4 lg:py-6"
      style={{
        opacity: 1,
        backgroundImage: "radial-gradient(#ffffff 0.5px,rgba(0, 0, 0, 0) 0.5px)",
        backgroundSize: "21px 21px",
      }}>
      <div className="max-w-8xl mx-auto">
        <div className="bg-transparent text-white backdrop-blur-xl rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-lg shadow-black/[0.03] border border-gray-200/50">
          <div className="container mx-auto flex items-center h-14 sm:h-12 md:h-14 lg:h-16 px-5 sm:px-4 md:px-6 lg:px-8">
            <Link to="/dashboard" className="flex-shrink-0">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-medium text-white truncate"
                style={{ fontFamily: "'anta', cursive"}}>
                Mockmate
              </h2>
            </Link>
            <div className="flex-1"></div>
            
            {/* Menu items for small screens */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Profile card - visible on larger screens */}
              <div className="hidden sm:block">
                <ProfileInfoCard />
              </div>
              
              {/* Mobile menu - visible on small screens */}
              <div className="block sm:hidden flex items-center gap-2">
                {/* Show menu buttons when mobile menu is active */}
                {showMobileMenu && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/");
                        setShowMobileMenu(false);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-700 rounded-full shadow hover:bg-gray-600 transition-all"
                    >
                      Home
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-full shadow hover:bg-red-400 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
                
                {/* Profile image button */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center focus:outline-none"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-transparent hover:border-white/30 transition-all"
                    style={{ 
                      backgroundColor: user?.name ? 
                        ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'][
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar