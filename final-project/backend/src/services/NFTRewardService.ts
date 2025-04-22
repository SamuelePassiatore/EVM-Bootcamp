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

export default class NFTService {
  contractAddress: string;
  ownerPrivateKey: string;
  publicClient: PublicClient;
  walletClient: WalletClient;
  constructor(
    _contractAddress: string,
    _ownerPrivateKey: string,
    chain: Chain,
  ) {
    this.contractAddress = _contractAddress;
    this.ownerPrivateKey = _ownerPrivateKey as `0x${string}`;
    this.publicClient = createPublicClient({ chain: chain, transport: http() });
    this.walletClient = createWalletClient({ chain: chain, transport: http() });
  }

  async rewardNFT(userId: string, level: number) {
    // Generate a consistent avatar based on user ID and level
    const avatarString = `userId: ${userId} level: ${level}`;
    const avatar = multiavatar(avatarString);
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Set up the account for contract interaction
    const account = privateKeyToAccount(this.ownerPrivateKey as `0x${string}`);
    
    // Simulate the contract call first
    const { request, result } = await this.publicClient.simulateContract({
      account,
      address: getAddress(this.contractAddress),
      abi: contractJson.abi,
      functionName: "safeMint",
      args: [user.walletAddress, avatarString],
    });
    
    // Execute the actual transaction
    const trxHash = await this.walletClient.writeContract(request);
    
    // Wait for transaction confirmation
    await this.publicClient.waitForTransactionReceipt({ hash: trxHash });
    
    // Create a new NFT reward in the database
    const newReward = new NFTReward({
      level,
      svgCode: avatar,
      tokenId: String(result),
      userId,
      name: `Level ${level} Reward`,
      description: `NFT reward for completing level ${level}`,
    });
    
    // Save the new reward
    await newReward.save();
    
    // Update user to mark NFT as minted
    await User.findByIdAndUpdate(userId, { mintedNFT: true });
    
    return newReward;
  }

  async allNFTs(userId: string) {
    const nfts = await NFTReward.find({ userId });
    return nfts;
  }
  
  async getNftMetadata(tokenId: string) {
    const nft = await NFTReward.findOne({ tokenId });
    if (!nft) {
      return null;
    }
    
    return {
      name: nft.name,
      description: nft.description,
      image: nft.svgCode,
    };
  }
}