import React, { useState } from 'react';

interface QuestionProps {
  level: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  onAnswer: (selectedIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({ level, text, options, correctOptionIndex, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{message: string, isCorrect: boolean} | null>(null);
  
  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setFeedback(null);
  };
  
  const handleNextClick = () => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption === correctOptionIndex;
      setFeedback({
        message: isCorrect ? "Correct answer! 🎉" : "Wrong answer, try again! ❌",
        isCorrect
      });
      
      if (isCorrect) {
        setTimeout(() => {
          onAnswer(selectedOption);
          setSelectedOption(null);
          setFeedback(null);
        }, 1000);
      }
    }
  };
  
  return (
    <div className="question-container">
      <div className="question-level">Level {level}</div>
      <div className="question-text">{text}</div>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </button>
        ))}
      </div>
      
      {feedback && (
        <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          {feedback.message}
        </div>
      )}
      
      {selectedOption !== null && (
        <button className="next-button" onClick={handleNextClick}>
          Submit Answer
        </button>
      )}
    </div>
  );
};

export default Question;