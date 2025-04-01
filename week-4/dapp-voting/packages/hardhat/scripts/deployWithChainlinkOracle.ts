import { HardhatRuntimeEnvironment } from "hardhat/types";
import { stringToHex } from "viem";
import fetch from "node-fetch";

interface CryptoData {
    name: string,
}


// Function to fetch top cryptocurrencies as proposals
async function fetchCryptoProposals() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1');
        const data = await response.json() as CryptoData[];
        
        // Extract cryptocurrency names
        const proposals = data.map((crypto: CryptoData) => crypto.name);
        console.log("Fetched proposals from CoinGecko:", proposals);
        
        return proposals;
    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
        // Fallback proposals
        return ["RLC", "EURC", "Binance Coin"];
    }
}

// Deploy function that uses oracle data
export async function deployBallotWithOracleData(hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    
    // 1. Fetch proposals using external API (simulating oracle)
    const proposalNames = await fetchCryptoProposals();
    
    // 2. Convert proposals to bytes32 format
    const proposalsWithByte32 = proposalNames.map(str => stringToHex(str, { size: 32 }));
    
    // 3. Get MyToken deployment
    const MyToken = await hre.deployments.get("MyToken");
    
    // 4. Get current block to set as target block
    const publicClient = await hre.viem.getPublicClient();
    const currentBlock = (await publicClient.getBlock()).number;
    const targetBlockNumber = currentBlock - 10n;
    
    // 5. Deploy TokenizedBallot with oracle-generated proposals
    const result = await deploy("TokenizedBallot", {
        from: deployer,
        args: [proposalsWithByte32, MyToken.address, targetBlockNumber],
        log: true,
        autoMine: true,
    });
    
    console.log(`Deployed TokenizedBallot with oracle data at ${result.address}`);
    console.log(`Proposals: ${proposalNames.join(", ")}`);
    console.log(`Target block: ${targetBlockNumber}`);
    
    return result;
}

// If script is run directly
if (require.main === module) {
    // You'd typically call this from hardhat.config.ts or a deploy script
    const hre = require("hardhat");
    deployBallotWithOracleData(hre)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}