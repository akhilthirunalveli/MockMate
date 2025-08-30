import React from 'react';

const QuestionPanel = ({ currentQuestion, setCurrentQuestion, setTranscript, setInterimTranscript, questions = [] }) => {
  // Move to next question in the list
  const handleNextQuestion = () => {
    if (!questions.length) return;
    const idx = questions.findIndex(q => q === currentQuestion);
    const nextIdx = idx >= 0 && idx < questions.length - 1 ? idx + 1 : 0;
    setCurrentQuestion(questions[nextIdx]);
    setTranscript("");
    setInterimTranscript("");
  };

  return (
    <div className="bg-black border-2 border-white rounded-2xl p-6 flex flex-col justify-center min-h-[120px] relative shadow-lg hover:border-gray-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-white text-sm opacity-70">Current Question</span>
        <button
          onClick={handleNextQuestion}
          className="text-white text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition border border-gray-600"
          disabled={!questions.length}
          style={{ opacity: !questions.length ? 0.5 : 1, cursor: !questions.length ? 'not-allowed' : 'pointer' }}
        >
          Next Question
        </button>
      </div>
      <p className="text-white text-lg leading-relaxed min-h-[32px]">
        {currentQuestion || <span className="text-gray-400">Select a session to load questions</span>}
      </p>
    </div>
  );
};

export default QuestionPanel;
