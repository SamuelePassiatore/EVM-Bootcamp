import {
  createPublicClient,
  PublicClient,
  WalletClient,
  http,
  getAddress,
  createWalletClient,
  Chain,
  stringToHex,
} from "viem";
import NFTReward from "../schema/NFTReward";
import User from "../schema/user";
import multiavatar from "@multiavatar/multiavatar";
import * as contractJson from "../shared/artifacts/contracts/QnAReward.sol/QnAReward.json";
import { privateKeyToAccount } from "viem/accounts";

type NFTMetadata = {
  name: string;
  description: string;
  image: string;
};

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
    this.ownerPrivateKey = _ownerPrivateKey;
    this.publicClient = createPublicClient({ chain: chain, transport: http() });
    this.walletClient = createWalletClient({ chain: chain, transport: http() });
  }

  async rewardNFT(userId: string, level: number) {
    const avatarString = `userId: ${userId} level: ${level}`;
    const avatar = multiavatar(avatarString);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const account = privateKeyToAccount(stringToHex(this.ownerPrivateKey));
    const { request, result } = await this.publicClient.simulateContract({
      account,
      address: getAddress(this.contractAddress),
      abi: contractJson.abi,
      functionName: "safeMint",
      args: [user.walletAddress, avatarString],
    });
    const trxHash = await this.walletClient.writeContract(request);
    await this.publicClient.waitForTransactionReceipt({ hash: trxHash });
    const reward = await NFTReward.insertOne({
      level,
      svgCode: avatar,
      tokenId: result,
      userId,
      name: avatarString,
      description: "nft reward",
    });

    return reward;
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
    const metadata: NFTMetadata = {
      name: nft.name,
      description: nft.description,
      image: nft.svgCode,
    };
    return metadata;
  }
}
