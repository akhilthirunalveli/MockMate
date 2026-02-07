import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance.js";
import { API_PATHS } from "../../../constants/apiPaths.js";
import { useNavigate } from "react-router-dom";
import { Home01Icon } from 'hugeicons-react';
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

const SessionInterview = () => {
  const navigate = useNavigate();
  const [mirrored, setMirrored] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  // Fetch all user sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
        setSessions(res.data || []);
      } catch (err) {
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  // Fetch questions for selected session
  useEffect(() => {
    if (!selectedSession) {
      setSessionQuestions([]);
      setCurrentQuestion("");
      return;
    }
    const fetchSessionQuestions = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(selectedSession));
        const questions = Array.isArray(res.data?.session?.questions)
          ? res.data.session.questions.map(q => q.question)
          : [];
        setSessionQuestions(questions);
        setCurrentQuestion(questions.length > 0 ? questions[0] : "");
      } catch (err) {
        setSessionQuestions([]);
        setCurrentQuestion("");
      }
    };
    fetchSessionQuestions();
  }, [selectedSession]);

  // Custom hooks
  const {
    videoRef, micOn, cameraOn, permissionGranted, errorMessage, audioOnly, hasAttemptedMediaAccess,
    handleMicToggle,
    handleCameraToggle,
    stopAllMediaTracks,
    retryPermissions
  } = useMediaStream();

  const {
    transcript,
    interimTranscript,
    isListening,
    speechSupported,
    accuracy,
    language,
    error: speechError,
    clearTranscript,
    downloadTranscript,
    correctTranscript,
    changeLanguage,
    setTranscript,
    setInterimTranscript,
    manualRestart
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

  // Custom mic toggle that also handles speech recognition restart
  const handleMicToggleWithRestart = async () => {
    await handleMicToggle();

    // If mic is being turned on and there are speech recognition errors, restart it
    if (!micOn && speechSupported) {
      setTimeout(() => {
        manualRestart();
      }, 2000); // Give mic time to fully initialize
    }
  };

  // Handle new question selection - clear analysis too
  const handleNewQuestion = (newQuestion) => {
    setCurrentQuestion(newQuestion);
    setTranscript("");
    setInterimTranscript("");
    clearAnalysis();
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen w-full px-4 py-6 overflow-auto bg-dots-dark">
        <Navbar />

        {/* Session Selector - now inside header row, left of title */}

        {/* Permission Request Modal - only show if user attempted access and there's an error */}
        <PermissionModal
          permissionGranted={permissionGranted}
          errorMessage={errorMessage}
          audioOnly={audioOnly}
          hasAttemptedMediaAccess={hasAttemptedMediaAccess}
          retryPermissions={retryPermissions}
        />

        <div className="max-w-[90rem] mt-24 mx-auto flex flex-col gap-6 pb-8">
          {/* Header with Session Selector and Exit Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative">
                  <label htmlFor="session-select" className="block text-white text-sm font-medium mb-2 ml-1">
                  </label>
                  <select
                    id="session-select"
                    className="min-w-[400px] p-4 rounded-full bg-black/80 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white font-medium transition-all duration-300 hover:border-white/60 cursor-pointer appearance-none"
                    value={selectedSession || ''}
                    onChange={e => setSelectedSession(e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 16px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" disabled className="bg-black text-gray-300">
                      Select a session to begin
                    </option>
                    {sessions.map(session => (
                      <option
                        key={session._id}
                        value={session._id}
                        className="bg-black text-white py-2"
                      >
                        {session.role || 'Interview'} • {session.topicsToFocus || 'General Topics'}
                      </option>
                    ))}
                  </select>
                  {!selectedSession && (
                    <p className="text-gray-400 text-xs mt-1 ml-1">                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white border border-red-500 rounded-full transition-all duration-300 font-semibold hover:bg-red-700 hover:border-red-600 active:scale-95 cursor-pointer"
            >
              <Home01Icon size={20} color="#ffffff" />
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
              handleMicToggle={handleMicToggleWithRestart}
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
                questions={sessionQuestions}
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
                speechError={speechError}
                manualRestart={manualRestart}
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
export default SessionInterview;
