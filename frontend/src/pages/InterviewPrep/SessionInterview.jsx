import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../constants/apiPaths";
import { useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useMediaStream } from "../../hooks/useMediaStream.js";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";
import { useMediaRecorder } from "../../hooks/useMediaRecorder.js";
import { useTranscriptAnalysis } from "../../hooks/useTranscriptAnalysis.js";
import VideoPlayer from "./components/VideoPlayer.jsx";
import QuestionPanel from "./components/QuestionPanel.jsx";
import TranscriptPanel from "./components/TranscriptPanel.jsx";
import AnalysisPanel from "./components/AnalysisPanel.jsx";
import PermissionModal from "./components/PermissionModal.jsx";

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
      <div
        className="min-h-screen w-full px-4 py-6 overflow-auto"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 0.5px,#080708 0.5px)",
          backgroundSize: "21px 21px",
        }}
      >
        <Navbar />

  {/* Session Selector - now inside header row, left of title */}

        {/* Permission Request Modal */}
        <PermissionModal 
          permissionGranted={permissionGranted} 
          errorMessage={errorMessage}
          audioOnly={audioOnly}
        />

  <div className="max-w-[90rem] mt-24 mx-auto flex flex-col gap-6 pb-8">
          {/* Header with Session Selector and Exit Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div>
                <select
                  className="w-full p-3 rounded-full bg-black text-white border border-white/100 focus:outline-none focus:ring-2 focus:ring-white font-semibold transition-all duration-150"
                  value={selectedSession || ''}
                  onChange={e => setSelectedSession(e.target.value)}
                >
                  <option value="" disabled>Select session</option>
                  {sessions.map(session => (
                    <option key={session._id} value={session._id}>
                      {session.role || 'Session'} - {session.topicsToFocus || ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-black rounded-lg transition-colors font-semibold hover:bg-gray-100"
            >
              <MdHome size={20} color="#000" />
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
