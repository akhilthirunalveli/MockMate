import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Copy01Icon, Tick01Icon, Refresh03Icon, SentIcon, Comment01Icon, Home01Icon } from 'hugeicons-react';
import VideoInterview from './VideoInterview.jsx';
import Navbar from "../../Navbar/Navbar.jsx";
import io from 'socket.io-client';

const generateRoomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const LiveInterview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomFromQuery = searchParams.get('room') ?? '';

  const [roomInput, setRoomInput] = useState(roomFromQuery);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(true); // Default to true for better layout
  const chatEndRef = useRef(null);

  useEffect(() => {
    setRoomInput(roomFromQuery);
  }, [roomFromQuery]);

  // Socket connection
  useEffect(() => {
    if (roomFromQuery) {
      // Connect to the backend
      // Adjust URL based on your environment (localhost vs production)
      const socketUrl = import.meta.env.VITE_API_URL || "http://192.168.29.90:8000";

      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.emit("join_room", roomFromQuery);

      newSocket.on("receive_message", (data) => {
        setChatHistory((prev) => [...prev, data]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomFromQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, showChat]);

  const sendMessage = async () => {
    if (message.trim() !== "" && socket) {
      const messageData = {
        room: roomFromQuery,
        author: socket.id, // Use socket.id to identify the sender
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setChatHistory((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  const activeLink = useMemo(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const slug = roomFromQuery || roomInput;
    return slug ? `${origin}/interview/live?room=${slug}` : '';
  }, [roomFromQuery, roomInput]);

  const handleGenerateRoom = () => {
    setRoomInput(generateRoomCode());
  };

  const handleStartCall = () => {
    if (!roomInput.trim()) return;
    const sanitized = roomInput.trim().toUpperCase();
    navigate(`/interview/live?room=${sanitized}`);
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
          <div className="w-full max-w-md bg-black rounded-2xl p-8 shadow-2xl">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Live Interview
            </h1>
            <p className="text-white/50 text-center text-sm mb-8">
              Secure, high-quality video & code collaboration.
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                  New Meeting
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 truncate">
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
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 truncate">
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
                Join Room
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
        backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-26 px-8 pb-6 gap-6 h-full overflow-hidden z-10">

        {/* Header Bar */}
        <div className="h-16 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-black border border-[#222] rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-gray-200">Interview Code</span>
              </div>
              <div className="h-5 w-px bg-[#333]"></div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-base tracking-widest text-white">{roomFromQuery}</span>
                <button
                  onClick={handleCopyLink}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 hover:bg-[#222] rounded"
                  title="Copy Link"
                >
                  {copied ? <Tick01Icon size={16} className="text-emerald-500" /> : <Copy01Icon size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-xl transition-all border cursor-pointer shadow-lg ${showChat
                ? 'bg-black text-white border-[#333]'
                : 'bg-black text-gray-400 hover:text-white border-[#222] hover:border-[#333]'
                }`}
              title={showChat ? "Hide Chat" : "Show Chat"}
            >
              <Comment01Icon size={20} />
            </button>
            <button
              onClick={() => navigate('/interview/live')}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white border border-red-500 rounded-full transition-all duration-300 font-semibold hover:bg-red-700 hover:border-red-600 active:scale-95 cursor-pointer"
            >
              <Home01Icon size={18} />
              <span>Exit Interview</span>
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex gap-2 min-h-0">
          {/* Recent Video Area */}
          <div className={`transition-all duration-300 ease-in-out min-w-0 ${showChat ? 'flex-[3]' : 'flex-1'}`}>
            <VideoInterview roomId={roomFromQuery} />
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="flex-1 max-w-[360px] bg-black border border-[#222] rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300">
              <div className="p-4 border-b border-[#222] flex justify-between items-center bg-black/90">
                <h3 className="font-medium text-sm text-white flex items-center gap-2">
                  Messages
                </h3>
                <span className="text-[10px] bg-[#222] text-white/50 px-2 py-0.5 rounded border border-[#333]">
                  {chatHistory.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0A0A0A]/50">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-white/50 space-y-2">
                    <Comment01Icon size={24} className="opacity-20" />
                    <p className="text-xs">No messages yet</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.author === socket?.id ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] px-3 py-2 rounded-lg text-sm ${msg.author === socket?.id
                        ? "bg-[#222] text-white border border-[#333]"
                        : "bg-black text-white/50 border border-[#222]"
                        }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-white/50 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-[#222] bg-[#0A0A0A]/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-2.5 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <SentIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
