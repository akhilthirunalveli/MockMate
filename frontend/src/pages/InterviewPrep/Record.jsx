import React, { useRef, useEffect } from "react";

const Record = () => {
  const videoRef = useRef(null);
  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
  return (
    <div
      className="flex flex-col items-start justify-center min-h-[60vh] min-h-screen w-screen min-w-0"
      style={{
        opacity: 1,
        backgroundImage: "radial-gradient(#FFFFFF 0.5px,#080708 0.5px)",
        backgroundSize: "21px 21px",
      }}>
      <h2 className="text-xl font-semibold mb-4">Camera Preview</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded shadow-lg w-full max-w-md border border-gray-300"
      />
    </div>
  );
};
export default Record;