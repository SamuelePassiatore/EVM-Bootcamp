import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";
const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const MY_TOKEN_ADDRESS = "0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e";

async function main() {
  console.log("Delegating voting power...");

  // Get the public client and wallet clients
  const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
      account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Check we have the token address
  if (!MY_TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
  }

  // Get the address to delegate to (default to self-delegation)
  const delegateeAddress = deployer.account.address;
  
  try {
    // Get the MyToken contract instance
    const tokenContract = await viem.getContractAt("MyToken", MY_TOKEN_ADDRESS as `0x${string}`);
    
    console.log(`Token contract address: ${tokenContract.address}`);
    console.log(`Voter address: ${deployer.account.address}`);
    console.log(`Delegating to: ${delegateeAddress}`);

    // Check voting power before delegation
    const votesBefore = await tokenContract.read.getVotes([deployer.account.address]);
    console.log(`Voter's voting power before delegation: ${votesBefore}`);
    
    // Check delegatee's voting power before
    const delegateeVotesBefore = await tokenContract.read.getVotes([delegateeAddress]);
    console.log(`Delegatee's voting power before: ${delegateeVotesBefore}`);

    // Delegate votes
    const delegateTx = await tokenContract.write.delegate(
      [delegateeAddress],
      { account: deployer.account }
    );
    console.log(`Delegation transaction hash: ${delegateTx}`);
    
    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Check voting power after delegation
    const votesAfter = await tokenContract.read.getVotes([deployer.account.address]);
    console.log(`Voter's voting power after delegation: ${votesAfter}`);
    
    // Check delegatee's voting power after
    const delegateeVotesAfter = await tokenContract.read.getVotes([delegateeAddress]);
    console.log(`Delegatee's voting power after: ${delegateeVotesAfter}`);
    
    // Check delegates
    const delegates = await tokenContract.read.delegates([deployer.account.address]);
    console.log(`Voter is now delegating to: ${delegates}`);
  } catch (error) {
    console.error("Error delegating votes:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});