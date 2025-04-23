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
      
      const metadata = {
        name: `Level ${level} Achievement`,
        description: "NFT Reward for reaching level " + level,
        image: `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`,
      };
    
      const tokenUri = `data:application/json,${encodeURIComponent(
        JSON.stringify(metadata),
      )}`;
      
      try {
        const { request, result } = await this.publicClient.simulateContract({
          address: getAddress(this.contractAddress),
          abi: contractJson.abi,
          functionName: "safeMint",
          args: [user.walletAddress, tokenUri],
          account: this.account,
        });

        const gasEstimate = await this.publicClient.estimateContractGas({
          ...request,
          account: this.account,
        });
      
        const trxHash = await this.walletClient.writeContract({
          ...request,
          account: this.account,
          gas: gasEstimate * BigInt(2),
        });
        console.log(`Transaction submitted: ${trxHash}`);
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash: trxHash });
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

        const reward = await NFTReward.insertOne({
          level,
          svgCode: avatar,
          tokenId: result,
          userId,
          name: metadata.name,
          description: metadata.description,
          createdAt: new Date(),
        });

        // Save the new reward
        await reward.save();
        console.log(`NFT reward saved to database with ID: ${reward._id}`);
        
        // Update user to mark NFT as minted
        await User.findByIdAndUpdate(userId, { mintedNFT: true });

        return reward;
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