import React, { useRef, useEffect, useState } from "react";
import Navbar from "../../components/layouts/Navbar";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdFlipCameraAndroid, MdHome } from "react-icons/md";

const Record = () => {
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [mirrored, setMirrored] = useState(true);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    getCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Prevent scrolling on this page
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Toggle mic/camera by enabling/disabling tracks
  const handleMicToggle = () => {
    setMicOn((prev) => {
      const enabled = !prev;
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getAudioTracks().forEach((track) => (track.enabled = enabled));
      }
      return enabled;
    });
  };

  const handleCameraToggle = () => {
    setCameraOn((prev) => {
      const enabled = !prev;
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getVideoTracks().forEach((track) => (track.enabled = enabled));
      }
      return enabled;
    });
  };

  const handleMirrorToggle = () => setMirrored((prev) => !prev);

  return (
    <>
      {/* Under Development Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          backdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .dev-creative {
            animation: bounce 1.5s infinite;
            color: #fff;
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 2px;
            text-shadow: 0 2px 16px #000;
            background: rgba(0,0,0,0.5);
            padding: 2rem 3rem;
            border-radius: 2rem;
            border: 1px solid #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .dev-creative span {
            font-size: 0.8rem;
            font-weight: 400;
            margin-top: 1rem;
            color: #ffd700;
            text-shadow: 0 1px 8px #000;
          }
        `}</style>
        <div className="dev-creative" style={{ position: 'relative' }}>
          {/* Home Button */}
          <button
            onClick={() => window.history.back()}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s',
            }}
            title="Go Back"
          >
            <MdHome size={18} color="#222" />
          </button>
          🚧 This Feature is Brewing!
          <span>Record Feature will be there soon!</span>
        </div>
      </div>
      {/* Main Content */}
      <div
        className="min-h-screen w-screen px-4 py-6"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 0.5px,#080708 0.5px)",
          backgroundSize: "21px 21px",
        }}
      >
        <Navbar />
        <div className="max-w-[90rem] mt-22 mx-auto flex flex-col gap-6">
          {/* Main Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video Box */}
            <div className="flex-1 bg-black border-2 border-white rounded-2xl p-0 relative flex flex-col min-h-[350px] justify-between overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-2xl"
                style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
              />
              {/* Dock */}
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black border border-white rounded-full px-8 py-3 shadow"
                style={{ minWidth: "260px" }}
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
                {/* Mirror Button */}
                <button
                  onClick={handleMirrorToggle}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-black text-white transition"
                  title="Flip Left/Right"
                >
                  <MdFlipCameraAndroid size={24} />
                </button>
              </div>
              <span className="absolute left-6 bottom-4 text-white mb-2">
                Video
              </span>
            </div>
            {/* Right Side: Question + Transcript */}
            <div className="flex flex-col flex-[0.9] gap-6">
              {/* Question Box */}
              <div className="bg-black border-2 border-white rounded-full p-6 flex flex-col justify-center min-h-[48px]">
                <span className="text-white">Question</span>
              </div>
              {/* Transcript Box */}
              <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[280px] flex flex-col">
                <span className="text-white">Transcript</span>
              </div>
            </div>
          </div>
          {/* Result Box */}
          <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[360px]">
            <span className="text-white">Result</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Record;
