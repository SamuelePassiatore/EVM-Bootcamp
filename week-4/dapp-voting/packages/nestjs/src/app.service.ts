import { Injectable } from '@nestjs/common';
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  http,
  PublicClient,
  WalletClient,
  Account,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as tokenJson from './artifacts/contracts/MyToken.sol/MyToken.json';

@Injectable()
export class AppService {

  publicClient: PublicClient;
  walletClient: WalletClient;
  account: Account;

  constructor() {
    this.account = privateKeyToAccount(`0x${process.env.DEPLOYER_PRIVATE_KEY}`);
    this.publicClient = createPublicClient({
      // chain: hardhat,
      // transport: http('http://127.0.0.1:8545/'),
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
    });
    this.walletClient = createWalletClient({
      // chain: hardhat,
      // transport: http('http://127.0.0.1:8545/'),
      account: this.account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async mintTokens(account: string, amount: number) {
    try {
      // Existing code
      if (!process.env.TOKEN_ADDRESS) {
        throw Error('missing TOKEN_ADDRESS in .env');
      }
      
      console.log(`Minting ${amount} tokens to ${account}`);
      console.log(`Using token address: ${process.env.TOKEN_ADDRESS}`);
      
      const accountAddr = getAddress(account);
      const tx = await this.walletClient.writeContract({
        address: getAddress(process.env.TOKEN_ADDRESS),
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

}
