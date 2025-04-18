import React, { useState } from 'react';

interface QuestionProps {
  level: number;
  text: string;
  options: string[];
  onAnswer: (selectedIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({ level, text, options, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    
    const handleOptionClick = (index: number) => {
      setSelectedOption(index);
    };
    
    const handleNextClick = () => {
      if (selectedOption !== null) {
        onAnswer(selectedOption);
        setSelectedOption(null);
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
        {selectedOption !== null && (
          <button className="next-button" onClick={handleNextClick}>
            Next Question
          </button>
        )}
      </div>
    );
  };

export default Question;