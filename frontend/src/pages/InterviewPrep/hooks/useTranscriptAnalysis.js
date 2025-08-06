import { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

export const useTranscriptAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeTranscript = async (question, transcript) => {
    // Validation
    if (!transcript || transcript.trim().length < 10) {
      setError("Transcript is too short for meaningful analysis. Please speak for at least a few sentences.");
      return;
    }

    if (!question) {
      setError("No question available for analysis.");
      return;
    }

    const trimmedTranscript = transcript.trim();
    if (trimmedTranscript.length > 5000) {
      setError("Transcript is too long. Please try with a shorter response.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log("Sending transcript for analysis...");
      console.log("Question:", question);
      console.log("Transcript length:", trimmedTranscript.length);
      
      const response = await axiosInstance.post(API_PATHS.AI.ANALYZE_TRANSCRIPT, {
        question,
        transcript: trimmedTranscript
      });

      if (response.data) {
        setAnalysis(response.data);
        console.log("Analysis received:", response.data);
      } else {
        throw new Error("Empty response from AI service");
      }
    } catch (err) {
      console.error("Error analyzing transcript:", err);
      
      let errorMessage = "Failed to analyze transcript. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid request. Please check your transcript.";
      } else if (err.response?.status >= 500) {
        errorMessage = "AI service is temporarily unavailable. Please try again later.";
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeTranscript,
    clearAnalysis
  };
};
