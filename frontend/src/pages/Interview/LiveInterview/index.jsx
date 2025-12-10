import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LuCopy, LuCheck, LuRefreshCcw, LuSend, LuMessageSquare } from 'react-icons/lu';
import { MdHome } from "react-icons/md";
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
        className="min-h-screen w-full px-4 py-6 overflow-auto"
        style={{
          opacity: 1,
          backgroundImage: "radial-gradient(#e5e5e5 0.5px,#030202 0.5px)",
          backgroundSize: "21px 21px",
        }}
      >
        <Navbar />
        <div className="min-h-[90vh] flex items-center justify-center">
          <div className="w-full max-w-2xl bg-black/80 backdrop-blur-sm  rounded-2xl p-8 space-y-6 ">
            <h1 className="text-2xl font-semibold text-center text-white">
              Start a Live Interview
            </h1>
            <p className="text-gray-300 text-center">
              Generate a secure room code, share the link, and join the call with
              one click.
            </p>
            <div className="space-y-4">
              <label className="text-sm uppercase tracking-wide text-gray-400">
                Room Code
              </label>
              <div className="flex gap-3">
                <input
                  value={roomInput}
                  onChange={(e) =>
                    setRoomInput(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                  }
                  placeholder="Enter or generate a code"
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-lg tracking-widest font-mono text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <button
                  onClick={handleGenerateRoom}
                  className="px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition cursor-pointer"
                >
                  <LuRefreshCcw className="inline-block mr-1" />
                  New
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Shareable Link
              </p>
              <div className="flex gap-3">
                <input
                  value={activeLink}
                  readOnly
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-gray-200"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/10 cursor-pointer"
                  disabled={!activeLink}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <LuCheck /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LuCopy /> Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleStartCall}
              disabled={!roomInput}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-500 disabled:opacity-40 transition shadow-lg shadow-emerald-900/20 cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full px-4 py-6 overflow-auto"
      style={{
        opacity: 1,
        backgroundImage: "radial-gradient(#e5e5e5 0.5px,#030202 0.5px)",
        backgroundSize: "21px 21px",
      }}
    >
      <Navbar />

      <div className="max-w-[90rem] mt-24 mx-auto flex flex-col gap-6 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-black/80 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 flex items-center gap-4">
              <span className="text-gray-400 text-sm uppercase tracking-wide">Room ID</span>
              <span className="text-xl font-semibold tracking-widest font-mono text-white">{roomFromQuery}</span>
              <button
                onClick={handleCopyLink}
                className="ml-2 p-2 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white"
                title="Copy Link"
              >
                {copied ? <LuCheck /> : <LuCopy />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 font-semibold flex items-center gap-2 ${showChat
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-black/80 border-white/30 text-white hover:bg-white/10'
                }`}
            >
              <LuMessageSquare /> {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>
            <button
              onClick={() => navigate('/interview/live')}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white border border-red-500 rounded-full transition-all duration-300 font-semibold hover:bg-red-700 hover:border-red-600 active:scale-95 cursor-pointer"
            >
              <MdHome size={20} />
              Exit
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Video Section */}
          <div className={`flex-1 transition-all duration-300 ${showChat ? 'w-full md:w-2/3' : 'w-full'}`}>
            <VideoInterview roomId={roomFromQuery} />
          </div>

          {/* Chat Section */}
          {showChat && (
            <div className="w-full md:w-1/3 bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl flex flex-col overflow-hidden transition-all duration-300 shadow-xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <LuMessageSquare className="text-emerald-400" /> Live Chat
                </h3>
                <span className="text-xs text-gray-400 px-2 py-1 rounded bg-white/5 border border-white/10">
                  {chatHistory.length} messages
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <LuMessageSquare size={32} className="opacity-20" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.author === socket?.id ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.author === socket?.id
                        ? "bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-900/20"
                        : "bg-white/10 text-gray-200 rounded-bl-none border border-white/10"
                        }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent placeholder:text-gray-600"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-xl transition text-white shadow-lg shadow-emerald-900/20"
                  >
                    <LuSend size={18} />
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
