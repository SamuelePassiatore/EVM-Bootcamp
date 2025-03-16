// DelegateVote.ts
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const delegatorPrivateKey = process.env.DELEGATOR_PRIVATE_KEY || process.env.PRIVATE_KEY || "";

async function main() {
  // Get contract address and delegate address from command line
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  
  const delegateAddress = parameters[1] as `0x${string}`;
  if (!delegateAddress) throw new Error("Delegate address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(delegateAddress))
    throw new Error("Invalid delegate address");
  
  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  // Create wallet client for delegator
  const account = privateKeyToAccount(`0x${delegatorPrivateKey}`);
  const delegator = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
  console.log("Delegator address:", delegator.account.address);
  
  // Check delegator's current voting status
  const delegatorInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "voters",
    args: [delegator.account.address],
  }) as any[];
  
  console.log(`Delegator voting weight: ${delegatorInfo[0]}`);
  console.log(`Delegator already voted: ${delegatorInfo[1]}`);
  console.log(`Delegator current delegate: ${delegatorInfo[2]}`);
  
  if (delegatorInfo[0] === 0n) {
    console.error("This address doesn't have the right to vote");
    process.exit(1);
  }
  
  if (delegatorInfo[1]) {
    console.error("This address has already voted");
    process.exit(1);
  }
  
  if (delegatorInfo[2] !== "0x0000000000000000000000000000000000000000") {
    console.error("This address has already delegated its vote");
    process.exit(1);
  }
  
  // Check delegate's current voting status
  const delegateInfo = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "voters",
    args: [delegateAddress],
  }) as any[];
  
  console.log(`\nDelegate voting weight before delegation: ${delegateInfo[0]}`);
  
  if (delegateInfo[0] === 0n) {
    console.error("The delegate doesn't have the right to vote");
    process.exit(1);
  }
  
  console.log(`\nDelegating vote to ${delegateAddress}`);
  console.log("Confirm? (Y/n)");
  
  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      try {
        const hash = await delegator.writeContract({
          address: contractAddress,
          abi,
          functionName: "delegate",
          args: [delegateAddress],
        });
        
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // Check updated voter states
        const updatedDelegatorInfo = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "voters",
          args: [delegator.account.address],
        }) as any[];
        
        const updatedDelegateInfo = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "voters",
          args: [delegateAddress],
        }) as any[];
        
        console.log("\nAfter delegation:");
        console.log(`Delegator voting weight: ${updatedDelegatorInfo[0]}`);
        console.log(`Delegator delegate: ${updatedDelegatorInfo[2]}`);
        console.log(`Delegate voting weight: ${updatedDelegateInfo[0]}`);
        
      } catch (error) {
        console.error("Error delegating vote:", error);
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