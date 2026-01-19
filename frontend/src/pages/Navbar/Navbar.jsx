import React, { useContext, useState, useEffect } from 'react'
import ProfileInfoCard from "./ProfileInfoCard.jsx";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-3 md:px-6 lg:px-9 pt-6 pb-4 sm:py-3 md:py-4 lg:py-6"
        style={{
          opacity: 1,
        }}>
        <div className="max-w-8xl mx-auto">
          <div className="bg-transparent text-white backdrop-blur-xl rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-lg shadow-black/[0.03] border border-gray-200/50">
            <div className="container mx-auto flex items-center h-14 sm:h-12 md:h-14 lg:h-16 px-5 sm:px-4 md:px-6 lg:px-8">
              <Link to="/dashboard" className="flex-shrink-0">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-medium text-white truncate flex items-center gap-2"
                  style={{ fontFamily: "'anta', cursive" }}>
                  Mockmate
                  <span
                    className="text-xs sm:text-sm md:text-base -mt-3 sm:-mt-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      const toastStyle = {
                        fontFamily: "'poppins', sans-serif",
                        fontSize: '0.875rem',
                        fontWeight: 200
                      };

                      toast.custom(
                        (t) => (
                          <div
                            className={`max-w-md bg-black/90 backdrop-blur-sm text-white px-6 py-4 shadow-lg rounded-full pointer-events-auto transition-all duration-300 ease-in-out hover:bg-black/95`}
                            style={{
                              animation: t.visible ? 'slideIn 0.6s ease-out forwards' : 'slideOut 0.6s ease-in forwards'
                            }}
                          >
                            <p style={toastStyle}>
                              Glad that you wish to know what Mockmate is!!
                            </p>
                          </div>
                        ),
                        { position: 'bottom-left', duration: 5000 }
                      );

                      setTimeout(() => {
                        toast.custom(
                          (t) => (
                            <div
                              className={`max-w-md bg-black/90 backdrop-blur-sm text-white px-6 py-4 shadow-lg rounded-full pointer-events-auto transition-all duration-300 ease-in-out hover:bg-black/95`}
                              style={{
                                animation: t.visible ? 'slideIn 0.6s ease-out forwards' : 'slideOut 0.6s ease-in forwards'
                              }}
                            >
                              <p style={toastStyle}>
                                Hi, I am Akhil, the creator of Mockmate. I built this platform to help you ace your interviews with confidence.
                              </p>
                            </div>
                          ),
                          { position: 'bottom-left', duration: 5000 }
                        );
                      }, 500);

                      setTimeout(() => {
                        toast.custom(
                          (t) => (
                            <div
                              className={`max-w-md bg-black/90 backdrop-blur-sm text-white px-6 py-4 shadow-lg rounded-full pointer-events-auto transition-all duration-300 ease-in-out hover:bg-black/95`}
                              style={{
                                animation: t.visible ? 'slideIn 0.6s ease-out forwards' : 'slideOut 0.6s ease-in forwards'
                              }}
                            >
                              <p style={toastStyle}>
                                Current Version of Mockmate v1.3 is fully updated with new features. Now you can hope in your friends on a meet and try a interview mode.
                              </p>
                            </div>
                          ),
                          { position: 'bottom-left', duration: 5000 }
                        );
                      }, 1000);
                    }}
                  >
                    <span className="font-normal opacity-50">v1.3 </span>
                    <span className="font-bold bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-600 text-transparent bg-clip-text">New</span>
                  </span>
                </h2>
              </Link>
              <div className="flex-1"></div>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="hidden sm:block">
                  <ProfileInfoCard />
                </div>
                <div className="block sm:hidden flex items-center gap-2">
                  {showMobileMenu && (
                    <>
                      <button
                        onClick={() => {
                          navigate("/");
                          setShowMobileMenu(false);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-black bg-yellow-500 rounded-full shadow hover:bg-yellow-400 transition-all cursor-pointer"
                      >
                        Home
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 rounded-full shadow hover:bg-red-400 transition-all cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  )}

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
    </>
  );
};

export default Navbar;