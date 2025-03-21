import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { viem } from "hardhat"
import { createPublicClient, http, createWalletClient, formatEther, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY ?? "";
const deployerPrivateKey = process.env.PRIVATE_KEY ?? "";

const MINT_VALUE = 10n;

async function main() {
    //Deploying MyToken.sol contracts to HRE using Viem
    /*const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });*/
    const publicClient = await viem.getPublicClient();
    /*const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });*/
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");
    console.log(`Token contract deployed at ${contract.address}`);

    // Minting some tokens
    console.log("\n-------------------");
    console.log("Minting some tokens");
    console.log("-------------------");
    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(`Minted ${MINT_VALUE.toString()} decimal units to account ${acc1.account.address}`);
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(`Account ${acc1.account.address} has ${balanceBN.toString()} decimal units of MyToken`);

    // Checking vote power
    console.log("\n-------------------");
    console.log("Checking vote power");
    console.log("-------------------");
    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(`Account ${acc1.account.address} has ${votes.toString()} units of voting power before self delegating`);

    // Self delegation transaction
    console.log("\n---------------------------");
    console.log("Self delegation transaction");
    console.log("---------------------------");
    const delegateTx = await contract.write.delegate([acc1.account.address], {account: acc1.account});
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(`Account ${acc1.account.address} has ${votesAfter.toString()} units of voting power after self delegating`);

    // Experimenting a token transfer
    console.log("\n------------------------------");
    console.log("Experimenting a token transfer");
    console.log("------------------------------");
    const transferTx = await contract.write.transfer([acc2.account.address, MINT_VALUE / 2n], {account: acc1.account});
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    const votes1AfterTransfer = await contract.read.getVotes([acc1.account.address]);
    console.log(`Account ${acc1.account.address} has ${votes1AfterTransfer.toString()} units of voting power after transferring`);
    const votes2AfterTransfer = await contract.read.getVotes([acc2.account.address]);
    console.log(`Account ${acc2.account.address} has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer`);

    // Checking past votes
    console.log("\n-------------------");
    console.log("Checking past votes");
    console.log("-------------------");
    const lastBlockNumber = await publicClient.getBlockNumber();
    for (let index = lastBlockNumber - 1n; index > 0n; index--) {
        const pastVotes = await contract.read.getPastVotes([
            acc1.account.address,
            index,
        ]);
        console.log(`Account ${acc1.account.address} had ${pastVotes.toString()} units of voting power at block ${index}`);
        console.log(`Account ${acc2.account.address} had ${pastVotes.toString()} units of voting power at block ${index}\n`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
