import React from 'react';
import { generateRandomQuestion } from '../utils/questions';

const QuestionPanel = ({ currentQuestion, setCurrentQuestion, setTranscript, setInterimTranscript }) => {
  const handleNewQuestion = () => {
    const newQuestion = generateRandomQuestion();
    setCurrentQuestion(newQuestion);
    
    // Clear transcripts when getting new question
    setTranscript("");
    setInterimTranscript("");
  };

  return (
    <div className="bg-black border-2 border-white rounded-2xl p-6 flex flex-col justify-center min-h-[120px] relative">
      <div className="flex justify-between items-start mb-2">
        <span className="text-white text-sm opacity-70">Current Question</span>
        <button
          onClick={handleNewQuestion}
          className="text-white text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition"
        >
          New Question
        </button>
      </div>
      <p className="text-white text-lg leading-relaxed">{currentQuestion}</p>
    </div>
  );
};

export default QuestionPanel;
