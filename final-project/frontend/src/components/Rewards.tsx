import { FC, useEffect, useState } from "react";
import { fetchRewards } from "../services/api";

interface NFTReward {
  _id: string;
  tokenId: string;
  level: number;
  name: string;
  description: string;
  svgCode: string;
}

export const Rewards: FC = () => {
  const [rewards, setRewards] = useState<NFTReward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRewards();
        setRewards(data || []);
      } catch (err) {
        console.error("Failed to load rewards:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, []);

  return (
    <div className="your-nft-rewards">
      <h2>Your NFT Rewards</h2>
      
      {isLoading ? (
        <div className="loading-rewards">Loading your rewards...</div>
      ) : rewards.length === 0 ? (
        <div className="no-rewards">
          <p>Complete quiz levels to earn exclusive NFT rewards!</p>
        </div>
      ) : (
        <div className="rewards-grid">
          {rewards.map((reward) => (
            <div key={reward._id || reward.tokenId} className="nft-display-card">
              <h3 className="nft-title">Level {reward.level} Achievement</h3>
              <div className="nft-image-frame">
                <div 
                  className="nft-image" 
                  dangerouslySetInnerHTML={{ __html: reward.svgCode }} 
                />
              </div>
              <div className="nft-details">
                <p className="nft-description">NFT Reward for Level {reward.level}</p>
                <div className="nft-id">#{reward.tokenId}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};