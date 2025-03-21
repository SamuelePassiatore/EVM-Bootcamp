import { viem } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENIZED_BALLOT_ADDRESS = process.env.TOKENIZED_BALLOT_ADDRESS ?? "";
const PROPOSAL_ID = process.env.PROPOSAL_ID ? parseInt(process.env.PROPOSAL_ID) : 0;
const VOTE_AMOUNT = process.env.VOTE_AMOUNT ? BigInt(process.env.VOTE_AMOUNT) : 1n;

async function main() {
  console.log("Casting vote...");

  // Get the public client and wallet clients
  const publicClient = await viem.getPublicClient();
  const [deployer, voter] = await viem.getWalletClients();
  
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
    console.log(`Voter address: ${voter.account.address}`);
    console.log(`Proposal ID: ${PROPOSAL_ID}`);
    console.log(`Vote amount: ${VOTE_AMOUNT}`);

    // Get the token contract address
    const tokenContractAddress = await ballotContract.read.tokenContract();
    console.log(`Token contract address: ${tokenContractAddress}`);
    
    // Get the target block number
    const targetBlockNumber = await ballotContract.read.targetBlockNumber();
    console.log(`Target block number: ${targetBlockNumber}`);
    
    // Check remaining voting power
    const votePower = await ballotContract.read.getRemainingVotingPower([voter.account.address]);
    console.log(`Remaining voting power: ${votePower}`);
    
    if (votePower < VOTE_AMOUNT) {
      console.error(`Error: Not enough voting power. Required: ${VOTE_AMOUNT}, Available: ${votePower}`);
      process.exit(1);
    }

    // Get proposal information before voting
    const proposalBefore = await ballotContract.read.proposals([BigInt(PROPOSAL_ID)]);
    console.log(`Proposal ${PROPOSAL_ID} vote count before: ${proposalBefore[1]}`);

    // Cast vote
    const voteTx = await ballotContract.write.vote(
      [BigInt(PROPOSAL_ID), VOTE_AMOUNT],
      { account: voter.account }
    );
    console.log(`Vote transaction hash: ${voteTx}`);
    
    // Wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt({ hash: voteTx });
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Check proposal vote count after voting
    const proposalAfter = await ballotContract.read.proposals([BigInt(PROPOSAL_ID)]);
    console.log(`Proposal ${PROPOSAL_ID} vote count after: ${proposalAfter[1]}`);
    
    // Check remaining voting power after voting
    const votePowerAfter = await ballotContract.read.getRemainingVotingPower([voter.account.address]);
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