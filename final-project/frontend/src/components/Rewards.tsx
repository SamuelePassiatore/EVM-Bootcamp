import { FC, useEffect, useState, useCallback } from "react";
import { fetchRewards } from "../services/api";
import NFTDisplay from "./NFTDisplay";

interface NFTReward {
  _id: string;
  tokenId: string;
  level: number;
  name: string;
  description: string;
  svgCode: string;
  createdAt: string;
}

interface RewardsProps {
  triggerRefresh?: number; // Optional prop to trigger refresh when it changes
}

export const Rewards: FC<RewardsProps> = ({ triggerRefresh = 0 }) => {
  const [rewards, setRewards] = useState<NFTReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRewards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchRewards();
      
      // Sort rewards by level
      const sortedRewards = [...data].sort((a, b) => a.level - b.level);
      setRewards(sortedRewards || []);
    } catch (err) {
      console.error("Failed to load rewards:", err);
      setError("Failed to load your NFT rewards. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load rewards on component mount and when triggerRefresh changes
  useEffect(() => {
    loadRewards();
  }, [loadRewards, triggerRefresh]);

  // If no rewards are available
  const renderEmptyState = () => (
    <div className="no-rewards">
      <img src="/quiz.png" alt="No rewards" className="empty-state-image" />
      <p>Complete quiz levels to earn exclusive NFT rewards!</p>
      <p className="empty-state-subtitle">Your achievements will be displayed here</p>
    </div>
  );

  return (
    <div className="your-nft-rewards">
      <h2>Your NFT Rewards</h2>
      
      {isLoading ? (
        <div className="loading-rewards">
          <div className="spinner"></div>
          <p>Loading your rewards...</p>
        </div>
      ) : error ? (
        <div className="rewards-error">
          <p>{error}</p>
          <button onClick={loadRewards} className="retry-button">
            Try Again
          </button>
        </div>
      ) : rewards.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <p className="rewards-count">
            You have earned {rewards.length} NFT{rewards.length !== 1 ? 's' : ''}!
          </p>
          <div className="rewards-grid">
            {rewards.map((reward) => (
              <NFTDisplay
                key={reward._id || reward.tokenId}
                level={reward.level}
                svgCode={reward.svgCode}
                tokenId={reward.tokenId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Rewards;