import dotenv from "dotenv";
import { hardhat } from "viem/chains";

dotenv.config();

const port = process.env.PORT || 8001;
const mongodb_uri = process.env.MONGODB_URI;
const reownProjectId = process.env.REOWN_PROJECT_ID;
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS || "";
const ownerPrivateKey = (process.env.OWNER_PRIVATE_KEY || "") as `0x${string}`;
const chain = hardhat;

if (!ownerPrivateKey || !nftContractAddress) {
  throw new Error("some env not found");
}
export {
  port,
  mongodb_uri,
  reownProjectId,
  nftContractAddress,
  ownerPrivateKey,
  chain,
};
