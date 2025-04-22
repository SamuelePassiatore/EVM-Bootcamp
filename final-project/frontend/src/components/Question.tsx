import React, { useState, useEffect } from 'react';
import { reportWrongAnswer } from '../services/api';

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
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setShowNextButton(false);
  }, [level]);
  
  useEffect(() => {
    const storedBlockData = localStorage.getItem('questionBlock');
    if (storedBlockData) {
      const blockData = JSON.parse(storedBlockData);
      const endTime = new Date(blockData.blockedUntil);
      
      if (endTime > new Date()) {
        setIsBlocked(true);
        setBlockedUntil(endTime);
      } else {
        localStorage.removeItem('questionBlock');
      }
    }
  }, []);
  
  useEffect(() => {
    if (isBlocked && blockedUntil) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const diffMs = blockedUntil.getTime() - now.getTime();
        return Math.max(0, Math.floor(diffMs / 1000));
      };
      
      setTimeRemaining(calculateTimeRemaining());
      
      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(timer);
          setIsBlocked(false);
          setBlockedUntil(null);
          localStorage.removeItem('questionBlock');
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isBlocked, blockedUntil]);
  
  const handleOptionClick = (index: number) => {
    if (isBlocked) return;
    setSelectedOption(index);
  };
  
  const handleSubmitClick = async () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === correctOptionIndex;
    setFeedback({
      message: isCorrect ? "Correct answer! 🎉" : "Wrong answer, try again! ❌",
      isCorrect
    });
    
    if (isCorrect) {
      setShowNextButton(true);
    } else {
      try {
        // Report wrong answer to the backend
        await reportWrongAnswer();
        
        const now = new Date();
        const blockDuration = 60000; // 1 minute
        const endTime = new Date(now.getTime() + blockDuration);
        
        localStorage.setItem('questionBlock', JSON.stringify({
          blockedUntil: endTime.toISOString()
        }));
        
        setIsBlocked(true);
        setBlockedUntil(endTime);
      } catch (error) {
        console.error("Failed to handle wrong answer:", error);
      }
    }
  };
  
  const handleNextClick = () => {
    onAnswer(selectedOption!);
    setSelectedOption(null);
    setFeedback(null);
    setShowNextButton(false);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="question-container">
      <div className="question-level">Level {level}</div>
      
      {isBlocked ? (
        <div className="blocked-message">
          <h3>Wrong answer!</h3>
          <p>You must wait before you can answer again.</p>
          <div className="timer">
            <p>Time remaining: {formatTime(timeRemaining)}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="question-text">{text}</div>
          <div className="options-container">
            {options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleOptionClick(index)}
                disabled={showNextButton}
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
          
          {selectedOption !== null && !showNextButton && (
            <button className="submit-button" onClick={handleSubmitClick}>
              Submit Answer
            </button>
          )}
          
          {showNextButton && (
            <button className="next-button" onClick={handleNextClick}>
              Next Question
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Question;