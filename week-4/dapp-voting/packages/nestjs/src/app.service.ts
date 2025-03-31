import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
  Account,
  getAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as tokenJson from './artifacts/contracts/MyToken.sol/MyToken.json';
import * as ballotJson from './artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';

@Injectable()
export class AppService {
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: Account;

  constructor(private readonly configService: ConfigService) {
    try {
      const privateKey = this.configService.get<string>('DEPLOYER_PRIVATE_KEY');
      if (!privateKey) {
        throw new Error('DEPLOYER_PRIVATE_KEY is not defined in environment variables');
      }
      this.account = privateKeyToAccount(`0x${privateKey}`);
    } catch (error) {
      console.error('Error creating account from private key:', error);
      throw error;
    }
    try {
      const alchemyRpcUrl = this.configService.get<string>('ALCHEMY_RPC_ENDPOINT_URL');
      if (!alchemyRpcUrl) {
        throw new Error('ALCHEMY_RPC_ENDPOINT_URL is not defined in environment variables');
      }
      this.publicClient = createPublicClient({
        chain: sepolia,
        transport: http(this.configService.get<string>('ALCHEMY_RPC_ENDPOINT_URL')),
      });
      this.walletClient = createWalletClient({
        account: this.account,
        chain: sepolia,
        transport: http(this.configService.get<string>('ALCHEMY_RPC_ENDPOINT_URL')),
      });
    } catch (error) {
      console.error('Error accessing RPC provider:', error);
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async mintTokens(account: string, amount: number) {
    try {
      const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
      if (!tokenAddress) {
        throw new Error('TOKEN_ADDRESS is not defined in environment variables');
      }

      console.log(`Minting ${amount} tokens to ${account}`);
      console.log(`Using token address: ${tokenAddress}`);

      const accountAddr = getAddress(account);
      const tx = await this.walletClient.writeContract({
        address: getAddress(tokenAddress),
        abi: tokenJson.abi,
        functionName: 'mint',
        args: [accountAddr, amount],
        account: this.account,
        // chain: hardhat,
        chain: sepolia,
      });
      const transaction = await this.publicClient.waitForTransactionReceipt({
        hash: tx,
      });
  
      console.log(transaction);
  
      return tx;
    } catch (error) {
      console.error("Mint error:", error);
      throw error;
    }
  }

  /**
   * Get the currently deployed TokenizedBallot address from Scaffold-ETH deployment files
   */
  async getCurrentBallotAddress(): Promise<string> {
    try {
      // Path to the deployedContracts.ts file from Scaffold-ETH
      const deployedContractsPath = path.resolve(__dirname, '../../nextjs/contracts/deployedContracts.ts');
      // Check if file exists
      if (!fs.existsSync(deployedContractsPath)) {
        throw new Error('deployedContracts.ts file not found');
      }

      // Read the file content
      const fileContent = fs.readFileSync(deployedContractsPath, 'utf8');

      // Extract TokenizedBallot address using regex
      // This is a bit hacky but avoids having to import and evaluate the TS file
      const regex = /TokenizedBallot\s*:\s*\{\s*address\s*:\s*"([^"]+)"/m;
      const match = fileContent.match(regex);

      if (!match || !match[1]) {
        throw new Error('TokenizedBallot address not found in deployedContracts.ts');
      }

      return match[1];
    } catch (error) {
      console.error('Error getting current ballot address:', error);
      throw error;
    }
  }

  async redeployBallot(): Promise<string> {
    try {
      // Get the token address
      const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
      if (!tokenAddress) {
        throw new Error('TOKEN_ADDRESS is not defined in environment variables');
      }

      // Get current ballot address dynamically
      const currentBallotAddress = await this.getCurrentBallotAddress();
      console.log(`Found current ballot at: ${currentBallotAddress}`);

      // Read proposals from current ballot
      const proposals: `0x${string}`[] = [];
      try {
        let index = 0;
        while (true) {
          const proposal = await this.publicClient.readContract({
            address: currentBallotAddress as `0x${string}`,
            abi: ballotJson.abi,
            functionName: 'proposals',
            args: [BigInt(index)]
          }) as [bytes32: `0x${string}`, voteCount: bigint];

          proposals.push(proposal[0]);
          console.log(`Read proposal ${index}: ${proposal[0]}`);
          index++;
        }
      } catch (error) {
        // This error is expected when we've read all proposals
        console.log(`Found ${proposals.length} proposals`);
      }

      if (proposals.length === 0) {
        throw new Error('No proposals found in the existing ballot contract');
      }

      // Get current block and set target block slightly before it
      const block = await this.publicClient.getBlock();
      const targetBlockNumber = block.number - 10n;
      console.log(`Using target block number: ${targetBlockNumber}`);

      // Deploy new contract
      console.log('Deploying new ballot contract...');
      const tx = await this.walletClient.deployContract({
        abi: ballotJson.abi,
        bytecode: ballotJson.bytecode as `0x${string}`,
        args: [proposals, tokenAddress, targetBlockNumber],
        account: this.account,
        chain: sepolia
      });

      console.log(`Deployment transaction: ${tx}`);
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: tx });
      const newContractAddress = receipt.contractAddress as `0x${string}`;

      // Update the deployedContracts.ts file with the new address
      this.updateDeployedContractsFile(newContractAddress);

      console.log(`TokenizedBallot redeployed to: ${newContractAddress}`);
      return newContractAddress;
    } catch (error) {
      console.error("Error redeploying ballot:", error);
      throw error;
    }
  }

  /**
   * Update the deployedContracts.ts file with the new ballot address
   */
  private updateDeployedContractsFile(newAddress: string): void {
    try {
      const deployedContractsPath = path.resolve(__dirname, '../../nextjs/contracts/deployedContracts.ts');

      if (!fs.existsSync(deployedContractsPath)) {
        console.warn('deployedContracts.ts file not found, cannot update');
        return;
      }

      let fileContent = fs.readFileSync(deployedContractsPath, 'utf8');

      // Replace the old address with the new one
      // This matches: TokenizedBallot: { (anything) address: "0x..." (and captures only the 0x part)
      const regex = /(TokenizedBallot\s*:\s*\{\s*address\s*:\s*")([^"]+)(")/m;
      fileContent = fileContent.replace(regex, `$1${newAddress}$3`);

      fs.writeFileSync(deployedContractsPath, fileContent);
      console.log('Updated deployedContracts.ts with new address');
    } catch (error) {
      console.error('Failed to update deployedContracts.ts:', error);
      // Don't throw, just log the error since this is not critical
    }
  }

}
