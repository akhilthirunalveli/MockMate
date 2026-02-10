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
    <div className="bg-black border border-white/30 rounded-xl p-6 flex flex-col justify-center min-h-[120px] relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-white/80 rounded-full"></div>
          <span className="text-white text-sm">Current Question</span>
        </div>
        <button
          onClick={handleNextQuestion}
          className="text-white text-xs bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full cursor-pointer"
          disabled={!questions.length}
          style={{ opacity: !questions.length ? 0.5 : 1, cursor: !questions.length ? 'not-allowed' : 'pointer' }}
        >
          Next Question
        </button>
      </div>
      <p className="text-white/90 text-base leading-relaxed min-h-[32px]">
        {currentQuestion || <span className="text-white/50">Select a session to load questions</span>}
      </p>
    </div>
  );
};

export default QuestionPanel;
