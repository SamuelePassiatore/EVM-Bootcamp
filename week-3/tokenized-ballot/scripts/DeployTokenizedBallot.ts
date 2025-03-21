import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient, stringToHex, pad } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";
const MY_TOKEN_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS ?? "";

// Convert string to bytes32
function convertStringToBytes32(input: string): `0x${string}` {
    return pad(stringToHex(input), { dir: 'right' });
}

async function main() {
    console.log("Deploying TokenizedBallot contract...");

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

    // Check we have the token address
    if (!MY_TOKEN_ADDRESS) {
        throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
    }

    // Get the current block number and use a previous block as the target
    const currentBlock = await publicClient.getBlockNumber();
    const targetBlockNumber = currentBlock - 1n;
    console.log(`Current block number: ${currentBlock}`);
    console.log(`Target block number: ${targetBlockNumber}`);

    // Define proposals
    const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];
    const proposalBytes32 = proposals.map((proposal) => convertStringToBytes32(proposal));
    console.log("Proposals:", proposals);

    try {
        // Deploy the TokenizedBallot contract
        const tokenizedBallotDeployment = await viem.deployContract(
            "TokenizedBallot",
            [proposalBytes32, MY_TOKEN_ADDRESS as `0x${string}`, targetBlockNumber]
        );

        console.log(`TokenizedBallot contract deployed at ${tokenizedBallotDeployment.address}`);
        
        // Verify the deployment by creating a contract instance and making explicit calls
        console.log("Verifying deployment...");
        
        const tokenizedBallot = await viem.getContractAt("TokenizedBallot", tokenizedBallotDeployment.address);
        
        // Check token contract address
        const tokenContractAddress = await tokenizedBallot.read.tokenContract();
        console.log(`Token contract address: ${tokenContractAddress}`);
        
        // Check target block number
        const deployedTargetBlockNumber = await tokenizedBallot.read.targetBlockNumber();
        console.log(`Target block number: ${deployedTargetBlockNumber}`);
        
        // Get proposal details
        for (let i = 0; i < proposals.length; i++) {
        // Call the proposals function with an index
        const proposal = await tokenizedBallot.read.proposals([BigInt(i)]);
        console.log(`Proposal ${i}: ${proposals[i]}, Vote Count: ${proposal[1]}`);
        }
    } catch (error) {
        console.error("Error deploying TokenizedBallot contract:", error);
        throw error;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});