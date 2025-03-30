import { Injectable } from '@nestjs/common';
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  PublicClient,
  stringToHex,
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
  async Mint(address: string, amount: number) {
    if (!process.env.TOKEN_ADDRESS) {
      throw Error('missing TOKEN_ADDRESS in .env');
    }
    const contract = getContract({
      address: stringToHex(process.env.TOKEN_ADDRESS),
      abi: tokenJson,
      client: { public: this.publicClient, wallet: this.walletClient },
    });

    const result = await contract.write.mint([address, amount]);
  }
}
