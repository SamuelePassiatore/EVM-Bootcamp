import { viem } from "hardhat";
import { hexToString } from "viem";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENIZED_BALLOT_ADDRESS = "0x958192c1479731d3b3c554510c4cc1398628aafb";

// Function to convert bytes32 to string
function bytes32ToString(bytes32: `0x${string}`): string {
  // Convert hex to string and remove trailing zeros
  return hexToString(bytes32).replace(/\0/g, '');
}

async function main() {
  console.log("Querying voting results...");

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
    
    // Get the token contract address
    const tokenContractAddress = await ballotContract.read.tokenContract();
    console.log(`Token contract address: ${tokenContractAddress}`);
    
    // Get the target block number
    const targetBlockNumber = await ballotContract.read.targetBlockNumber();
    console.log(`Target block number: ${targetBlockNumber}`);
    
    // Find how many proposals we have
    let proposalCount = 0;
    const proposals = [];
    
    try {
      while (true) {
        const proposal = await ballotContract.read.proposals([BigInt(proposalCount)]);
        proposals.push({
          name: bytes32ToString(proposal[0]),
          voteCount: proposal[1]
        });
        proposalCount++;
      }
    } catch (error) {
      // This is expected when we've gone through all proposals
      console.log(`Found ${proposalCount} proposals`);
    }
    
    // Display all proposals and their vote counts
    console.log("\nProposals and vote counts:");
    proposals.forEach((proposal, index) => {
      console.log(`${index}: ${proposal.name} - ${proposal.voteCount} votes`);
    });
    
    // Get the winning proposal
    const winningProposalId = await ballotContract.read.winningProposal();
    console.log(`\nWinning proposal ID: ${winningProposalId}`);
    
    // Get the winner name
    const winnerName = await ballotContract.read.winnerName();
    console.log(`Winning proposal name: ${bytes32ToString(winnerName)}`);
    console.log(`Winning proposal vote count: ${proposals[Number(winningProposalId)].voteCount}`);
    
    // Calculate total votes cast
    const totalVotes = proposals.reduce((sum, proposal) => sum + proposal.voteCount, 0n);
    console.log(`\nTotal votes cast: ${totalVotes}`);
    
    // Calculate percentages
    console.log("\nVote distribution:");
    proposals.forEach((proposal) => {
      const percentage = totalVotes > 0n 
        ? Number((proposal.voteCount * 10000n) / totalVotes) / 100
        : 0;
      console.log(`${proposal.name}: ${percentage}%`);
    });
  } catch (error) {
    console.error("Error querying results:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});