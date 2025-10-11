import React from 'react';
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdFlipCameraAndroid } from "react-icons/md";

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
    <div className="flex-1 bg-black border-2 border-white rounded-2xl p-0 relative flex flex-col min-h-[350px] justify-between overflow-hidden">
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
            <MdVideocamOff size={48} className="mx-auto mb-2" />
            <p>Camera is off</p>
          </div>
        </div>
      )}

      {/* Control Dock */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 "
        style={{
          minWidth: "3px",
          boxShadow: "0 8px 32px -4px rgba(0,0,0,0.5)"
        }}
      >
        {/* MIC Button */}
        <button
          onClick={handleMicToggle}
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${micOn
              ? "border-white/50 bg-white/10 text-white hover:bg-white/20"
              : "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            } cursor-pointer transition-all duration-200 hover:scale-105 hover:border-opacity-75`}
          title={micOn ? "Turn mic off" : "Turn mic on"}
        >
          {micOn ? (
            <MdMic size={26} />
          ) : (
            <MdMicOff size={26} />
          )}
        </button>

        {/* Camera Button */}
        <button
          onClick={handleCameraToggle}
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${cameraOn
              ? "border-white/50 bg-white/10 text-white hover:bg-white/20"
              : "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            } cursor-pointer transition-all duration-200 hover:scale-105 hover:border-opacity-75`}
          title={cameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {cameraOn ? (
            <MdVideocam size={26} />
          ) : (
            <MdVideocamOff size={26} />
          )}
        </button>

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${isRecording
              ? "border-red-500 bg-red-500 text-white animate-pulse hover:bg-red-600"
              : "border-red-500 bg-white/10 text-red-500 hover:bg-white/20"
            } cursor-pointer transition-all duration-200 hover:scale-105 transform-gpu`}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <div className={`${isRecording
              ? 'w-5 h-5 bg-white rounded-sm'
              : 'w-5 h-5 bg-red-500 rounded-full'
            } transition-all duration-200`} />
        </button>

        {/* Mirror Button */}
        <button
          onClick={() => setMirrored(prev => !prev)}
          className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded-full border-2 
            border-white/50 bg-white/10 text-white hover:bg-white/20
            transition-all duration-200 hover:scale-105 hover:border-opacity-75
            ${mirrored ? 'bg-white/20' : ''}`}
          title="Flip Camera View"
        >
          <MdFlipCameraAndroid size={26} />
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
