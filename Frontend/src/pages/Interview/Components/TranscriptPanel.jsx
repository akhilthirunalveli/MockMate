import React, { useRef, useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance.js';
import { API_PATHS } from '../../../constants/apiPaths.js';

const TranscriptPanel = ({ 
  transcript, 
  interimTranscript, 
  speechSupported, 
  micOn, 
  isListening, 
  accuracy,
  language,
  clearTranscript, 
  downloadTranscript, 
  correctTranscript,
  changeLanguage,
  currentQuestion 
}) => {
  const transcriptEndRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupError, setCleanupError] = useState(null);

  // Auto-scroll transcript to bottom within its container
  useEffect(() => {
    if (transcriptEndRef.current) {
      const transcriptContainer = transcriptEndRef.current.closest('.overflow-y-auto');
      if (transcriptContainer) {
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
      }
    }
  }, [transcript, interimTranscript]);

  // Update edited transcript when transcript changes
  useEffect(() => {
    setEditedTranscript(transcript);
  }, [transcript]);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedTranscript(transcript);
  };

  const handleEditSave = () => {
    correctTranscript(editedTranscript);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedTranscript(transcript);
    setIsEditing(false);
  };

  const getAccuracyColor = (acc) => {
    if (acc >= 90) return 'text-green-400';
    if (acc >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAccuracyLabel = (acc) => {
    if (acc >= 90) return 'Excellent';
    if (acc >= 70) return 'Good';
    if (acc >= 50) return 'Fair';
    return 'Poor';
  };

  const handleCleanupTranscript = async () => {
    if (!transcript || transcript.trim().length < 10) {
      setCleanupError("Transcript too short for cleanup");
      return;
    }

    setIsCleaningUp(true);
    setCleanupError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.CLEANUP_TRANSCRIPT, {
        transcript: transcript.trim()
      });

      if (response.data.cleanedTranscript) {
        correctTranscript(response.data.cleanedTranscript);
        console.log('Transcript cleaned up successfully');
        if (response.data.improvements) {
          console.log('Improvements made:', response.data.improvements);
        }
      }
    } catch (err) {
      console.error('Error cleaning up transcript:', err);
      setCleanupError(err.response?.data?.message || "Failed to cleanup transcript");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[480px] flex flex-col flex-1">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm opacity-70">Live Transcript</span>
          {!speechSupported && (
            <span className="text-yellow-400 text-xs bg-yellow-900/30 px-2 py-1 rounded">
              Speech recognition not supported
            </span>
          )}
          {speechSupported && accuracy > 0 && (
            <span className={`text-xs px-2 py-1 rounded bg-gray-800 ${getAccuracyColor(accuracy)}`}>
              {getAccuracyLabel(accuracy)} ({accuracy}%)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          {speechSupported && (
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="text-xs bg-gray-800 text-white px-2 py-1 rounded border border-gray-600"
              disabled={isListening}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-AU">English (AU)</option>
              <option value="en-IN">English (India)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="pt-BR">Portuguese</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese</option>
            </select>
          )}
          
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
      
      <div className="flex-1 text-white text-sm leading-relaxed overflow-y-auto max-h-96 pr-2 scroll-smooth" id="transcript-container">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="w-full h-64 bg-gray-800 text-white p-3 rounded border border-gray-600 resize-none focus:outline-none focus:border-blue-400"
              placeholder="Edit your transcript here..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSave}
                className="text-green-400 text-xs hover:text-green-300 transition px-3 py-1 rounded bg-green-900/20 border border-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={handleEditCancel}
                className="text-gray-400 text-xs hover:text-white transition px-3 py-1 rounded bg-gray-800 border border-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
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
                    {accuracy === 0 && (
                      <p className="text-xs mt-1 text-yellow-400">Tip: Speak clearly and at a moderate pace for better accuracy</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Transcript Controls */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {transcript.length > 0 && `${transcript.length} characters`}
          {accuracy > 0 && transcript.length > 0 && (
            <span className="ml-2">• Accuracy: <span className={getAccuracyColor(accuracy)}>{accuracy}%</span></span>
          )}
        </div>
        <div className="flex gap-2">
          {transcript && !isEditing && (
            <>
              <button
                onClick={handleCleanupTranscript}
                disabled={isCleaningUp || transcript.trim().length < 10}
                className="text-green-400 text-xs hover:text-green-300 transition px-2 py-1 rounded bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clean up transcript with AI"
              >
                {isCleaningUp ? 'Cleaning...' : 'AI Cleanup'}
              </button>
              <button
                onClick={handleEditStart}
                className="text-purple-400 text-xs hover:text-purple-300 transition px-2 py-1 rounded bg-purple-900/20"
                title="Edit transcript manually"
              >
                Edit
              </button>
              <button
                onClick={() => downloadTranscript(currentQuestion)}
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
      
      {/* Cleanup Error */}
      {cleanupError && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-600 rounded text-xs">
          <span className="text-red-400">❌ {cleanupError}</span>
        </div>
      )}
      
      {/* Accuracy Tips */}
      {speechSupported && accuracy > 0 && accuracy < 70 && (
        <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
          <div className="text-yellow-400 font-semibold mb-1">💡 Tips to improve accuracy:</div>
          <ul className="text-yellow-300 space-y-1">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Reduce background noise</li>
            <li>• Move closer to your microphone</li>
            <li>• Use simple, clear sentences</li>
            <li>• Try the "AI Cleanup" button to improve existing text</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TranscriptPanel;
