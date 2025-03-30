import { ApiProperty } from '@nestjs/swagger';

export class MintTokenDto {
  @ApiProperty()
  account: string;

  @ApiProperty()
  amount: number;
}
