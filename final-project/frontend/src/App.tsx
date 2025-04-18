import './App.css';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import Question from './components/Question';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'appkit-network-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function App() {
  const { isConnected } = useAccount();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Demo questions
  const questions = [
    {
      level: 1,
      text: "What is a blockchain?",
      options: [
        "A centralized database owned by a single company",
        "A distributed ledger technology that records transactions across multiple computers"
      ],
      correctOptionIndex: 1
    },
    {
      level: 2,
      text: "Which of these is NOT a property of most blockchain systems?",
      options: [
        "Data can be easily modified after being recorded",
        "Transactions are verified by a network of computers"
      ],
      correctOptionIndex: 0
    },
    {
      level: 3,
      text: "What is a smart contract?",
      options: [
        "A self-executing contract with the terms directly written into code",
        "A legal contract written by AI"
      ],
      correctOptionIndex: 0
    }
  ];
  
  const handleAnswer = (selectedIndex: number) => {
    const currentQuestion = questions[currentLevel - 1];
    const isCorrect = selectedIndex === currentQuestion.correctOptionIndex;
    
    if (isCorrect && currentLevel < questions.length) {
      // Move to next question after a delay
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, 1000);
    } else if (isCorrect && currentLevel === questions.length) {
      // User completed all questions
      setHasAnswered(true);
    } else {
      // Incorrect answer
      console.log("Incorrect answer!");
      // You could add logic to retry or restart
    }
  };
  
  return (
    <>
      <header className="header">
        <div className="left-section">
          <div className="logo">
            <img src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" alt="Logo" />
          </div>
        </div>
        
        <div className="center-section">
          <div className="app-name">
            <h1>QuizChain</h1>
          </div>
        </div>
        
        <div className="right-section">
          {isConnected && (
            <div className="network-selector">
              <appkit-network-button />
            </div>
          )}
          <div className="wallet-connect">
            <appkit-button />
          </div>
        </div>
      </header>

      <main className="main-content">
        {!isConnected && (
          <div className="connect-prompt">
            <h2>Welcome to QuizChain!</h2>
            <p>Connect your wallet to participate in the game and access all features.</p>
            <div className="main-connect-button">
              <appkit-button />
            </div>
          </div>
        )}
        
        {isConnected && !hasAnswered && (
          <div className="game-content">
            <Question 
              level={currentLevel}
              text={questions[currentLevel - 1].text}
              options={questions[currentLevel - 1].options}
              onAnswer={handleAnswer}
            />
          </div>
        )}
        
        {isConnected && hasAnswered && (
          <div className="game-content">
            <h2>Congratulations!</h2>
            <p>You've completed all questions successfully!</p>
            <p>Your NFT reward is being processed...</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;