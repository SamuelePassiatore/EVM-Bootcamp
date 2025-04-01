import { ApiProperty } from '@nestjs/swagger';

export class MintTokenDto {
  @ApiProperty({ description: 'Wallet address to receive tokens' })
  address: string;

  @ApiProperty({ description: 'Amount of tokens to mint', minimum: 1 })
  amount: number;
}