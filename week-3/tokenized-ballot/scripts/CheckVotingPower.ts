import { viem } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const MY_TOKEN_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS ?? "";
const TOKENIZED_BALLOT_ADDRESS = process.env.TOKENIZED_BALLOT_ADDRESS ?? "";
const VOTER_ADDRESS = process.env.VOTER_ADDRESS ?? "";

async function main() {
  console.log("Checking voting power...");

  // Get the public client and wallet clients
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  
  // Check we have the required addresses
  if (!MY_TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
  }
  
  if (!TOKENIZED_BALLOT_ADDRESS) {
    throw new Error("Please set TOKENIZED_BALLOT_ADDRESS in your .env file");
  }
  
  // Set voter address (either from env or use deployer)
  const voterAddress = VOTER_ADDRESS || deployer.account.address;

  try {
    // Get the MyToken contract instance
    const tokenContract = await viem.getContractAt("MyToken", MY_TOKEN_ADDRESS as `0x${string}`);
    
    // Get the TokenizedBallot contract instance
    const ballotContract = await viem.getContractAt(
      "TokenizedBallot", 
      TOKENIZED_BALLOT_ADDRESS as `0x${string}`
    );
    
    console.log(`Token contract address: ${tokenContract.address}`);
    console.log(`Ballot contract address: ${ballotContract.address}`);
    console.log(`Voter address: ${voterAddress}`);

    // Get the current block number
    const currentBlock = await publicClient.getBlockNumber();
    console.log(`Current block number: ${currentBlock}`);
    
    // Get the target block number from the ballot contract
    const targetBlockNumber = await ballotContract.read.targetBlockNumber();
    console.log(`Ballot target block number: ${targetBlockNumber}`);
    
    // Check token balance
    const balance = await tokenContract.read.balanceOf([voterAddress as `0x${string}`]);
    console.log(`Token balance: ${balance}`);
    
    // Check current voting power
    const currentVotes = await tokenContract.read.getVotes([voterAddress as `0x${string}`]);
    console.log(`Current voting power: ${currentVotes}`);
    
    // Check past voting power at target block
    const pastVotes = await tokenContract.read.getPastVotes([voterAddress as `0x${string}`, targetBlockNumber]);
    console.log(`Voting power at target block ${targetBlockNumber}: ${pastVotes}`);
    
    // Check remaining voting power in the ballot
    const remainingVotingPower = await ballotContract.read.getRemainingVotingPower([voterAddress as `0x${string}`]);
    console.log(`Remaining voting power in ballot: ${remainingVotingPower}`);
    
    // Check vote power spent
    const votePowerSpent = await ballotContract.read.votePowerSpent([voterAddress as `0x${string}`]);
    console.log(`Vote power spent: ${votePowerSpent}`);
    
    console.log("\nVoting power details:");
    console.log(`- Total token balance: ${balance}`);
    console.log(`- Current active voting power: ${currentVotes}`);
    console.log(`- Voting power at target block: ${pastVotes}`);
    console.log(`- Power spent in ballot: ${votePowerSpent}`);
    console.log(`- Remaining power for ballot: ${remainingVotingPower}`);
  } catch (error) {
    console.error("Error checking voting power:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});