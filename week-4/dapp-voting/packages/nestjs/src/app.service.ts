import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      
      const amountInWei = BigInt(amount) * BigInt(10 ** 18);
      
      console.log(`Minting ${amountInWei} tokens to ${account}`);
      console.log(`Using token address: ${tokenAddress}`);
      
      const accountAddr = getAddress(account);
      const tx = await this.walletClient.writeContract({
        address: getAddress(tokenAddress),
        abi: tokenJson.abi,
        functionName: 'mint',
        args: [accountAddr, amountInWei],
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

  async redeployBallot(): Promise<string> {
    try {
      const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
      const currentBallotAddress = await hre.viem.getContractAt("TokenizedBallot", result.address as `0x${string}`);
      const proposalCount = 3;
      const proposals = [];

      for (let i = 0; i < proposalCount; i++) {
        const proposal = await this.publicClient.readContract({
          address: currentBallotAddress as `0x${string}`,
          abi: ballotJson.abi,
          functionName: 'proposals',
          args: [i]
        });
        proposals.push(proposal[0]);
      }

      const block = await this.publicClient.getBlock();
      const targetBlockNumber = block.number - 10n;
      
      const tx = await this.walletClient.deployContract({
        abi: ballotJson.abi,
        bytecode: ballotJson.bytecode as `0x${string}`,
        args: [proposals, tokenAddress, targetBlockNumber],
        account: this.account
      });
      
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: tx });
      const newContractAddress = receipt.contractAddress as `0x${string}`;
      console.log(`TokenizedBallot redeployed to: ${newContractAddress}`);
      return newContractAddress;
    } catch (error) {
      console.error("Error redeploying ballot:", error);
      throw error;
    }
  }

}
