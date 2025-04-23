import {
  createPublicClient,
  PublicClient,
  WalletClient,
  http,
  getAddress,
  createWalletClient,
  Chain,
} from "viem";
import NFTReward from "../schema/NFTReward";
import User from "../schema/user";
import multiavatar from "@multiavatar/multiavatar";
import * as contractJson from "../shared/artifacts/contracts/QnAReward.sol/QnAReward.json";
import { privateKeyToAccount } from "viem/accounts";

export default class NFTRewardService {
  contractAddress: string;
  ownerPrivateKey: string;
  publicClient: PublicClient;
  walletClient: WalletClient;
  chain!: Chain;
  account: any;
  
  constructor(
    _contractAddress: string,
    _ownerPrivateKey: string,
    chain: Chain,
  ) {
    if (!_contractAddress || !_ownerPrivateKey) {
      throw new Error("Contract address and owner private key are required");
    }
    
    this.contractAddress = _contractAddress;
    this.ownerPrivateKey = _ownerPrivateKey;
    
    // Create public client
    this.publicClient = createPublicClient({
      chain: chain,
      transport: http()
    });
    
    // Create account from private key
    this.account = privateKeyToAccount(this.ownerPrivateKey as `0x${string}`);
    
    // Create wallet client with the account
    this.walletClient = createWalletClient({
      account: this.account,
      chain: chain,
      transport: http()
    });
    
    console.log(`NFT Service initialized with contract: ${this.contractAddress}`);
  }

  /**
   * Award an NFT to a user for completing a level
   * @param userId - Database ID of the user
   * @param level - Level completed
   * @returns The newly created NFT reward
   */
  async rewardNFT(userId: string, level: number) {
    try {
      console.log(`Starting NFT minting process for user ${userId} at level ${level}`);
      
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User not found with ID: ${userId}`);
      }
      
      // Check if user has completed this level
      if (user.questionLevel < level) {
        throw new Error(`User has not completed level ${level} yet`);
      }
      
      // Check if user already has an NFT for this level
      const existingNFT = await NFTReward.findOne({ userId, level });
      if (existingNFT) {
        console.log(`User already has an NFT for level ${level}`);
        return existingNFT;
      }
      
      // Generate a consistent avatar based on user ID and level
      const avatarString = `userId: ${userId} level: ${level}`;
      const avatar = multiavatar(avatarString);
      
      console.log(`Minting NFT for wallet ${user.walletAddress}`);
      
      // Prepare metadata URI - in a real app, this would point to a JSON file
      const tokenURI = `data:application/json,{"name":"Level ${level} Reward","description":"NFT reward for completing level ${level}"}`;
      
      try {
        // Call mint function on the contract
        const hash = await this.walletClient.writeContract({
          chain: this.chain,
          address: getAddress(this.contractAddress),
          abi: contractJson.abi,
          functionName: 'safeMint',
          args: [getAddress(user.walletAddress), tokenURI],
          account: this.account,
        });
        
        console.log(`Transaction submitted: ${hash}`);
        
        // Wait for transaction confirmation
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        
        // For simplicity, use the block timestamp as the token ID
        // In production, you would parse the Transfer event from the logs
        const tokenId = receipt.blockNumber.toString();
        
        // Create a new NFT reward in the database
        const newReward = new NFTReward({
          level,
          svgCode: avatar,
          tokenId,
          userId,
          name: `Level ${level} Reward`,
          description: `NFT reward for completing level ${level}`,
          createdAt: new Date(),
        });
        
        // Save the new reward
        await newReward.save();
        console.log(`NFT reward saved to database with ID: ${newReward._id}`);
        
        // Update user to mark NFT as minted
        await User.findByIdAndUpdate(userId, { mintedNFT: true });
        
        return newReward;
      } catch (error) {
        console.error("Error in contract interaction:", error);
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown contract error";
        throw new Error(`Contract interaction failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error in rewardNFT:", error);
      throw error;
    }
  }

  /**
   * Get all NFTs for a user
   * @param userId - Database ID of the user
   * @returns Array of NFT rewards
   */
  async allNFTs(userId: string) {
    try {
      console.log(`Fetching all NFTs for user ${userId}`);
      const nfts = await NFTReward.find({ userId }).sort({ level: 1 });
      return nfts;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      throw error;
    }
  }
  
  /**
   * Get metadata for a specific NFT
   * @param tokenId - Token ID of the NFT
   * @returns NFT metadata or null if not found
   */
  async getNftMetadata(tokenId: string) {
    try {
      console.log(`Fetching metadata for token ${tokenId}`);
      const nft = await NFTReward.findOne({ tokenId });
      
      if (!nft) {
        console.log(`NFT with token ID ${tokenId} not found`);
        return null;
      }
      
      // Return metadata in standard format
      return {
        name: nft.name,
        description: nft.description,
        image: nft.svgCode,
        attributes: [
          {
            trait_type: "Level",
            value: nft.level
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      throw error;
    }
  }
}