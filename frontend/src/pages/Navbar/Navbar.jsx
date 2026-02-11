import React, { useContext, useState, useEffect } from 'react'
import ProfileInfoCard from "./ProfileInfoCard.jsx";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Mail01Icon, Delete02Icon, Cancel01Icon } from 'hugeicons-react';
import axiosInstance from "../../utils/axiosInstance.js";
import moment from "moment";
import { BASE_URL } from "../../constants/apiPaths";
import { Home01Icon, BookOpen01Icon, Logout01Icon } from 'hugeicons-react';



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

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      if (!user) return; // Don't fetch if no user
      const response = await axiosInstance.get('/api/notifications');
      console.log("[NAVBAR] Notifications fetched:", response.data);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark read");
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axiosInstance.delete('/api/notifications/clear-all');
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications", err);
      toast.error("Failed to clear notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchAndShowToasts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/toasts`);
      const toasts = await response.json();

      const activeToasts = Array.isArray(toasts)
        ? toasts.filter(t => t.isActive).sort((a, b) => a.order - b.order)
        : [];

      if (activeToasts.length === 0) return;

      activeToasts.forEach((t, index) => {
        setTimeout(() => {
          toast.custom(
            (toastObj) => (
              <div
                className={`max-w-sm bg-black text-white px-5 py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto transition-all duration-500 ease-in-out flex items-center gap-3 group`}
                style={{
                  animation: toastObj.visible ? 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'slideOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards',
                  background: 'linear-gradient(to right, #000, #000) padding-box, linear-gradient(to right, #6366f180, #f59e0b80) border-box opacity-50',
                  border: '1.5px solid transparent'
                }}
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 animate-pulse" />
                <p className="text-[12px] font-bold tracking-tight leading-tight">
                  {t.message}
                </p>
                <button
                  onClick={() => toast.dismiss(toastObj.id)}
                  className="ml-auto opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity cursor-pointer p-1"
                >
                  <Cancel01Icon size={14} />
                </button>
              </div>
            ),
            { position: 'bottom-left', duration: 6000 }
          );
        }, t.delay || (index * 1200));
      });
    } catch (error) {
      console.error("Failed to fetch toasts", error);
    }
  };

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
          <div className="bg-transparent text-white backdrop-blur-xl rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-lg shadow-black/[0.03] border border-gray-200/40">
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
                      fetchAndShowToasts();
                    }}
                  >
                    <span className="font-normal opacity-50">v1.4 </span>
                  </span>
                </h2>
              </Link>
              <div className="flex-1"></div>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                {/* Magic Pill Notification */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                  >
                    <Mail01Icon className="text-gray-300 hover:text-white transition-colors cursor-pointer" size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-black shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowNotifications(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -20, scaleY: 0.8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          style={{ originY: 0 }}
                          className="absolute top-14 left-[-15px] w-70 bg-[#000000] border border-white/10 rounded-lg overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02] gap-2">
                            <h3 className="text-white font-semibold text-sm">
                              Notifications
                            </h3>
                            {unreadCount > 0 && (
                              <span className="text-[10px] bg-red-900 text-white px-2 py-0.5 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                            {notifications.length > 0 && (
                              <button
                                onClick={clearAllNotifications}
                                className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer"
                                title="Clear all"
                              >
                                <Delete02Icon size={14} />
                              </button>
                            )}
                          </div>
                          <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-10 text-white/50">
                                <Mail01Icon className="mb-2 opacity-20" size={24} />
                                <p className="text-xs">No notifications</p>
                              </div>
                            ) : (
                              notifications.map(note => (
                                <div
                                  key={note._id}
                                  className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${!note.isRead ? 'bg-white/[0.02]' : ''}`}
                                  onClick={() => {
                                    markRead(note._id);
                                  }}
                                >
                                  <div className="flex justify-between items-start gap-3 mb-1">
                                    <h4 className={`text-sm leading-tight ${!note.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                                      {note.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-600 whitespace-nowrap pt-0.5 group-hover:text-gray-500 transition-colors">
                                      {moment(note.createdAt).fromNow(true)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-400 transition-colors">
                                    {note.message}
                                  </p>
                                  {!note.isRead && (
                                    <div className="mt-2 flex items-center gap-1.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                      <span className="text-[10px] text-blue-500 font-medium">Unread</span>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden sm:block">
                  <ProfileInfoCard />
                </div>
                <div className="block sm:hidden flex items-center gap-2">
                  {showMobileMenu && (
                    <>
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