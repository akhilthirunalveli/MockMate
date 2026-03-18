import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Copy01Icon, Tick01Icon, Refresh03Icon, Home01Icon } from 'hugeicons-react';
import Navbar from "../../Navbar/Navbar.jsx";
import io from 'socket.io-client';

import FloatingVideo from './FloatingVideo.jsx';
import CodingWorkspace from './CodingWorkspace.jsx';

const generateRoomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const CodingInterview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomFromQuery = searchParams.get('room') ?? '';

  const [roomInput, setRoomInput] = useState(roomFromQuery);
  const [copied, setCopied] = useState(false);

  // Socket state
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setRoomInput(roomFromQuery);
  }, [roomFromQuery]);

  // Socket connection
  useEffect(() => {
    if (roomFromQuery) {
      const socketUrl = import.meta.env.VITE_API_URL || "http://192.168.29.90:8000";

      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.emit("join_room", roomFromQuery);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomFromQuery]);

  const activeLink = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const slug = roomFromQuery || roomInput;
    return slug ? `${origin}/interview/coding?room=${slug}` : '';
  }, [roomFromQuery, roomInput]);

  const handleGenerateRoom = () => {
    setRoomInput(generateRoomCode());
  };

  const handleStartCall = () => {
    if (!roomInput.trim()) return;
    const sanitized = roomInput.trim().toUpperCase();
    navigate(`/interview/coding?room=${sanitized}`);
  };

  const handleCopyLink = async () => {
    if (!activeLink) return;
    try {
      await navigator.clipboard.writeText(activeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  if (!roomFromQuery) {
    return (
      <div
        className="min-h-screen w-full text-white flex flex-col"
        style={{
          backgroundImage: "radial-gradient(#dadadac7 0.5px, #000000 0.5px)",
          backgroundSize: "21px 21px",
          backgroundColor: "#030202",
        }}
      >
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black rounded-2xl p-8 shadow-2xl ">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Live Coding Session
            </h1>
            <p className="text-white/75 text-center text-sm mb-8">
              Collaborate on code with synchronized real-time editors and WebRTC video.
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888] mb-2 block">
                  New Session
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white/50 truncate">
                    {roomInput || "Click on generate button"}
                  </div>
                  <button
                    onClick={handleGenerateRoom}
                    className="p-3 bg-black text-white/50 hover:text-white rounded-lg transition-colors border border-white/10 cursor-pointer"
                    title="Generate New Code"
                  >
                    <Refresh03Icon size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888] mb-2 block">
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white/50 truncate">
                    {activeLink || "Link will appear here"}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    disabled={!activeLink}
                    className="p-3 bg-black text-white/50 hover:text-white rounded-lg transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Copy Link"
                  >
                    {copied ? <Tick01Icon size={20} className="text-emerald-500" /> : <Copy01Icon size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartCall}
                disabled={!roomInput}
                className="w-full py-3.5 bg-white/80 text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
              >
                Join Coding Environment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full text-white flex flex-col overflow-hidden relative"
      style={{
        backgroundColor: '#000000ff',
        backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-26 px-8 pb-6 gap-6 h-full overflow-hidden z-10 w-full max-w-[1920px] mx-auto">
        {/* Header Bar */}
        <div className="h-16 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center px-4 py-2 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">Session</span>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <span className="font-mono text-sm tracking-[0.15em] font-semibold text-[#E0E0E0]">{roomFromQuery}</span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center w-6 h-6 bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all duration-200 rounded-full cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  title="Copy Link"
                >
                  {copied ? <Tick01Icon size={12} className="text-emerald-500" /> : <Copy01Icon size={12} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/interview/coding')}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/90 text-white border border-red-500 rounded-full transition-all duration-300 font-semibold hover:bg-red-600 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-red-900/20"
            >
              <Home01Icon size={18} />
              <span>Exit Session</span>
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex gap-4 min-h-0 relative">

          {/* Coding Area (Left) */}
          <div className="flex-[3] relative transition-all duration-300 ease-in-out min-w-0 flex flex-col rounded-2xl">
            <CodingWorkspace socket={socket} room={roomFromQuery} />
          </div>

          {/* Video Sidebar (Right - Half/Half stacked) */}
          <div className="flex-1 min-w-[320px] max-w-[400px]">
            <FloatingVideo roomId={roomFromQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingInterview;
