// QueryResults.ts
import { createPublicClient, http, hexToString } from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  // Get contract address from command line
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Contract address not provided");
  
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  
  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Get chairperson
  const chairperson = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "chairperson",
  });
  
  console.log("Contract information:");
  console.log("Address:", contractAddress);
  console.log("Chairperson:", chairperson);
  
  // Get all proposals
  const proposalCount = await getProposalCount(publicClient, contractAddress);
  console.log(`\nTotal proposals: ${proposalCount}`);
  
  console.log("\nProposals:");
  for (let i = 0; i < proposalCount; i++) {
    const proposal = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(i)],
    })) as any[];
    
    const name = hexToString(proposal[0], { size: 32 });
    console.log(`Proposal ${i}: "${name}" - ${proposal[1]} vote(s)`);
  }
  
  // Get winning proposal
  const winningProposalIndex = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winningProposal",
  });
  
  const winnerName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  });
  
  const winnerNameString = hexToString(winnerName as `0x${string}`, { size: 32 });
  
  console.log(`\nWinning proposal: ${winningProposalIndex} - "${winnerNameString}"`);
  
  // Check if additional parameter is provided to check a specific voter
  if (parameters.length > 1) {
    const voterAddress = parameters[1] as `0x${string}`;
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) {
      console.error("Invalid voter address");
    } else {
      console.log(`\nVoter information for ${voterAddress}:`);
      const voterInfo = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [voterAddress],
      }) as any[];
      
      console.log(`Weight: ${voterInfo[0]}`);
      console.log(`Voted: ${voterInfo[1]}`);
      console.log(`Delegate: ${voterInfo[2]}`);
      
      if (voterInfo[1]) {
        console.log(`Voted for proposal: ${voterInfo[3]}`);
      }
    }
  }
}

// Helper function to get proposal count (by trying to read proposals until it fails)
async function getProposalCount(publicClient: any, contractAddress: `0x${string}`): Promise<number> {
  let count = 0;
  try {
    while (true) {
      await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(count)],
      });
      count++;
    }
  } catch (error) {
    // When we hit an error, we've gone past the end of the proposals
    return count;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});