// CastVote.ts
import { createPublicClient, createWalletClient, http, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const voterPrivateKey = process.env.VOTER_PRIVATE_KEY ?? process.env.PRIVATE_KEY ?? "";

async function main() {
  // Get contract address and proposal index from command line
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  
  const proposalIndex = parameters[1];
  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");
  
  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Create wallet client for voter
  const account = privateKeyToAccount(`0x${voterPrivateKey}`);
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  console.log("Voter address:", voter.account.address);
  
  // Check voter's current voting weight and status
  const voterInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "voters",
    args: [voter.account.address],
  }) as any[];
  
  console.log(`Current voting weight: ${voterInfo[0]}`);
  console.log(`Already voted: ${voterInfo[1]}`);
  
  if (voterInfo[0] === 0n) {
    console.error("This address doesn't have the right to vote");
    process.exit(1);
  }
  
  if (voterInfo[1]) {
    console.error("This address has already voted");
    process.exit(1);
  }
  
  // Check if proposal exists
  const proposalCount = await getProposalCount(publicClient, contractAddress);
  if (Number(proposalIndex) >= proposalCount) {
    console.error(`Invalid proposal index. There are only ${proposalCount} proposals`);
    process.exit(1);
  }
  
  // Show proposal information
  console.log("Proposal selected: ");
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  
  const name = hexToString(proposal[0], { size: 32 });
  console.log(`Voting to proposal "${name}" (index: ${proposalIndex}, current votes: ${proposal[1]})`);
  console.log("Confirm? (Y/n)");
  
  const stdin = process.stdin;
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      try {
        const hash = await voter.writeContract({
          address: contractAddress,
          abi,
          functionName: "vote",
          args: [BigInt(proposalIndex)],
        });
        
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // Check updated proposal votes
        const updatedProposal = (await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "proposals",
          args: [BigInt(proposalIndex)],
        })) as any[];
        
        console.log(`Updated vote count for "${name}": ${updatedProposal[1]}`);
        
      } catch (error) {
        console.error("Error casting vote:", error);
      }
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
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