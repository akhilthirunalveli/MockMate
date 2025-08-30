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
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-2xl">
          <div className="text-white text-center">
            <MdVideocamOff size={48} className="mx-auto mb-2" />
            <p>Camera is off</p>
          </div>
        </div>
      )}
      
      {/* Control Dock */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black border border-white rounded-full px-8 py-3 shadow"
        style={{ minWidth: "320px" }}
      >
        {/* MIC Button */}
        <button
          onClick={handleMicToggle}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
            micOn
              ? "border-white bg-black text-white"
              : "border-white bg-white text-black"
          } transition`}
          title={micOn ? "Turn mic off" : "Turn mic on"}
        >
          {micOn ? (
            <MdMic size={24} />
          ) : (
            <MdMicOff size={24} />
          )}
        </button>
        
        {/* Camera Button */}
        <button
          onClick={handleCameraToggle}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
            cameraOn
              ? "border-white bg-black text-white"
              : "border-white bg-white text-black"
          } transition`}
          title={cameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {cameraOn ? (
            <MdVideocam size={24} />
          ) : (
            <MdVideocamOff size={24} />
          )}
        </button>
        
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
            isRecording
              ? "border-red-500 bg-red-500 text-white animate-pulse"
              : "border-white bg-white text-black"
          } transition`}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <div className={`w-4 h-4 ${isRecording ? 'bg-white' : 'bg-red-500'} ${isRecording ? 'rounded-sm' : 'rounded-full'}`} />
        </button>
        
        {/* Mirror Button */}
        <button
          onClick={() => setMirrored(prev => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-black text-white transition"
          title="Flip Left/Right"
        >
          <MdFlipCameraAndroid size={24} />
        </button>
      </div>
      
      <span className="absolute left-6 bottom-4 text-white mb-2">
        Video {isRecording && <span className="text-red-400">● REC</span>}
      </span>
    </div>
  );
};

export default VideoPlayer;
