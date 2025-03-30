import { Injectable } from '@nestjs/common';
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  getContract,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import { hardhat } from 'viem/chains';
import * as tokenJson from './artifacts/contracts/MyToken.sol/MyToken.json';

@Injectable()
export class AppService {
  publicClient: PublicClient;
  walletClient: WalletClient;
  constructor() {
    this.publicClient = createPublicClient({
      chain: hardhat,
      transport: http('http://127.0.0.1:8545/'),
    });
    this.walletClient = createWalletClient({
      chain: hardhat,
      transport: http('http://127.0.0.1:8545/'),
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
      account: accountAddr,
      chain: hardhat,
    });
    const transaction = await this.publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    console.log(transaction);

    return tx;
  }
}
