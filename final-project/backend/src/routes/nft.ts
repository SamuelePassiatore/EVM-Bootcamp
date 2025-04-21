import express from 'express';
import { mintNFTReward } from '../lib/contract';
import User from '../schema/user';

const router = express.Router();

router.post('/mint-reward', async (req, res) => {
    try {
        if (!req.session.siwe?.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
        }

        const { level } = req.body;
        
        if (typeof level !== 'number' || level < 1) {
        return res.status(400).json({ message: 'Invalid level' });
        }
        
        // Get user wallet address
        const user = await User.findById(req.session.siwe.userId);
        
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if user has completed this level
        if (user.lastCompletedLevel < level) {
        return res.status(403).json({ message: 'Level not completed yet' });
        }
        
        // Mint the NFT
        const txHash = await mintNFTReward(user.walletAddress, level);
        
        res.status(200).json({
        success: true,
        txHash,
        message: 'NFT reward minted successfully!'
        });
        
    } catch (error) {
        console.error('Error minting NFT reward:', error);
        res.status(500).json({
        message: error instanceof Error ? error.message : 'Error minting NFT reward'
        });
    }
});

export default router;