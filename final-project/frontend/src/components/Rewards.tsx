import { FC, useEffect, useState } from "react";
import { INFTReward } from "../shared/interface";
import { fetchRewards } from "../services/api";

const Rewards: FC = () => {
  const [rewards, setRewards] = useState<INFTReward[]>([]);

  useEffect(() => {
    (async () => {
      const rewards = await fetchRewards();
      setRewards(rewards);
    })();
  }, []);

  return (
    <div className="rewards-container">
      <h2>Available Rewards</h2>
      <table className="rewards-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {rewards.length > 0 ? (
            rewards.map((reward) => (
              <tr key={reward.id}>
                <td>{reward.name}</td>
                <td>{reward.description}</td>
                <td>{reward.image}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No rewards available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { Rewards };
