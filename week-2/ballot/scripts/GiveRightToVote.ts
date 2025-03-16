import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const chairpersonPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  // Get contract address and voter address from command line
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  
  const voterAddress = parameters[1] as `0x${string}`;
  if (!voterAddress) throw new Error("Voter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid voter address");
  
  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Create wallet client for chairperson
  const account = privateKeyToAccount(`0x${chairpersonPrivateKey}`);
  const chairperson = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  console.log("Chairperson address:", chairperson.account.address);
  
  // Check if the account is actually the chairperson
  const contractChairperson = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "chairperson",
  });
  
  if (contractChairperson.toLowerCase() !== chairperson.account.address.toLowerCase()) {
    throw new Error("The connected account is not the chairperson of the contract");
  }
  
  // Check voter's current voting weight
  const voterInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "voters",
    args: [voterAddress],
  }) as any[];
  
  console.log(`Current voting weight for ${voterAddress}: ${voterInfo[0]}`);
  
  if (voterInfo[0] > 0n) {
    console.log("This voter already has voting rights");
    process.exit(0);
  }
  
  console.log(`Giving right to vote to ${voterAddress}`);
  console.log("Confirm? (Y/n)");
  
  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      try {
        const hash = await chairperson.writeContract({
          address: contractAddress,
          abi,
          functionName: "giveRightToVote",
          args: [voterAddress],
        });
        
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // Check voter's updated voting weight
        const updatedVoterInfo = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "voters",
          args: [voterAddress],
        }) as any[];
        
        console.log(`Updated voting weight for ${voterAddress}: ${updatedVoterInfo[0]}`);
        
      } catch (error) {
        console.error("Error giving right to vote:", error);
      }
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});