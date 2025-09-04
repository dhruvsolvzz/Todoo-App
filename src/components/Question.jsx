import { useState, useEffect } from 'react';

const Question = ({ question, options, selectedAnswer, onSelectAnswer, timeLeft, timerActive }) => {
  const [fadeIn, setFadeIn] = useState(false);
  
  // Trigger fade-in animation when question changes
  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [question]);
  
  return (
    <div className={`question-container ${fadeIn ? 'fade-in' : ''}`}>
      <h2 className="question" aria-live="polite">{question}</h2>
      <div className="options" role="radiogroup" aria-labelledby="options-label">
        <span id="options-label" className="sr-only">Select one answer:</span>
        {options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedAnswer === option ? 'selected' : ''} ${!timerActive && timeLeft === 0 ? 'disabled' : ''}`}
            onClick={() => onSelectAnswer(option)}
            disabled={!timerActive && timeLeft === 0}
            aria-pressed={selectedAnswer === option}
            role="radio"
            aria-checked={selectedAnswer === option}
            tabIndex={0}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;