import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance.js";
import { API_PATHS } from "../../../constants/apiPaths.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Home01Icon, ArrowDown01Icon } from 'hugeicons-react';
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
  const [searchParams] = useSearchParams();
  const filterResumeSessions = searchParams.get("isResumeSession") === "true";
  const [mirrored, setMirrored] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Fetch all user sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
        let sessionsList = res.data || [];
        if (filterResumeSessions) {
          sessionsList = sessionsList.filter(s => s.isResumeSession);
        }
        setSessions(sessionsList);
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
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between min-w-[300px] p-4 rounded-xl bg-black text-white border border-white/30 font-medium transition-all duration-300 hover:border-white/60 cursor-pointer"
                >
                  <span className="truncate pr-8">
                    {selectedSession
                      ? (() => {
                        const s = sessions.find(s => s._id === selectedSession);
                        return (s?.role || (s?.isResumeSession ? 'Resume Interview' : 'Interview')) +
                          (s?.topicsToFocus ? " • " + s.topicsToFocus : "");
                      })()
                      : "Select a session to begin"}
                  </span>
                  <ArrowDown01Icon
                    size={18}
                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-black border border-white/20 rounded-xl overflow-hidden shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {sessions.length === 0 ? (
                        <div className="p-4 text-white text-sm text-center italic">No sessions found</div>
                      ) : (
                        sessions.map(session => (
                          <div
                            key={session._id}
                            onClick={() => {
                              setSelectedSession(session._id);
                              setIsDropdownOpen(false);
                            }}
                            className={`p-4 text-sm transition-colors cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/5 ${selectedSession === session._id ? 'bg-white/10 text-white' : 'text-white/70'
                              }`}
                          >
                            <div className="font-semibold">{session.role || 'Resume Interview'}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Click overlay to close */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-[90] cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
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
