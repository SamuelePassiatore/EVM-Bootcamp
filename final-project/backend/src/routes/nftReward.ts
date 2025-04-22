import express from "express";
import { nftContractAddress, ownerPrivateKey, chain } from "../constants";
import NFTRewardService from "../services/NFTRewardService";
import User from "../schema/user";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

const nftRewardService = new NFTRewardService(
  nftContractAddress,
  ownerPrivateKey,
  chain,
);

// only for testing
// example: http://localhost:8001/testing/redeem?userId=XXX&level=1
router.post("/redeem", isAuthenticated, async (req, res): Promise<void> => {
  try {
    const { level } = req.query;
    const userId = req.session.siwe?.userId!;
    
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    
    const reward = await nftRewardService.rewardNFT(userId, Number(level));
    await User.findByIdAndUpdate(userId, { mintedNFT: true }, { new: true });
    console.log(`User ${userId} has minted an NFT for level ${Number(level)}`);
    res.json(reward);
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// example: http://localhost:8001/testing/rewards?userId=XXX
router.get("/rewards", isAuthenticated, async (req, res): Promise<void> => {
  try {
    const userId = req.session.siwe?.userId;
    
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    
    console.log(`Fetching rewards for user ${userId}`);
    const rewards = await nftRewardService.allNFTs(userId);
    res.json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error fetching rewards",
    });
  }
});

// example: http://localhost:8001/testing/1
router.get("/:tokenId", async (req, res): Promise<void> => {
  const tokenId = req.params.tokenId;
  try {
    const metadata = await nftRewardService.getNftMetadata(tokenId);
    
    if (!metadata) {
      res.status(404).json({ message: "NFT not found" });
      return;
    }
    
    res.json(metadata);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error fetching NFT metadata",
    });
  }
});

export default router;