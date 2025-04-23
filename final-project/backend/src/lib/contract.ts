import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { abi } from '../../../shared/artifacts/contracts/QnAReward.sol/QnAReward.json';
import dotenv from 'dotenv';

dotenv.config();

// The contract address from deployment
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS ?? process.env.NFT_CONTRACT_HARDHAT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? process.env.DEFAULT_PRIVATE_KEY;

// Create the account from private key
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

// Create a wallet client
const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
});

// Create a public client
const publicClient = createPublicClient({
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
});

// Function to mint an NFT reward
export async function mintNFTReward(walletAddress: string, level: number): Promise<string> {
    try {
        console.log(`Minting NFT for wallet ${walletAddress} at level ${level}`);
        
        // Create token URI with level info
        const tokenURI = `http://localhost:5173/metadata/${level}.json`;
        
        // Call mint function on the contract
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi,
            functionName: 'safeMint',
            args: [walletAddress, tokenURI],
        });
        
        console.log(`NFT minted successfully, transaction hash: ${hash}`);
        return hash;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}