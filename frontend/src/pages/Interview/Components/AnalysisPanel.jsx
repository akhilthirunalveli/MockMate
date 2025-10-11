import React from 'react';
import { HashLoader } from 'react-spinners';
import InterviewDashboard from './InterviewDashboard';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AnalysisPanel = ({
  recordedChunks,
  currentQuestion,
  transcript,
  analysis,
  isAnalyzing,
  analysisError,
  onAnalyzeTranscript
}) => {
  const canAnalyze = transcript && transcript.trim().length >= 10;

  return (
    <div className="bg-black border-2 border-white rounded-2xl p-6 min-h-[200px] shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-gray-300 rounded-full"></div>
          <span className="text-white text-lg font-medium tracking-wide">Interview Analysis</span>
        </div>
        {canAnalyze && !isAnalyzing && !analysis && (
          <button
            onClick={() => onAnalyzeTranscript(currentQuestion, transcript)}
            className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-white/10 border border-gray-200 cursor-pointer"
          >
            Analyze with AI
          </button>
        )}
      </div>

      <div className="text-white text-sm space-y-6">
        {/* Loading state */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <HashLoader color="#ffffff" />
            <div className="mt-6 text-center">
              <div className="text-white font-medium text-base">Analyzing your response...</div>
              <div className="text-gray-400 text-sm mt-2">Our AI is reviewing your answer for insights</div>
            </div>
          </div>
        )}

        {/* Error state */}
        {analysisError && (
          <div className="bg-red-950/50 border border-red-400/50 rounded-xl p-5">
            <p className="text-red-300 flex items-center gap-3 font-medium">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              {analysisError}
            </p>
            {canAnalyze && (
              <button
                onClick={() => onAnalyzeTranscript(currentQuestion, transcript)}
                className="mt-4 text-red-200 hover:text-red-100 underline text-sm transition-colors cursor-pointer"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {/* AI Analysis Results - New Dashboard */}
        {analysis && !isAnalyzing && (
          <div className="overflow-hidden">
            <InterviewDashboard
              analysis={analysis}
              currentQuestion={currentQuestion}
              transcript={transcript || ''}
            />
            {/* Analyze Again Option */}
            <div className="mt-8 text-center">
              <button
                onClick={() => onAnalyzeTranscript(currentQuestion, transcript)}
                className="bg-white text-black px-5 py-2.5 rounded-lg text-sm transition-all duration-300 border border-gray-600 hover:border-gray-400 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Re-analyze Response
              </button>
            </div>
          </div>
        )}

        {/* Recording Summary */}
        {recordedChunks.length > 0 && !analysis && !isAnalyzing && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
              <p className="text-emerald-300 font-medium">Recording completed successfully!</p>
            </div>
            <div className="bg-black border-2 border-white/20 p-6 rounded-xl shadow-lg">
              <h4 className="font-semibold mb-6 text-white flex items-center gap-3 text-lg">
                <CheckCircleIcon className="w-6 h-6 text-white" />
                Recording Session Complete
              </h4>

              {/* Current Question Section */}
              <div className="mb-6 p-4 bg-black rounded-lg border border-white/10">
                <div className="flex items-start gap-3 mb-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white mt-0.5" />
                  <div className="flex-1">
                    <h5 className="text-white font-medium text-sm mb-1">Interview Question</h5>
                    <p className="text-gray-300 text-sm leading-relaxed">{currentQuestion}</p>
                  </div>
                </div>
              </div>

              {/* Session Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black border border-white/20 p-4 rounded-lg text-center">
                  <VideoCameraIcon className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">Video Recording</div>
                  <div className="text-white font-semibold text-sm">✓ Captured</div>
                </div>

                <div className="bg-black border border-white/20 p-4 rounded-lg text-center">
                  <DocumentTextIcon className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">Transcript</div>
                  <div className="text-white font-semibold text-sm">{transcript.length} characters</div>
                </div>

                <div className="bg-black border border-white/20 p-4 rounded-lg text-center">
                  <ClockIcon className="w-6 h-6 text-white mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">Analysis Status</div>
                  <div className={`font-semibold text-sm ${canAnalyze ? 'text-white' : 'text-gray-400'}`}>
                    {canAnalyze ? '✓ Ready' : 'Need more content'}
                  </div>
                </div>
              </div>

              {/* What's Next Section */}
              <div className="bg-black rounded-lg p-4">
                <h5 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                  <LightBulbIcon className="w-4 h-4 text-white" />
                  What's Next?
                </h5>
                <p className="text-gray-300 text-sm">
                  {canAnalyze
                    ? "Your response is ready for AI analysis. Click the 'Analyze with AI' button above to get detailed feedback, scoring, and improvement suggestions."
                    : "Keep speaking to build a more substantial response (minimum 10 characters needed for analysis)."
                  }
                </p>
              </div>
            </div>
            {canAnalyze && (
              <div className="bg-black border-2 border-white/20 rounded-xl p-5 flex items-center gap-4 shadow-lg">
                <LightBulbIcon className="w-6 h-6 text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Ready for AI Analysis</p>
                  <p className="text-gray-300 text-sm mt-1">Click "Analyze with AI" to get detailed feedback and insights on your response</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default state */}
        {recordedChunks.length === 0 && !analysis && !isAnalyzing && (
          <div className="text-center py-12">
            <p className="text-white font-medium mb-2">No recording data available yet</p>
            <p className="text-gray-400 text-sm">Start recording to see AI-powered interview analysis and feedback here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
