// /final-project/backend/src/routes/activity.ts
import express from 'express';
import User from '../schema/user';
import NFTReward from '../schema/NFTReward';

const router = express.Router();

router.get('/recent', async (req, res) => {
    try {
        // Get recent NFT mints
        const recentMints = await NFTReward.find()
        .sort({ createdAt: -1 })
        .limit(5);
        
        // Get recent new users
        const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5);
        
        // Combine and sort by timestamp
        const mintActivities = recentMints.map(nft => ({
        id: `mint-${nft._id}`,
        type: 'nft_mint',
        walletAddress: nft.userId, // This is actually the userId, not the wallet address
        details: {
            name: nft.name,
            level: nft.level,
            tokenId: nft.tokenId
        },
        timestamp: nft.createdAt
        }));
        
        // For each NFT mint activity, get the wallet address
        const mintActivitiesWithAddresses = await Promise.all(
        mintActivities.map(async (activity) => {
            const user = await User.findById(activity.walletAddress);
            return {
            ...activity,
            walletAddress: user ? user.walletAddress : 'Unknown'
            };
        })
        );
        
        const userActivities = recentUsers.map(user => ({
        id: `user-${user._id}`,
        type: 'new_player',
        walletAddress: user.walletAddress,
        details: {},
        timestamp: user.createdAt
        }));
        
        // Combine and sort
        const allActivities = [...mintActivitiesWithAddresses, ...userActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
        
        res.json(allActivities);
    } catch (error) {
        console.error("Error fetching activity feed:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;