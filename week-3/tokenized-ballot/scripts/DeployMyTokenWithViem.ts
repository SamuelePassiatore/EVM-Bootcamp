import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";

async function main() {
    console.log("Deploying MyToken contract...");

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
    
    console.log(`Deployer address: ${deployer.account.address}`);
    console.log(`Network: ${await publicClient.getChainId()}`);
    
    try {
        // Deploy the MyToken contract
        const tokenContract = await viem.deployContract("MyToken");
        
        console.log(`MyToken contract deployed at ${tokenContract.address}`);
        console.log(`Deployment successful! You can find the transaction details on Etherscan.`);
        
        // Get the current block number for reference
        const currentBlock = await publicClient.getBlockNumber();
        console.log(`Current block number: ${currentBlock}`);

        
        // Verify contract details
        console.log("\nVerifying contract details...");
        
        // Get token name and symbol
        const name = await tokenContract.read.name();
        const symbol = await tokenContract.read.symbol();
        console.log(`Token name: ${name}`);
        console.log(`Token symbol: ${symbol}`);
        
        // Check if deployer has the minter role
        const minterRole = await tokenContract.read.MINTER_ROLE();
        const hasMinterRole = await tokenContract.read.hasRole([minterRole, deployer.account.address]);
        console.log(`Deployer has minter role: ${hasMinterRole}`);
        
        // Get admin role
        const defaultAdminRole = await tokenContract.read.DEFAULT_ADMIN_ROLE();
        const hasAdminRole = await tokenContract.read.hasRole([defaultAdminRole, deployer.account.address]);
        console.log(`Deployer has admin role: ${hasAdminRole}`);
        
        console.log("\nMyToken deployment successful! ✅");
        console.log(`Add this to your .env file: TOKEN_CONTRACT_ADDRESS=${tokenContract.address}`);
    } catch (error) {
        console.error("Error deploying MyToken contract:", error);
        throw error;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});