import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";
const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const TOKENIZED_BALLOT_ADDRESS = "0x958192c1479731d3b3c554510c4cc1398628aafb";
const PROPOSAL_ID = Math.floor(Math.random() * 3); // Randomly selects 0, 1, or 2
const VOTE_AMOUNT = BigInt(Math.floor(Math.random() * 10) + 1); // Random vote amount between 1 and 100

async function main() {
  console.log("Casting vote...");

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
  
  // Check we have the ballot address
  if (!TOKENIZED_BALLOT_ADDRESS) {
    throw new Error("Please set TOKENIZED_BALLOT_ADDRESS in your .env file");
  }

  try {
    // Get the TokenizedBallot contract instance
    const ballotContract = await viem.getContractAt(
      "TokenizedBallot",
      TOKENIZED_BALLOT_ADDRESS as `0x${string}`
    );
    
    console.log(`TokenizedBallot contract address: ${ballotContract.address}`);
    console.log(`Voter address: ${deployer.account.address}`);
    console.log(`Proposal ID: ${PROPOSAL_ID}`);
    console.log(`Vote amount: ${VOTE_AMOUNT}`);

    // Get the token contract address
    const tokenContractAddress = await ballotContract.read.tokenContract();
    console.log(`Token contract address: ${tokenContractAddress}`);
    
    // Get the target block number
    const targetBlockNumber = await ballotContract.read.targetBlockNumber();
    console.log(`Target block number: ${targetBlockNumber}`);

    // Get proposal information before voting
    const proposalBefore = await ballotContract.read.proposals([BigInt(PROPOSAL_ID)]);
    console.log(`Proposal ${PROPOSAL_ID} vote count before: ${proposalBefore[1]}`);

    // Cast vote
    const voteTx = await ballotContract.write.vote(
      [BigInt(PROPOSAL_ID), VOTE_AMOUNT],
      { account: deployer.account }
    );
    console.log(`Vote transaction hash: ${voteTx}`);
    
    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash: voteTx });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Check proposal vote count after voting
    const proposalAfter = await ballotContract.read.proposals([BigInt(PROPOSAL_ID)]);
    console.log(`Proposal ${PROPOSAL_ID} vote count after: ${proposalAfter[1]}`);
    
    // Check remaining voting power after voting
    const votePowerAfter = await ballotContract.read.getRemainingVotingPower([deployer.account.address]);
    console.log(`Remaining voting power after voting: ${votePowerAfter}`);
  } catch (error: unknown) {
    console.error("Error casting vote:");
    
    // Type-safe error handling
    if (error instanceof Error) {
      console.error(error.message);
      
      // If it's a contract revert, show the revert reason if possible
      if (error.message?.includes("revert")) {
        console.error("Revert reason:", error.message);
      }
    } else {
      console.error(String(error));
    }
    
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});