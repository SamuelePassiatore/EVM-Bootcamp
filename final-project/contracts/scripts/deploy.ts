import hre from "hardhat";

async function main() {
    // Get the wallet clients
    const [deployer] = await hre.viem.getWalletClients();
    
    console.log("Deploying contracts with account:", deployer.account.address);

    // Deploy the contract
    const qnaReward = await hre.viem.deployContract("QnAReward", [
        deployer.account.address,
    ]);

    console.log("QnAReward deployed to:", qnaReward.address);
}

// Execute the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }
);