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
import { hardhat, sepolia } from 'viem/chains';
import * as tokenJson from './artifacts/contracts/MyToken.sol/MyToken.json';

@Injectable()
export class AppService {
  publicClient: PublicClient;
  walletClient: WalletClient;
  account: Account;
  constructor() {
    const providerApiKey = process.env.ALCHEMY_API_KEY;

    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY || '';
    if (!deployerPrivateKey) {
      throw new Error('missing deployerPrivateKey');
    }
    this.publicClient = createPublicClient({
      // chain: hardhat,
      // transport: http('http://127.0.0.1:8545/'),
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    this.account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    this.walletClient = createWalletClient({
      // chain: hardhat,
      // transport: http('http://127.0.0.1:8545/'),
      account: this.account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
  async Mint(account: string, amount: number) {
    if (!process.env.TOKEN_ADDRESS) {
      throw Error('missing TOKEN_ADDRESS in .env');
    }

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
  }
}
