import { useState, useRef, useEffect } from 'react';

export const useSpeechRecognition = (micOn) => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const confidenceThreshold = 0.7; // Minimum confidence for accepting results

  useEffect(() => {
    // Check speech recognition support with detailed browser detection
    const checkSpeechSupport = () => {
      const hasWebKit = 'webkitSpeechRecognition' in window;
      const hasNative = 'SpeechRecognition' in window;
      const isSupported = hasWebKit || hasNative;
      
      setSpeechSupported(isSupported);
      
      if (!isSupported) {
        console.warn('Speech recognition not supported in this browser');
        console.warn('Supported browsers: Chrome, Edge, Safari (latest versions)');
      } else {
        console.log('Speech recognition available:', hasWebKit ? 'WebKit' : 'Native');
      }
    };
    
    checkSpeechSupport();
    
    return () => {
      stopSpeechRecognition();
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  // Start/stop speech recognition based on mic state
  useEffect(() => {
    if (micOn && speechSupported) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }
  }, [micOn, speechSupported, language]);

  const startSpeechRecognition = () => {
    if (!speechSupported) {
      console.warn('Speech recognition not supported');
      return;
    }

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Stop existing recognition if any
    stopSpeechRecognition();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Enhanced configuration for better accuracy
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
      
      // Additional settings for better performance
      if ('serviceURI' in recognition) {
        // Use Google's speech service if available
        recognition.serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
      }
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started with enhanced settings');
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimText = '';
        let totalConfidence = 0;
        let validResults = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          
          // Get the best alternative based on confidence
          let bestAlternative = result[0];
          let bestConfidence = result[0].confidence || 0;
          
          // Check all alternatives if available
          for (let j = 1; j < result.length; j++) {
            const alternative = result[j];
            const confidence = alternative.confidence || 0;
            if (confidence > bestConfidence) {
              bestAlternative = alternative;
              bestConfidence = confidence;
            }
          }
          
          const transcriptText = bestAlternative.transcript;
          const confidence = bestConfidence;
          
          // Only use results above confidence threshold
          if (result.isFinal) {
            if (confidence >= confidenceThreshold || confidence === undefined) {
              finalTranscript += transcriptText + ' ';
              totalConfidence += confidence || 0.8; // Default confidence if not provided
              validResults++;
            } else {
              console.log('Rejected low confidence result:', transcriptText, 'confidence:', confidence);
            }
          } else {
            // For interim results, use lower threshold
            if (confidence >= (confidenceThreshold - 0.2) || confidence === undefined) {
              interimText += transcriptText;
            }
          }
        }
        
        // Update accuracy metric
        if (validResults > 0) {
          const avgConfidence = totalConfidence / validResults;
          setAccuracy(Math.round(avgConfidence * 100));
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(''); // Clear interim when we get final
          console.log('Added final transcript:', finalTranscript, 'accuracy:', Math.round((totalConfidence / validResults) * 100) + '%');
        } else {
          setInterimTranscript(interimText);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Enhanced error handling
        switch (event.error) {
          case 'no-speech':
            console.log('No speech detected, restarting...');
            scheduleRestart(2000);
            break;
          case 'audio-capture':
            console.log('Audio capture failed, restarting...');
            scheduleRestart(1000);
            break;
          case 'not-allowed':
            console.error('Microphone permission denied');
            break;
          case 'network':
            console.log('Network error, retrying...');
            scheduleRestart(3000);
            break;
          case 'service-not-allowed':
            console.error('Speech recognition service not allowed');
            break;
          default:
            console.log('Unknown error, restarting...', event.error);
            scheduleRestart(2000);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        console.log('Speech recognition ended');
        
        // Auto-restart if mic is still on and no error occurred
        if (micOn && speechSupported && !restartTimeoutRef.current) {
          scheduleRestart(500);
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const scheduleRestart = (delay) => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    restartTimeoutRef.current = setTimeout(() => {
      restartTimeoutRef.current = null;
      if (micOn && speechSupported) {
        console.log('Restarting speech recognition...');
        startSpeechRecognition();
      }
    }, delay);
  };

  const stopSpeechRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
    setAccuracy(0);
  };

  const downloadTranscript = (currentQuestion) => {
    const fullTranscript = `Interview Question: ${currentQuestion}\n\nTranscript:\n${transcript}\n\nAccuracy: ${accuracy}%\nLanguage: ${language}`;
    const blob = new Blob([fullTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Manual transcript correction function
  const correctTranscript = (correctedText) => {
    setTranscript(correctedText);
  };

  // Language switching function
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    if (isListening) {
      // Restart with new language
      stopSpeechRecognition();
      setTimeout(() => {
        if (micOn) {
          startSpeechRecognition();
        }
      }, 100);
    }
  };

  return {
    transcript,
    interimTranscript,
    isListening,
    speechSupported,
    accuracy,
    language,
    startSpeechRecognition,
    stopSpeechRecognition,
    clearTranscript,
    downloadTranscript,
    correctTranscript,
    changeLanguage,
    setTranscript,
    setInterimTranscript
  };
};
