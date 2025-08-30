import React from 'react';
import InterviewDashboard from './InterviewDashboard';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  LightBulbIcon 
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
    <div className="bg-black border border-gray-700/50 rounded-2xl p-6 min-h-[360px] shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-white to-gray-300 rounded-full"></div>
          <span className="text-white text-lg font-medium tracking-wide">Interview Analysis</span>
        </div>
        {canAnalyze && !isAnalyzing && !analysis && (
          <button
            onClick={() => onAnalyzeTranscript(currentQuestion, transcript)}
            className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-white/10 border border-gray-200"
          >
            Analyze with AI
          </button>
        )}
      </div>

      <div className="text-white text-sm space-y-6">
        {/* Loading state */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-white border-r-gray-300 rounded-full animate-spin"></div>
            </div>
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
                className="mt-4 text-red-200 hover:text-red-100 underline text-sm transition-colors"
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
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-all duration-300 border border-gray-600 hover:border-gray-400 flex items-center gap-2 mx-auto"
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
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
              <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Session Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Question:</span>
                    <span className="text-white font-medium text-right max-w-[60%]">{currentQuestion.length > 50 ? currentQuestion.substring(0, 50) + '...' : currentQuestion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recording:</span>
                    <span className="text-green-300 font-medium">Available</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transcript length:</span>
                    <span className="text-white font-medium">{transcript.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-medium ${canAnalyze ? 'text-green-300' : 'text-yellow-300'}`}>
                      {canAnalyze ? 'Ready for analysis' : 'Transcript too short'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {canAnalyze && (
              <div className="bg-gray-900 border border-white/20 rounded-xl p-5 flex items-center gap-4">
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
            <div className="w-16 h-16 bg-gray-800 border border-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LightBulbIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-white font-medium mb-2">No recording data available yet</p>
            <p className="text-gray-400 text-sm">Start recording to see AI-powered interview analysis and feedback here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
