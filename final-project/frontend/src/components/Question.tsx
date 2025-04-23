import React, { useState, useEffect } from 'react';
import { reportWrongAnswer } from '../services/api';

interface QuestionProps {
  level: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  onAnswer: (selectedIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  level,
  text,
  options,
  correctOptionIndex,
  onAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{message: string, isCorrect: boolean} | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Reset state when level changes
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setShowNextButton(false);
    setIsSubmitting(false);
    setHasError(false);
  }, [level]);
  
  // Check for existing block in localStorage
  useEffect(() => {
    try {
      const storedBlockData = localStorage.getItem('questionBlock');
      if (storedBlockData) {
        const blockData = JSON.parse(storedBlockData);
        const endTime = new Date(blockData.blockedUntil);
        
        if (endTime > new Date()) {
          setIsBlocked(true);
          setBlockedUntil(endTime);
          
          // Calculate initial time remaining
          const diffMs = endTime.getTime() - new Date().getTime();
          setTimeRemaining(Math.max(0, Math.floor(diffMs / 1000)));
        } else {
          localStorage.removeItem('questionBlock');
        }
      }
    } catch (error) {
      console.error("Error checking block status:", error);
    }
  }, []);
  
  // Timer effect for blocked state
  useEffect(() => {
    if (isBlocked && blockedUntil) {
      const timer = setInterval(() => {
        const now = new Date();
        const diffMs = blockedUntil.getTime() - now.getTime();
        const remaining = Math.max(0, Math.floor(diffMs / 1000));
        
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
    if (isBlocked || showNextButton || isSubmitting) return;
    
    setSelectedOption(index);
    setHasError(false); // Clear any previous errors
  };
  
  const handleSubmitClick = async () => {
    if (selectedOption === null || isSubmitting) return;
    
    setIsSubmitting(true);
    setHasError(false);
    
    try {
      const isCorrect = selectedOption === correctOptionIndex;
      
      setFeedback({
        message: isCorrect
          ? "Correct answer! 🎉"
          : "Wrong answer, try again after the cooldown period ❌",
        isCorrect
      });
      
      if (isCorrect) {
        setShowNextButton(true);
      } else {
        // Report wrong answer to the backend
        const response = await reportWrongAnswer();
        
        // Set block with the time from the server response if available
        const now = new Date();
        const blockDuration = 60000; // 1 minute default
        
        let blockEndTime;
        if (response && response.blockedUntil) {
          blockEndTime = new Date(response.blockedUntil);
        } else {
          blockEndTime = new Date(now.getTime() + blockDuration);
        }
        
        localStorage.setItem('questionBlock', JSON.stringify({
          blockedUntil: blockEndTime.toISOString()
        }));
        
        setIsBlocked(true);
        setBlockedUntil(blockEndTime);
      }
    } catch (error) {
      console.error("Failed to handle answer:", error);
      setHasError(true);
      setFeedback({
        message: "Something went wrong. Please try again.",
        isCorrect: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNextClick = () => {
    onAnswer(selectedOption!);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Rendering blocked state
  if (isBlocked) {
    return (
      <div className="question-container">
        <div className="question-level">Level {level}</div>
        <div className="blocked-message">
          <h3>Wrong answer!</h3>
          <p>You must wait before you can try again.</p>
          <div className="timer">
            <p>Time remaining: {formatTime(timeRemaining)}</p>
          </div>
        </div>
      </div>
    );
  }
  
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
            disabled={showNextButton || isSubmitting}
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
      
      {hasError && !feedback && (
        <div className="feedback-message incorrect">
          Error submitting answer. Please try again.
        </div>
      )}
      
      {selectedOption !== null && !showNextButton && (
        <button 
          className={`submit-button ${isSubmitting ? 'loading' : ''}`} 
          onClick={handleSubmitClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-small"></span>
              Submitting...
            </>
          ) : (
            "Submit Answer"
          )}
        </button>
      )}
      
      {showNextButton && (
        <button className="next-button" onClick={handleNextClick}>
          Next Question
        </button>
      )}
    </div>
  );
};

export default Question;