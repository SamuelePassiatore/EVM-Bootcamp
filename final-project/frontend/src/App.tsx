// /final-project/frontend/src/App.tsx
import "./App.css";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import {
  fetchQuestions,
  updateLastLevel,
  mintNFT,
  fetchUserData,
  fetchRewards,
  UserData
} from "./services/api";
import Question from "./components/Question";
import { Question as QuestionType } from "./types";
import { Rewards } from "./components/Rewards";
import ProgressBar from "./components/ProgressBar";
import NFTDisplay from "./components/NFTDisplay";
import ProfilePage from "./components/ProfilePage";

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
  const { isConnected, address } = useAccount();
  const [currentView, setCurrentView] = useState<'game' | 'profile'>('game');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMintingAnimating, setIsMintingAnimating] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<any>(null);
  const [nftPreview, setNftPreview] = useState<string>("");

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAnswer = async (selectedIndex: number) => {
    const currentQuestion = questions.find((q) => q.level === currentLevel);
    if (!currentQuestion) return;
  
    const isCorrect = selectedIndex === currentQuestion.correctOptionIndex;
  
    if (isCorrect) {
      try {
        const nextLevel = currentLevel + 1;
        console.log("Updating level from", currentLevel, "to", nextLevel);
        
        // Update user progress in the backend
        await updateLastLevel(nextLevel);
        
        // Check if there's a next question
        const hasNextQuestion = questions.some(q => q.level === nextLevel);
        
        if (hasNextQuestion) {
          console.log("Moving to next level:", nextLevel);
          setCurrentLevel(nextLevel); // This will trigger a re-render with the new question
        } else {
          console.log("No more questions, marking as completed");
          setHasAnswered(true); // Show completion screen
          // No automatic minting here - the user will need to click the button
        }
      } catch (error) {
        console.error("Failed to update level:", error);
        setError("Failed to update level. Please try again.");
      }
    }
  };

  const currentQuestion = questions.find((q) => q.level === currentLevel);

  // Generate NFT preview based on current level and user ID
  useEffect(() => {
    if (userData && userData.id) {
      // This would ideally come from the backend
      // But for simplicity, we'll use the multiavatar library if available
      import('@multiavatar/multiavatar').then(multiavatar => {
        const avatarString = `userId: ${userData.id} level: ${currentLevel}`;
        const avatarSvg = multiavatar.default(avatarString);
        setNftPreview(avatarSvg);
      }).catch(() => {
        console.log("Multiavatar library not available client-side");
      });
    }
  }, [currentLevel, userData]);

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
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

  // Load user data when connected
  useEffect(() => {
    const loadUserData = async () => {
      if (isConnected && questions.length > 0) {
        try {
          const user = await fetchUserData();
          setUserData(user);
          console.log("User data loaded:", user);
          
          if (user.questionLevel !== undefined && user.questionLevel !== null) {
            const maxLevel = Math.max(...questions.map(q => q.level));
            console.log("Max level:", maxLevel, "User level:", user.questionLevel);
            
            if (user.questionLevel > maxLevel) {
              setHasAnswered(true);
            } else {
              setCurrentLevel(user.questionLevel);
            }
          }
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      } else {
        setUserData(null);
      }
    };

    loadUserData();
  }, [isConnected, questions]);

  const handleMintNFT = async () => {
    setIsMinting(true);
    setIsMintingAnimating(true);
    try {
      // Call the backend API to mint the NFT with the current level
      const result = await mintNFT(currentLevel);
      console.log("NFT minted successfully:", result);
      
      // Fetch the newly minted NFT
      const rewards = await fetchRewards();
      const latestNFT = rewards.find(r => r.level === currentLevel);
      setMintedNFT(latestNFT);
      
      setMintSuccess(true);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    } finally {
      setIsMinting(false);
      setTimeout(() => setIsMintingAnimating(false), 1500);
    }
  };

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
        <div className="left-section" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" onClick={handleRefresh} style={{ cursor: 'pointer' }}>
            <img
              src="/quiz.png"
              alt="Logo"
            />
          </div>
          <h1 style={{ marginLeft: '10px' }}>QuizChain</h1>
        </div>

        <div className="center-section">
          <div className="app-name">
          </div>
        </div>

        <div className="right-section">
          {isConnected && (
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${currentView === 'game' ? 'active' : ''}`}
                onClick={() => setCurrentView('game')}
              >
                Game
              </button>
              <button 
                className={`nav-tab ${currentView === 'profile' ? 'active' : ''}`}
                onClick={() => setCurrentView('profile')}
              >
                Profile
              </button>
            </div>
          )}
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
        ) : currentView === 'profile' ? (
          <ProfilePage address={address as `0x${string}`} />
        ) : hasAnswered ? (
          <div className="completion-screen">
            <h2>Congratulations!</h2>
            <p>You've completed all questions successfully!</p>
            
            {!mintSuccess ? (
              <>
                <NFTDisplay
                  level={currentLevel}
                  svgCode={nftPreview}
                  isPreview={true}
                />
                
                <button
                  className={`mint-nft-button ${isMintingAnimating ? 'minting-animation' : ''}`}
                  onClick={handleMintNFT}
                  disabled={isMinting}
                >
                  {isMinting ? "MINTING..." : "MINT NFT"}
                </button>
              </>
            ) : (
              <div className="mint-success">
                <p>NFT successfully minted! 🎉</p>
                {mintedNFT && (
                  <div className="nft-preview" dangerouslySetInnerHTML={{ __html: mintedNFT.svgCode }} />
                )}
              </div>
            )}
          </div>
        ) : currentQuestion ? (
          <div className="game-container">
            {questions.length > 0 && (
              <ProgressBar 
                currentLevel={currentLevel}
                totalLevels={questions.length}
              />
            )}
            
            <div className="game-content">
              <Question
                level={currentQuestion.level}
                text={currentQuestion.text}
                options={currentQuestion.options}
                correctOptionIndex={currentQuestion.correctOptionIndex}
                onAnswer={handleAnswer}
              />
            </div>
            <Rewards />
          </div>
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