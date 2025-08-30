import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeechRecognition = (micOn) => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [language, setLanguage] = useState('en-US');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);
  const restartCountRef = useRef(0);
  const maxRestarts = 5; // Limit automatic restarts
  const confidenceThreshold = 0.6; // Lowered for better acceptance

  // Enhanced browser support detection
  useEffect(() => {
    const checkSpeechSupport = () => {
      try {
        const hasWebKit = 'webkitSpeechRecognition' in window;
        const hasNative = 'SpeechRecognition' in window;
        const isSupported = hasWebKit || hasNative;
        
        setSpeechSupported(isSupported);
        setError(null);
        
        if (!isSupported) {
          setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
          console.warn('Speech recognition not supported. Supported browsers: Chrome, Edge, Safari (latest versions)');
        } else {
          console.log('Speech recognition available:', hasWebKit ? 'WebKit' : 'Native');
        }
        
        isInitializedRef.current = true;
      } catch (err) {
        console.error('Error checking speech support:', err);
        setSpeechSupported(false);
        setError('Error initializing speech recognition');
      }
    };
    
    checkSpeechSupport();
    
    return () => {
      cleanup();
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      } catch (err) {
        console.warn('Error cleaning up recognition:', err);
      }
    }
    
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Start/stop speech recognition based on mic state
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    if (micOn && speechSupported) {
      // Reset restart counter when mic is turned on
      restartCountRef.current = 0;
      
      // Add a longer delay to ensure media stream is completely stable
      const timer = setTimeout(() => {
        // Double-check that mic is still on before starting
        if (micOn && speechSupported) {
          startSpeechRecognition();
        }
      }, 1500); // Increased delay from 500ms to 1500ms
      
      return () => clearTimeout(timer);
    } else {
      cleanup();
    }
  }, [micOn, speechSupported, language]);

  const startSpeechRecognition = useCallback(() => {
    if (!speechSupported) {
      setError('Speech recognition not supported');
      console.warn('Speech recognition not supported');
      return;
    }

    // Check if microphone is actually available and working
    const checkMicrophoneAccess = () => {
      const videoElements = document.querySelectorAll('video');
      let hasActiveAudioTrack = false;
      
      videoElements.forEach(video => {
        if (video.srcObject) {
          const audioTracks = video.srcObject.getAudioTracks();
          if (audioTracks.some(track => track.enabled && track.readyState === 'live')) {
            hasActiveAudioTrack = true;
          }
        }
      });
      
      return hasActiveAudioTrack;
    };
    
    if (!checkMicrophoneAccess()) {
      console.log('No active audio tracks found, delaying speech recognition start');
      scheduleRestart(2000);
      return;
    }

    // Cleanup any existing recognition
    cleanup();
    setError(null);

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('SpeechRecognition API not available');
      }
      
      const recognition = new SpeechRecognition();
      
      // Optimized configuration
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1; // Simplified for better performance
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        restartCountRef.current = 0; // Reset restart counter on successful start
        console.log('Speech recognition started successfully');
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimText = '';
        let totalConfidence = 0;
        let validResults = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript;
          const confidence = result[0].confidence || 0.8; // Default confidence
          
          if (result.isFinal) {
            // Accept results above threshold or if confidence is undefined
            if (confidence >= confidenceThreshold || result[0].confidence === undefined) {
              finalTranscript += transcriptText + ' ';
              totalConfidence += confidence;
              validResults++;
            } else {
              console.log('Rejected low confidence result:', transcriptText, 'confidence:', confidence);
            }
          } else {
            // For interim results, use lower threshold
            if (confidence >= (confidenceThreshold - 0.2) || result[0].confidence === undefined) {
              interimText += transcriptText;
            }
          }
        }
        
        // Update accuracy metric
        if (validResults > 0) {
          const avgConfidence = totalConfidence / validResults;
          setAccuracy(Math.round(avgConfidence * 100));
        }
        
        if (finalTranscript.trim()) {
          setTranscript(prev => {
            const newTranscript = prev + finalTranscript;
            console.log('Added final transcript:', finalTranscript, 'accuracy:', Math.round((totalConfidence / validResults) * 100) + '%');
            return newTranscript;
          });
          setInterimTranscript(''); // Clear interim when we get final
        } else if (interimText.trim()) {
          setInterimTranscript(interimText);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            console.log('No speech detected');
            scheduleRestart(2000); // Longer delay for no-speech
            break;
          case 'audio-capture':
            setError('Microphone access failed. Please check permissions.');
            break;
          case 'not-allowed':
            setError('Microphone permission denied. Please allow microphone access.');
            break;
          case 'network':
            setError('Network error. Please check your internet connection.');
            scheduleRestart(5000); // Longer delay for network errors
            break;
          case 'service-not-allowed':
            setError('Speech recognition service not allowed.');
            break;
          case 'aborted':
            // Speech recognition was aborted - likely due to media stream changes
            // Don't restart immediately to avoid loops
            console.log('Speech recognition aborted - waiting before restart');
            
            // Check if this is happening too frequently
            if (restartCountRef.current >= 3) {
              console.log('Too many aborted errors, stopping auto-restart');
              setError('Speech recognition keeps getting interrupted. Please try turning the microphone off and on again.');
              return;
            }
            
            scheduleRestart(5000); // Even longer delay for aborted errors
            break;
          default:
            console.log('Speech recognition error:', event.error);
            scheduleRestart(2000); // Increased default delay
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        console.log('Speech recognition ended');
        
        // Only auto-restart if we haven't had many failures
        if (micOn && speechSupported && !error && !restartTimeoutRef.current && restartCountRef.current < 3) {
          scheduleRestart(2000); // Longer delay
        } else if (restartCountRef.current >= 3) {
          console.log('Too many restart attempts, stopping auto-restart');
          setError('Speech recognition stopped due to repeated errors. Click the microphone button to restart.');
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to initialize speech recognition: ' + error.message);
      setIsListening(false);
    }
  }, [speechSupported, language, micOn, error, cleanup]);

  const scheduleRestart = useCallback((delay) => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    // Check restart limit
    if (restartCountRef.current >= maxRestarts) {
      console.log('Maximum restart attempts reached, stopping auto-restart');
      setError('Speech recognition failed multiple times. Please refresh the page or check your microphone.');
      return;
    }
    
    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null;
      if (micOn && speechSupported && !error) {
        restartCountRef.current += 1;
        console.log(`Restarting speech recognition... (attempt ${restartCountRef.current}/${maxRestarts})`);
        startSpeechRecognition();
      }
    }, delay);
  }, [micOn, speechSupported, error, startSpeechRecognition]);

  const stopSpeechRecognition = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setAccuracy(0);
    setError(null);
  }, []);

  const downloadTranscript = useCallback((currentQuestion) => {
    try {
      const fullTranscript = `Interview Question: ${currentQuestion}\n\nTranscript:\n${transcript}\n\nAccuracy: ${accuracy}%\nLanguage: ${language}\nGenerated: ${new Date().toLocaleString()}`;
      const blob = new Blob([fullTranscript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading transcript:', err);
      setError('Failed to download transcript');
    }
  }, [transcript, accuracy, language]);

  // Manual transcript correction function
  const correctTranscript = useCallback((correctedText) => {
    setTranscript(correctedText);
    setError(null);
  }, []);

  // Language switching function
  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    setError(null);
    if (isListening) {
      // Restart with new language
      cleanup();
      setTimeout(() => {
        if (micOn && speechSupported) {
          startSpeechRecognition();
        }
      }, 200);
    }
  }, [isListening, micOn, speechSupported, cleanup, startSpeechRecognition]);

  const manualRestart = useCallback(() => {
    console.log('Manual restart of speech recognition');
    restartCountRef.current = 0; // Reset restart counter
    setError(null); // Clear any errors
    cleanup();
    
    setTimeout(() => {
      if (micOn && speechSupported) {
        startSpeechRecognition();
      }
    }, 1000);
  }, [micOn, speechSupported, cleanup, startSpeechRecognition]);

  return {
    transcript,
    interimTranscript,
    isListening,
    speechSupported,
    accuracy,
    language,
    error,
    startSpeechRecognition,
    stopSpeechRecognition,
    clearTranscript,
    downloadTranscript,
    correctTranscript,
    changeLanguage,
    setTranscript,
    setInterimTranscript,
    manualRestart
  };
};
