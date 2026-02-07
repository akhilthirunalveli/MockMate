import React, { useRef, useEffect } from 'react';
import { Mic01Icon, MicOff01Icon, Camera01Icon, CameraOff01Icon, Share01Icon, StopCircleIcon, CallEnd02Icon } from 'hugeicons-react';
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

  const [layout, setLayout] = React.useState('grid'); // 'grid' | 'sidebar'

  useEffect(() => {
    if (isScreenShare) {
      setLayout('sidebar');
    } else {
      setLayout('grid');
    }
  }, [isScreenShare]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0A] rounded-2xl border border-[#222] relative overflow-hidden shadow-2xl group">

      {/* Status Bar (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
        {error && (
          <div className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-red-600">
            {error.name === 'NotReadableError' ? 'Camera in use' : error.message}
          </div>
        )}

        {!remoteConnected && !error && (
          <div className="bg-[#222] text-gray-200 px-4 py-1.5 rounded-lg border border-[#333] text-xs font-medium flex items-center gap-2 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            {connecting ? 'Connecting...' : `Waiting for guest...`}
          </div>
        )}
      </div>

      {/* Main Video Area */}
      <div className={`flex-1 h-full w-full p-4 ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex gap-4'}`}>

        {/* Local Stream (You/Screen) */}
        {/* In Sidebar mode, if sharing screen, this becomes main. If standard, it's part of grid */}
        <div className={`relative bg-[#111] rounded-lg overflow-hidden border border-[#222] shadow-inner
          ${layout === 'grid' ? 'w-full h-full' : isScreenShare ? 'flex-[3]' : 'w-64 h-48 order-2'}
        `}>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-[#000] text-white text-[10px] font-bold px-2 py-1 rounded border border-[#333]">
            {isScreenShare ? 'Your Screen' : 'You'}
          </div>
        </div>

        {/* Remote Stream (Guest) */}
        <div className={`relative bg-[#111] rounded-lg overflow-hidden border border-[#222] shadow-inner
           ${layout === 'grid' ? 'w-full h-full' : isScreenShare ? 'w-64 h-48 order-2' : 'flex-[3]'}
        `}>
          {remoteStream ? (
            <>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-3 right-3 bg-[#000] text-white text-[10px] font-bold px-2 py-1 rounded border border-[#333]">Guest</div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full flex-col gap-3 text-gray-500">
              <div className="w-10 h-10 rounded-full border-2 border-[#333] border-t-emerald-500 animate-spin" />
              <p className="text-xs font-medium tracking-wide uppercase">Waiting...</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar (Bottom Float) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-2 shadow-2xl z-50">
        <button
          onClick={toggleAudio}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${isAudio ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'}`}
          title="Toggle Mic"
        >
          {isAudio ? <Mic01Icon size={18} /> : <MicOff01Icon size={18} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${isVideo ? 'bg-[#262626] border-[#333] text-white hover:bg-[#333]' : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'}`}
          title="Toggle Camera"
        >
          {isVideo ? <Camera01Icon size={18} /> : <CameraOff01Icon size={18} />}
        </button>
        <button
          onClick={isScreenShare ? stopScreenShare : shareScreen}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${isScreenShare ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#262626] border-[#333] text-white hover:bg-[#333]'}`}
          title="Share Screen"
        >
          {isScreenShare ? <StopCircleIcon size={18} /> : <Share01Icon size={18} />}
        </button>
        <button
          onClick={() => setLayout(prev => prev === 'grid' ? 'sidebar' : 'grid')}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#262626] border border-[#333] text-white hover:bg-[#333] transition-colors cursor-pointer"
          title="Toggle Layout"
        >
          {layout === 'grid' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg> // Sidebar Icon substitute or View Icon
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg> // Grid Icon substitute
          )}
        </button>
        <div className="w-px h-6 bg-[#333] mx-1"></div>
        <button
          onClick={endCall}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors border border-red-500 cursor-pointer"
          title="End Call"
        >
          <CallEnd02Icon size={18} />
        </button>
      </div>
    </div>
  );
}
