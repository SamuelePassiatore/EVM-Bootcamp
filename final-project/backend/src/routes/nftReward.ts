import express from "express";
import { nftContractAddress, ownerPrivateKey, chain } from "../constants";
import NFTRewardService from "../services/NFTRewardService";
import User from "../schema/user";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

// Create a single instance of the NFT reward service
const nftRewardService = new NFTRewardService(
  nftContractAddress,
  ownerPrivateKey,
  chain,
);

/**
 * Mint a new NFT reward for completing a level
 * Endpoint: POST /nft/redeem?level=X
 */
router.post("/redeem", isAuthenticated, async (req, res): Promise<void> => {
  try {
    const { level } = req.query;
    const userId = req.session.siwe?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!level || isNaN(Number(level))) {
      res.status(400).json({ message: "Valid level parameter is required" });
      return;
    }

    const levelNum = Number(level);

    // Get user data to check if they've completed this level
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.questionLevel < levelNum) {
      res.status(403).json({
        message: "You haven't completed this level yet",
        currentLevel: user.questionLevel,
        requestedLevel: levelNum,
      });
      return;
    }

    // Mint the NFT reward
    const reward = await nftRewardService.rewardNFT(userId, levelNum);

    // Return the reward details
    res.status(200).json({
      success: true,
      message: "NFT reward minted successfully!",
      reward: {
        tokenId: reward.tokenId,
        level: reward.level,
        name: reward.name,
        description: reward.description,
        svgCode: reward.svgCode,
      },
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
});

/**
 * Get all NFT rewards for the authenticated user
 * Endpoint: GET /nft/rewards
 */
router.get("/rewards", isAuthenticated, async (req, res): Promise<void> => {
  try {
    const userId = req.session.siwe?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Get all NFTs for the user
    const rewards = await nftRewardService.allNFTs(userId);

    res.status(200).json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch rewards",
    });
  }
});

/**
 * Get metadata for a specific NFT
 * Endpoint: GET /nft/:tokenId
 */
router.get("/:tokenId", async (req, res): Promise<void> => {
  try {
    const { tokenId } = req.params;

    // Get metadata for the NFT
    const metadata = await nftRewardService.getNftMetadata(tokenId);

    if (!metadata) {
      res.status(404).json({ message: "NFT not found" });
      return;
    }

    res.status(200).json(metadata);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch NFT metadata",
    });
  }
});

export default router;