import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layouts/Navbar";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdFlipCameraAndroid, MdHome } from "react-icons/md";

const Record = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself and why you're interested in this position.");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const recognitionRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          // Disable all tracks by default
          stream.getAudioTracks().forEach((track) => (track.enabled = false));
          stream.getVideoTracks().forEach((track) => (track.enabled = false));
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setPermissionGranted(false);
      }
    };
    
    // Check speech recognition support
    const checkSpeechSupport = () => {
      const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(isSupported);
      if (!isSupported) {
        console.warn('Speech recognition not supported in this browser');
      }
    };
    
    getCamera();
    checkSpeechSupport();
    
    // Cleanup function to stop all media tracks when component unmounts
    return () => {
      stopAllMediaTracks();
      stopSpeechRecognition();
    };
  }, []);

  // Add beforeunload event listener to stop media when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllMediaTracks();
      stopSpeechRecognition();
    };

    // Only listen for page unload, not tab switching
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Function to stop all media tracks and release permissions
  const stopAllMediaTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      videoRef.current.srcObject = null;
    }
    
    // Reset states
    setCameraOn(false);
    setMicOn(false);
    setIsRecording(false);
    setIsListening(false);
  };

  // Allow scrolling on this page
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto-scroll transcript to bottom within its container
  useEffect(() => {
    if (transcriptEndRef.current) {
      const transcriptContainer = transcriptEndRef.current.closest('.overflow-y-auto');
      if (transcriptContainer) {
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
      }
    }
  }, [transcript, interimTranscript]);

  // Toggle mic/camera by enabling/disabling tracks
  const handleMicToggle = () => {
    setMicOn((prev) => {
      const enabled = !prev;
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getAudioTracks().forEach((track) => (track.enabled = enabled));
      }
      
      // Start/stop speech recognition based on mic state
      if (enabled && speechSupported) {
        startSpeechRecognition();
      } else {
        stopSpeechRecognition();
      }
      
      return enabled;
    });
  };

  const handleCameraToggle = () => {
    const stream = videoRef.current?.srcObject;
    
    if (!cameraOn) {
      // Turn camera ON - need to request new video stream
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      }).then((newStream) => {
        if (videoRef.current) {
          // Stop old stream if exists
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          videoRef.current.srcObject = newStream;
          
          // Apply current mic state to new stream
          newStream.getAudioTracks().forEach((track) => {
            track.enabled = micOn;
          });
          
          setCameraOn(true);
        }
      }).catch((err) => {
        console.error("Error enabling camera:", err);
        alert("Unable to access camera. Please check permissions.");
      });
    } else {
      // Turn camera OFF - stop video tracks to turn off camera light
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        
        // Stop all video tracks to turn off camera light
        videoTracks.forEach((track) => {
          track.stop();
        });
        
        // Get audio-only stream to replace it
        navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        }).then((audioStream) => {
          if (videoRef.current) {
            audioStream.getAudioTracks().forEach((track) => {
              track.enabled = micOn;
            });
            videoRef.current.srcObject = audioStream;
          }
        }).catch((err) => {
          console.error("Error getting audio stream:", err);
        });
      }
      
      setCameraOn(false);
    }
  };

  const handleMirrorToggle = () => setMirrored((prev) => !prev);

  const startRecording = async () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedChunks([blob]);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start speech recognition for transcript
      startSpeechRecognition();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      // Stop speech recognition
      stopSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    if (!speechSupported) {
      console.warn('Speech recognition not supported');
      return;
    }

    // Stop existing recognition if any
    stopSpeechRecognition();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(''); // Clear interim when we get final
        } else {
          setInterimTranscript(interimText);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Auto-restart on certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (micOn && speechSupported) {
              startSpeechRecognition();
            }
          }, 1000);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        console.log('Speech recognition ended');
        
        // Auto-restart if mic is still on
        if (micOn && speechSupported) {
          setTimeout(() => {
            startSpeechRecognition();
          }, 100);
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const generateNewQuestion = () => {
    const questions = [
      "Tell me about yourself and why you're interested in this position.",
      "What are your greatest strengths and weaknesses?",
      "Describe a challenging situation you faced and how you handled it.",
      "Where do you see yourself in 5 years?",
      "Why do you want to work for our company?",
      "Tell me about a time you worked in a team.",
      "How do you handle stress and pressure?",
      "What motivates you in your work?",
      "Describe your ideal work environment.",
      "What questions do you have for me?"
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    
    // Clear transcripts when getting new question
    setTranscript("");
    setInterimTranscript("");
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  const downloadTranscript = () => {
    const fullTranscript = `Interview Question: ${currentQuestion}\n\nTranscript:\n${transcript}`;
    const blob = new Blob([fullTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Safe navigation function that stops media before navigating
  const handleNavigation = (path) => {
    stopAllMediaTracks();
    navigate(path);
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
        
        {/* Permission Request */}
        {!permissionGranted && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl max-w-md mx-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Camera & Microphone Access</h2>
              <p className="text-gray-600 mb-6">
                This interview recorder needs access to your camera and microphone to function properly.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Grant Access
              </button>
            </div>
          </div>
        )}

        <div className="max-w-[90rem] mt-24 mx-auto flex flex-col gap-6 pb-8">
          {/* Header with Exit Button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-white text-2xl font-bold">Interview Recording Session</h1>
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
            {/* Video Box */}
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
              
              {/* Dock */}
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
                  onClick={handleMirrorToggle}
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
            
            {/* Right Side: Question + Transcript */}
            <div className="flex flex-col flex-[0.9] gap-6">
              {/* Question Box */}
              <div className="bg-black border-2 border-white rounded-2xl p-6 flex flex-col justify-center min-h-[120px] relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white text-sm opacity-70">Current Question</span>
                  <button
                    onClick={generateNewQuestion}
                    className="text-white text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition"
                  >
                    New Question
                  </button>
                </div>
                <p className="text-white text-lg leading-relaxed">{currentQuestion}</p>
              </div>
              
              {/* Transcript Box */}
              <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[280px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm opacity-70">Live Transcript</span>
                    {!speechSupported && (
                      <span className="text-yellow-400 text-xs bg-yellow-900/30 px-2 py-1 rounded">
                        Speech recognition not supported
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {speechSupported && micOn && (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        <span className={`text-xs ${isListening ? 'text-green-400' : 'text-gray-400'}`}>
                          {isListening ? 'Listening...' : 'Ready'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-white text-sm leading-relaxed overflow-y-auto max-h-60 pr-2 scroll-smooth" id="transcript-container">
                  {transcript || interimTranscript ? (
                    <div className="space-y-2">
                      {/* Final transcript */}
                      {transcript && (
                        <div className="text-white">
                          {transcript.split('\n').map((line, index) => (
                            <p key={index} className="mb-1">{line}</p>
                          ))}
                        </div>
                      )}
                      
                      {/* Interim transcript (real-time typing) */}
                      {interimTranscript && (
                        <div className="text-gray-300 italic opacity-75 border-l-2 border-blue-400 pl-2">
                          {interimTranscript}
                          <span className="animate-pulse">|</span>
                        </div>
                      )}
                      
                      {/* Auto-scroll target */}
                      <div ref={transcriptEndRef} />
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      {!speechSupported ? (
                        <div>
                          <p>Speech recognition not available in this browser.</p>
                          <p className="text-xs mt-2">Try using Chrome, Edge, or Safari for the best experience.</p>
                        </div>
                      ) : !micOn ? (
                        <div>
                          <p>Turn on microphone to enable live transcript</p>
                          <p className="text-xs mt-2">Your speech will appear here in real-time</p>
                        </div>
                      ) : (
                        <div>
                          <p>Start speaking to see transcript...</p>
                          <p className="text-xs mt-2">Waiting for audio input</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Transcript Controls */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400">
                    {transcript.length > 0 && `${transcript.length} characters`}
                  </div>
                  <div className="flex gap-2">
                    {transcript && (
                      <>
                        <button
                          onClick={downloadTranscript}
                          className="text-blue-400 text-xs hover:text-blue-300 transition px-2 py-1 rounded bg-blue-900/20"
                        >
                          Download
                        </button>
                        <button
                          onClick={clearTranscript}
                          className="text-gray-400 text-xs hover:text-white transition px-2 py-1 rounded bg-gray-800"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Result Box */}
          <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[360px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white text-lg font-semibold">Interview Analysis</span>
            </div>
            <div className="text-white text-sm space-y-4">
              {recordedChunks.length > 0 ? (
                <div>
                  <p className="text-green-400 mb-2">✓ Recording completed successfully!</p>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Session Summary:</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Question: {currentQuestion}</li>
                      <li>• Recording duration: Available</li>
                      <li>• Transcript length: {transcript.length} characters</li>
                      <li>• Status: Ready for AI analysis</li>
                    </ul>
                  </div>
                  <p className="text-yellow-400 mt-4 text-xs">
                    💡 AI-powered feedback and scoring will be added in future updates
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <p>No recording data available yet.</p>
                  <p className="text-sm mt-2">Start recording to see interview analysis and feedback here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Record;
