import React, { useRef, useEffect } from 'react';
import { Mic01Icon, MicOff01Icon, Camera01Icon, CameraOff01Icon, CallEnd02Icon } from 'hugeicons-react';
import { motion } from 'framer-motion';
import useWebRTC from '../../../hooks/useWebRTC.js';

export default function VideoInterview({ roomId }) {
  const {
    localStream,
    remoteStream,
    remoteConnected,
    isAudio,
    isVideo,
    connecting,
    error,
    toggleAudio,
    toggleVideo,
    endCall
  } = useWebRTC(roomId);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const containerRef = useRef();

  const [isSplitScreen, setIsSplitScreen] = React.useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream, isSplitScreen]);

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-2xl border border-[#222] relative overflow-hidden shadow-2xl group">

      {/* Status Bar (Top Center) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
        {error && (
          <div className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-red-600">
            {error.name === 'NotReadableError' ? 'Camera in use' : error.message}
          </div>
        )}

        {!remoteConnected && !error && (
          <div className="bg-[#222] text-gray-200 px-4 py-1.5 rounded-lg border border-[#333] text-xs font-medium flex items-center gap-2 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            {connecting ? 'Connecting' : `Waiting for guest`}
          </div>
        )}
      </div>

      {/* Main Video Area */}
      <div ref={containerRef} className={`flex-1 w-full h-full relative p-4 ${isSplitScreen ? 'flex flex-col md:flex-row gap-4' : ''}`}>

        {/* Remote Stream (Guest) - Background/Split Right */}
        <div className={
          isSplitScreen
            ? "flex-1 bg-[#111] rounded-lg overflow-hidden border border-[#222] shadow-inner relative"
            : "absolute inset-4 z-10 bg-[#111] rounded-lg overflow-hidden border border-[#222] shadow-inner"
        }>
          {remoteStream ? (
            <>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">Guest</div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full flex-col gap-3 text-gray-500">
              <div className="w-10 h-10 rounded-full border-2 border-[#333] border-t-white animate-spin" />
              <p className="text-xs font-medium tracking-wide uppercase text-white">Waiting</p>
            </div>
          )}
        </div>

        {/* Local Stream (You/Screen) - Floating/Split Left */}
        <motion.div
          drag={!isSplitScreen}
          dragConstraints={containerRef}
          dragMomentum={false}
          className={
            isSplitScreen
              ? "flex-1 bg-[#111] rounded-lg overflow-hidden border border-[#222] shadow-inner relative z-10"
              : "absolute z-20 resize overflow-hidden bg-[#111] rounded-xl border border-white/20 shadow-[-8px_8px_30px_rgba(0,0,0,0.6)] group box-border pointer-events-auto"
          }
          initial={isSplitScreen ? {} : { x: typeof window !== 'undefined' ? window.innerWidth - 340 : 0, y: 16 }} // Starts at top right relative to container only if floating
          style={
            isSplitScreen
              ? { x: 0, y: 0, width: 'auto', height: 'auto', minWidth: 'auto', minHeight: 'auto', maxWidth: 'none', maxHeight: 'none' }
              : { width: '280px', height: '210px', minWidth: '150px', minHeight: '110px', maxWidth: '100%', maxHeight: '100%' }
          }
        >
          {/* Invisible drag handle covering the drag area mostly - only when floating */}
          {!isSplitScreen && <div className="absolute inset-0 z-30 opacity-0 cursor-grab active:cursor-grabbing hover:bg-black/5 transition-colors" />}

          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover relative z-10" />

          <div className="absolute bottom-2 left-2 z-40 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 shadow pointer-events-none">
            You
          </div>

          {/* Resize handle visual indicator in the bottom-right corner - only when floating */}
          {!isSplitScreen && <div className="absolute bottom-0 right-0 z-40 w-5 h-5 bg-gradient-to-tl from-white/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />}
        </motion.div>
      </div>

      {/* Control Bar (Bottom Float) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1A1A1A] border border-[#333] rounded-full px-3 py-2 shadow-2xl z-50">
        <button
          onClick={toggleAudio}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer border ${isAudio ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-red-500 border-red-500/50 text-white hover:bg-red-500'}`}
          title="Toggle Mic"
        >
          {isAudio ? <Mic01Icon size={18} /> : <MicOff01Icon size={18} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer border ${isVideo ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-amber-500 border-amber-500/50 text-white hover:bg-amber-500'}`}
          title="Toggle Camera"
        >
          {isVideo ? <Camera01Icon size={18} /> : <CameraOff01Icon size={18} />}
        </button>

        {/* Layout Toggle Button */}
        <button
          onClick={() => setIsSplitScreen(prev => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#262626] border border-[#333] text-white hover:bg-[#333] transition-colors cursor-pointer"
          title="Toggle Layout"
        >
          {isSplitScreen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8ZM15 6V18" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        <div className="w-px h-6 bg-[#333] mx-1"></div>
        <button
          onClick={endCall}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors border border-red-600 cursor-pointer"
          title="End Call"
        >
          <CallEnd02Icon size={18} />
        </button>
      </div>
    </div>
  );
}
