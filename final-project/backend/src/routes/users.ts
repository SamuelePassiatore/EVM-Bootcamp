import express from "express";
import User from "../schema/user";
import NFTReward from "../schema/NFTReward";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.get('/recent', async (req, res) => {
    try {
        // Find 10 most recent users
        const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10);
        
        // For each user, count their NFTs
        const usersWithNFTCount = await Promise.all(
        recentUsers.map(async (user) => {
            const nftCount = await NFTReward.countDocuments({ userId: user._id.toString() });
            return {
            id: user._id,
            walletAddress: user.walletAddress,
            questionLevel: user.questionLevel,
            createdAt: user.createdAt,
            nftCount
            };
        })
        );
        
        res.json(usersWithNFTCount);
    } catch (error) {
        console.error("Error fetching recent users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;