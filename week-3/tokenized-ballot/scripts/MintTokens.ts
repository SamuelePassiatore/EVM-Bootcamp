import { viem } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const MY_TOKEN_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS ?? "";
const MINT_AMOUNT = 100n; // Amount to mint in token units

async function main() {
    console.log("Minting tokens...");

    // Get the public client and wallet clients
    const publicClient = await viem.getPublicClient();
    const [deployer, recipient] = await viem.getWalletClients();
    
    // Check we have the token address
    if (!MY_TOKEN_ADDRESS) {
        throw new Error("Please set TOKEN_CONTRACT_ADDRESS in your .env file");
    }

    try {
        // Get the MyToken contract instance
        const tokenContract = await viem.getContractAt("MyToken", MY_TOKEN_ADDRESS as `0x${string}`);
        
        console.log(`Token contract address: ${tokenContract.address}`);
        console.log(`Minter address: ${deployer.account.address}`);
        console.log(`Recipient address: ${recipient.account.address}`);
        console.log(`Mint amount: ${MINT_AMOUNT} tokens`);

        // Check the balance before minting
        const balanceBefore = await tokenContract.read.balanceOf([recipient.account.address]);
        console.log(`Recipient balance before minting: ${balanceBefore} tokens`);

        // Mint tokens to the recipient
        const mintTx = await tokenContract.write.mint([recipient.account.address, MINT_AMOUNT]);
        console.log(`Minting transaction hash: ${mintTx}`);
        
        // Wait for the transaction to be confirmed
        const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Check the balance after minting
        const balanceAfter = await tokenContract.read.balanceOf([recipient.account.address]);
        console.log(`Recipient balance after minting: ${balanceAfter} tokens`);
        
        // Check vote power before delegation
        const votesBefore = await tokenContract.read.getVotes([recipient.account.address]);
        console.log(`Recipient voting power before delegation: ${votesBefore}`);
    } catch (error) {
        console.error("Error minting tokens:", error);
        throw error;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});