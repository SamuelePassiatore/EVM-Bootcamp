import "./App.css";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { fetchQuestions, updateLastLevel, mintNFT } from "./services/api";
import Question from "./components/Question";
import { Question as QuestionType } from "./types";
import { Rewards } from "./components/Rewards";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "appkit-network-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function App() {
  const { isConnected } = useAccount();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleAnswer = async (selectedIndex: number) => {
    const currentQuestion = questions.find((q) => q.level === currentLevel);
    if (!currentQuestion) return;

    const isCorrect = selectedIndex === currentQuestion.correctOptionIndex;

    if (isCorrect) {
      const hasNextQuestion = questions.some(
        (q) => q.level === currentLevel + 1,
      );

      try {
        // Aggiorna l'ultimo livello completato sul backend
        await updateLastLevel(currentLevel);

        if (hasNextQuestion) {
          setTimeout(() => setCurrentLevel((prev) => prev + 1), 1000);
        } else {
          setHasAnswered(true);
        }
      } catch (error) {
        console.error("Failed to update last level:", error);
      }
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);

        if (data.length > 0) {
          const initialLevel = data[0].level;
          setCurrentLevel(initialLevel);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load questions",
        );
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleMintNFT = async () => {
    setIsMinting(true);
    try {
      // Call the backend API to mint the NFT with the current level
      const result = await mintNFT(currentLevel);
      console.log("NFT minted successfully:", result);
      
      setMintSuccess(true);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const currentQuestion = questions.find((q) => q.level === currentLevel);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <div className="left-section">
          <div className="logo">
            <img
              src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040"
              alt="Logo"
            />
          </div>
        </div>

        <div className="center-section">
          <div className="app-name">
            <h1>QuizChain</h1>
          </div>
        </div>

        <div className="right-section">
          <div className="network-selector">
            <appkit-network-button />
          </div>
          <div className="wallet-connect">
            <appkit-button />
          </div>
        </div>
      </header>

      <main className="main-content">
        {!isConnected ? (
          <div className="connect-prompt">
            <h2>Welcome to QuizChain!</h2>
            <p>
              Connect your wallet to participate in the game and access all
              features.
            </p>
            <div className="main-connect-button">
              <appkit-button />
            </div>
          </div>
        ) : hasAnswered ? (
          <div className="completion-screen">
            <h2>Congratulations!</h2>
            <p>You've completed all questions successfully!</p>
            
            {!mintSuccess ? (
              <button 
                className="mint-nft-button" 
                onClick={handleMintNFT}
                disabled={isMinting}
              >
                {isMinting ? "MINTING..." : "MINT NFT"}
              </button>
            ) : (
              <div className="mint-success">
                <p>NFT successfully minted! 🎉</p>
                <p>Check your wallet to see your new QuizChain achievement NFT.</p>
              </div>
            )}
          </div>
        ) : currentQuestion ? (
          <>
            <div className="game-content">
              <Question
                level={currentQuestion.level}
                text={currentQuestion.text}
                options={currentQuestion.options}
                correctOptionIndex={currentQuestion.correctOptionIndex}
                onAnswer={handleAnswer}
              />
            </div>
            <div className="game-content">
              <Rewards />
            </div>
          </>
        ) : (
          <div className="no-questions">
            <p>No questions available</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;