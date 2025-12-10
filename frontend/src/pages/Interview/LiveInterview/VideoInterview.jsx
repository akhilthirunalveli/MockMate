import React, { useRef, useEffect } from 'react';
import { LuMic, LuMicOff, LuVideo, LuVideoOff, LuScreenShare, LuScreenShareOff, LuPhoneOff } from "react-icons/lu";
import useWebRTC from '../../../hooks/useWebRTC.js';

export default function VideoInterview({ roomId }) {
  const {
    localStream,
    remoteStream,
    remoteConnected,
    isAudio,
    isVideo,
    isScreenShare,
    connecting,
    error,
    toggleAudio,
    toggleVideo,
    shareScreen,
    stopScreenShare,
    endCall
  } = useWebRTC(roomId);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  return (
    <div className="flex flex-col h-full w-full bg-black border-2 border-white rounded-2xl p-0 relative overflow-hidden">
      {/* Status Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
        {error && (
          <div className="bg-red-500/90 text-white px-6 py-2 rounded-full backdrop-blur border border-red-400 text-sm font-medium shadow-lg">
            {error.name === 'NotReadableError' ? 'Camera in use' : error.message}
          </div>
        )}

        {!remoteConnected && !error && (
          <div className="bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur border border-white/20 text-sm font-medium shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            {connecting ? 'Establishing connection...' : `Waiting for guest in room ${roomId}`}
          </div>
        )}

        {remoteConnected && (
          <div className="bg-emerald-500/80 text-white px-4 py-1 rounded-full backdrop-blur border border-emerald-400/50 text-xs font-medium shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            Connected
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
        {/* Local Video */}
        <div className="relative w-full h-full border-r border-white/20">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-xs text-white">You</div>
        </div>

        {/* Remote Video */}
        <div className="relative w-full h-full">
          {remoteStream ? (
            <>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-lg text-xs text-white">Guest</div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-black text-white/50 text-lg flex-col gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <p>{connecting ? 'Connecting...' : 'Waiting for peer...'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Dock */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 shadow-2xl z-50"
      >
        <button
          onClick={toggleAudio}
          className={` cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-105 ${isAudio ? 'border-white/50 bg-white/10 text-white hover:bg-white/20' : 'border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
          title="Toggle Mic"
        >
          {isAudio ? <LuMic size={20} /> : <LuMicOff size={20} />}
        </button>
        <button
          onClick={toggleVideo}
          className={` cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-105 ${isVideo ? 'border-white/50 bg-white/10 text-white hover:bg-white/20' : 'border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
          title="Toggle Video"
        >
          {isVideo ? <LuVideo size={20} /> : <LuVideoOff size={20} />}
        </button>
        <button
          onClick={isScreenShare ? stopScreenShare : shareScreen}
          className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-105 ${isScreenShare ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500' : 'border-white/50 bg-white/10 text-white hover:bg-white/20'}`}
          title="Share Screen"
        >
          {isScreenShare ? <LuScreenShareOff size={20} /> : <LuScreenShare size={20} />}
        </button>
        <button
          onClick={endCall}
          className=" cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-500 bg-red-500 text-white transition-all duration-200 hover:bg-red-600 hover:scale-105 hover:border-red-600"
          title="End Call"
        >
          <LuPhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
