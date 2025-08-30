import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Navbar from "../../Navbar/Navbar.jsx";
import { useMediaStream } from "../hooks/useMediaStream.js";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { useMediaRecorder } from "../hooks/useMediaRecorder.js";
import { useTranscriptAnalysis } from "../hooks/useTranscriptAnalysis.js";
import VideoPlayer from "../Components/VideoPlayer.jsx";
import QuestionPanel from "../Components/QuestionPanel.jsx";
import TranscriptPanel from "../Components/TranscriptPanel.jsx";
import AnalysisPanel from "../Components/AnalysisPanel.jsx";
import PermissionModal from "../Components/PermissionModal.jsx";
import { interviewQuestions } from "../Utils/questions.js";

const Record = () => {
  const navigate = useNavigate();
  const [mirrored, setMirrored] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself and why you're interested in this position.");

  // Custom hooks
  const {
    videoRef,
    micOn,
    cameraOn,
    permissionGranted,
    errorMessage,
    audioOnly,
    handleMicToggle,
    handleCameraToggle,
    stopAllMediaTracks
  } = useMediaStream();

  const {
    transcript,
    interimTranscript,
    isListening,
    speechSupported,
    accuracy,
    language,
    clearTranscript,
    downloadTranscript,
    correctTranscript,
    changeLanguage,
    setTranscript,
    setInterimTranscript
  } = useSpeechRecognition(micOn);

  const {
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording
  } = useMediaRecorder(videoRef);

  const {
    analysis,
    isAnalyzing,
    error: analysisError,
    analyzeTranscript,
    clearAnalysis
  } = useTranscriptAnalysis();

  // Allow scrolling on this page
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Safe navigation function that stops media before navigating
  const handleNavigation = (path) => {
    stopAllMediaTracks();
    navigate(path);
  };

  // Handle new question generation - clear analysis too
  const handleNewQuestion = (newQuestion) => {
    setCurrentQuestion(newQuestion);
    setTranscript("");
    setInterimTranscript("");
    clearAnalysis(); // Clear previous analysis when changing questions
  };

  return (
    <>
      {/* Main Content */}
      <div
        className="min-h-screen w-full px-4 py-6 overflow-auto"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 0.5px,#080708 0.5px)",
          backgroundSize: "21px 21px",
        }}
      >
        <Navbar />
        
        {/* Permission Request Modal */}
        <PermissionModal 
          permissionGranted={permissionGranted} 
          errorMessage={errorMessage}
          audioOnly={audioOnly}
        />

        <div className="max-w-[90rem] mt-24 mx-auto flex flex-col gap-6 pb-8">
          {/* Header with Exit Button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-white text-2xl font-bold">HR Mock Interview</h1>
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <MdHome size={20} />
              Exit Session
            </button>
          </div>
          
          {/* Main Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video Player */}
            <VideoPlayer
              videoRef={videoRef}
              cameraOn={cameraOn}
              mirrored={mirrored}
              setMirrored={setMirrored}
              micOn={micOn}
              handleMicToggle={handleMicToggle}
              handleCameraToggle={handleCameraToggle}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
            
            {/* Right Side: Question + Transcript */}
            <div className="flex flex-col flex-[0.9] gap-6 min-h-[350px]">
              {/* Question Panel */}
              <QuestionPanel
                currentQuestion={currentQuestion}
                setCurrentQuestion={handleNewQuestion}
                setTranscript={setTranscript}
                setInterimTranscript={setInterimTranscript}
                questions={interviewQuestions}
              />
              
              {/* Transcript Panel */}
              <TranscriptPanel
                transcript={transcript}
                interimTranscript={interimTranscript}
                speechSupported={speechSupported}
                micOn={micOn}
                isListening={isListening}
                accuracy={accuracy}
                language={language}
                clearTranscript={clearTranscript}
                downloadTranscript={downloadTranscript}
                correctTranscript={correctTranscript}
                changeLanguage={changeLanguage}
                currentQuestion={currentQuestion}
              />
            </div>
          </div>
          
          {/* Analysis Panel */}
          <AnalysisPanel
            recordedChunks={recordedChunks}
            currentQuestion={currentQuestion}
            transcript={transcript}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            analysisError={analysisError}
            onAnalyzeTranscript={analyzeTranscript}
          />
        </div>
      </div>
    </>
  );
};
export default Record;
