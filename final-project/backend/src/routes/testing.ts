import express from "express";
import { nftContractAddress, ownerPrivateKey, chain } from "../constants";
import NFTRewardService from "../services/NFTRewardService";
const router = express.Router();

const nftRewardService = new NFTRewardService(
  nftContractAddress,
  ownerPrivateKey,
  chain,
);

// only for testing
// example: http://localhost:8001/testing/redeem?userId=XXX&level=1
router.get("/redeem", async (req, res) => {
  const { userId, level } = req.query;

  const reward = await nftRewardService.rewardNFT(
    userId as string,
    Number(level),
  );

  res.json(reward);
});

// example: http://localhost:8001/testing/rewards?userId=XXX
router.get("/rewards", async (req, res) => {
  const { userId } = req.query;

  const rewards = await nftRewardService.allNFTs(userId as string);

  res.json(rewards);
});

// example: http://localhost:8001/testing/1
router.get("/:tokenId", async (req, res) => {
  const tokenId = req.params.tokenId;
  console.log(tokenId);
  const metadata = await nftRewardService.getNftMetadata(tokenId as string);

  res.json(metadata);
});

export default router;
