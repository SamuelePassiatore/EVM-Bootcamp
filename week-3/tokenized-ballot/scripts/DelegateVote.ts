import { viem } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const MY_TOKEN_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS ?? "";

async function main() {
  console.log("Delegating voting power...");

  // Get the public client and wallet clients
  const publicClient = await viem.getPublicClient();
  const [deployer, voter, delegatee] = await viem.getWalletClients();
  
  // Check we have the token address
  if (!MY_TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
  }

  // Get the address to delegate to (default to self-delegation)
  const delegateeAddress = process.env.DELEGATEE_ADDRESS ?? voter.account.address;
  
  try {
    // Get the MyToken contract instance
    const tokenContract = await viem.getContractAt("MyToken", MY_TOKEN_ADDRESS as `0x${string}`);
    
    console.log(`Token contract address: ${tokenContract.address}`);
    console.log(`Voter address: ${voter.account.address}`);
    console.log(`Delegating to: ${delegateeAddress}`);

    // Check voting power before delegation
    const votesBefore = await tokenContract.read.getVotes([voter.account.address]);
    console.log(`Voter's voting power before delegation: ${votesBefore}`);
    
    // Check delegatee's voting power before
    const delegateeVotesBefore = await tokenContract.read.getVotes([delegateeAddress as `0x${string}`]);
    console.log(`Delegatee's voting power before: ${delegateeVotesBefore}`);

    // Delegate votes
    const delegateTx = await tokenContract.write.delegate(
      [delegateeAddress as `0x${string}`],
      { account: voter.account }
    );
    console.log(`Delegation transaction hash: ${delegateTx}`);
    
    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Check voting power after delegation
    const votesAfter = await tokenContract.read.getVotes([voter.account.address]);
    console.log(`Voter's voting power after delegation: ${votesAfter}`);
    
    // Check delegatee's voting power after
    const delegateeVotesAfter = await tokenContract.read.getVotes([delegateeAddress as `0x${string}`]);
    console.log(`Delegatee's voting power after: ${delegateeVotesAfter}`);
    
    // Check delegates
    const delegates = await tokenContract.read.delegates([voter.account.address]);
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