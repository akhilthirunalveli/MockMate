import React, { useRef, useEffect } from 'react';
import { Mic01Icon, MicOff01Icon, Camera01Icon, CameraOff01Icon, CallEnd02Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import useWebRTC from '../../../hooks/useWebRTC.js';

export default function FloatingVideo({ roomId }) {
  const navigate = useNavigate();
  const {
    localStream,
    remoteStream,
    isAudio,
    isVideo,
    toggleAudio,
    toggleVideo,
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
    <div className="flex flex-col h-full w-full gap-4 relative">
      {/* Remote Stream (Top Half) */}
      <div className="flex-1 bg-[#030202] rounded-2xl border border-white/10 shadow-xl overflow-hidden relative flex items-center justify-center">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full flex-col gap-6 text-gray-500 bg-black/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full border-2 border-[#333] border-t-white animate-spin" />
            <p className="text-[10px] font-medium tracking-wide uppercase text-white">Waiting for guest</p>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
          Guest
        </div>
      </div>

      {/* Local Stream (Bottom Half) */}
      <div className="flex-1 bg-[#030202] rounded-2xl border border-white/10 shadow-xl overflow-hidden relative flex items-center justify-center">
        {isVideo ? (
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-black/50 backdrop-blur-sm">
            <div className="w-14 h-14 flex items-center justify-center mb-3">
              <CameraOff01Icon size={48} className="text-white" />
            </div>
            <p className="text-[10px] font-medium tracking-wide uppercase text-white">Camera Off</p>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
          You
        </div>
      </div>

      {/* Control Bar (Micro Centered) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#030202]/90 backdrop-blur-md rounded-full px-2.5 py-1.5 z-50">
        <button
          onClick={toggleAudio}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer border ${isAudio ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-red-500 border-red-500/50 text-white hover:bg-red-600'}`}
          title="Toggle Mic"
        >
          {isAudio ? <Mic01Icon size={14} /> : <MicOff01Icon size={14} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer border ${isVideo ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-amber-500 border-amber-500/50 text-white hover:bg-amber-600'}`}
          title="Toggle Camera"
        >
          {isVideo ? <Camera01Icon size={14} /> : <CameraOff01Icon size={14} />}
        </button>

        <div className="w-px h-4 bg-[#444] mx-0.5"></div>
        <button
          onClick={() => {
            endCall();
            navigate('/interview/coding');
          }}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-[background,transform] hover:scale-105 active:scale-95 border border-red-500 cursor-pointer shadow-lg shadow-red-900/30"
          title="End Call"
        >
          <CallEnd02Icon size={14} />
        </button>
      </div>
    </div>
  );
}
