import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";
const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const TOKENIZED_BALLOT_ADDRESS = "0x958192c1479731d3b3c554510c4cc1398628aafb";
const MY_TOKEN_ADDRESS = "0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e";

async function main() {
  console.log("Checking voting power...");

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
  
  // Check we have the required addresses
  if (!MY_TOKEN_ADDRESS) {
    throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
  }
  
  if (!TOKENIZED_BALLOT_ADDRESS) {
    throw new Error("Please set TOKENIZED_BALLOT_ADDRESS in your .env file");
  }
  
  // Set voter address (either from env or use deployer)
  const voterAddress = deployer.account.address;

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
    const balance = await tokenContract.read.balanceOf([voterAddress]);
    console.log(`Token balance: ${balance}`);
    
    // Check current voting power
    const currentVotes = await tokenContract.read.getVotes([voterAddress]);
    console.log(`Current voting power: ${currentVotes}`);
    
    // Check past voting power at target block
    const pastVotes = await tokenContract.read.getPastVotes([voterAddress, targetBlockNumber]);
    console.log(`Voting power at target block ${targetBlockNumber}: ${pastVotes}`);
    
    // Check remaining voting power in the ballot
    const remainingVotingPower = await ballotContract.read.getRemainingVotingPower([voterAddress]);
    console.log(`Remaining voting power in ballot: ${remainingVotingPower}`);
    
    // Check vote power spent
    const votePowerSpent = await ballotContract.read.votePowerSpent([voterAddress]);
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