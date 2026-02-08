import React from 'react';
import { Mic01Icon, MicOff01Icon, Camera01Icon, CameraOff01Icon, ImageFlipHorizontalIcon } from 'hugeicons-react';

const VideoPlayer = ({
  videoRef,
  cameraOn,
  mirrored,
  setMirrored,
  micOn,
  handleMicToggle,
  handleCameraToggle,
  isRecording,
  startRecording,
  stopRecording
}) => {
  return (
    <div className="flex-1 bg-black border border-white/30 rounded-xl p-0 relative flex flex-col min-h-[350px] justify-between overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-2xl"
        style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
      />

      {/* Camera Off Placeholder */}
      {!cameraOn && (
        <div className="absolute inset-0 bg-black flex items-center justify-center rounded-2xl">
          <div className="text-white text-center ">
            <CameraOff01Icon size={48} className="mx-auto mb-2" />
            <p>Camera is off</p>
          </div>
        </div>
      )}

      {/* Control Dock */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-3"
        style={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
        }}
      >
        {/* MIC Button */}
        <button
          onClick={handleMicToggle}
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${micOn
            ? "border-white/30 text-white hover:bg-white/10"
            : "border-red-500/50 text-red-500"
            } cursor-pointer transition-all duration-200 hover:scale-105`}
          title={micOn ? "Turn mic off" : "Turn mic on"}
        >
          {micOn ? (
            <Mic01Icon size={20} />
          ) : (
            <MicOff01Icon size={20} />
          )}
        </button>

        {/* Camera Button */}
        <button
          onClick={handleCameraToggle}
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${cameraOn
            ? "border-white/30 text-white hover:bg-white/10"
            : "border-amber-500/50 text-amber-500"
            } cursor-pointer transition-all duration-200 hover:scale-105`}
          title={cameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {cameraOn ? (
            <Camera01Icon size={20} />
          ) : (
            <CameraOff01Icon size={20} />
          )}
        </button>

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-10 h-10 flex items-center justify-center rounded-full border ${isRecording
            ? "border-red-500 bg-red-500 text-white animate-pulse"
            : "border-red-500/80 text-red-500"
            } cursor-pointer transition-all duration-200 hover:scale-105`}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <div className={`${isRecording
            ? 'w-4 h-4 bg-white rounded-sm'
            : 'w-4 h-4 bg-red-500 rounded-full'
            } transition-all duration-200`} />
        </button>

        {/* Mirror Button */}
        <button
          onClick={() => setMirrored(prev => !prev)}
          className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full border 
            border-white/30  text-white
            transition-all duration-200 hover:scale-105
            ${mirrored ? 'bg-white/10' : ''}`}
          title="Flip Camera View"
        >
          <ImageFlipHorizontalIcon size={20} />
        </button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full" />
          REC
        </div>
      )}

      <span className="absolute left-6 bottom-4 text-white mb-2">
        Video {isRecording && <span className="text-red-400">● REC</span>}
      </span>
    </div>
  );
};

export default VideoPlayer;
