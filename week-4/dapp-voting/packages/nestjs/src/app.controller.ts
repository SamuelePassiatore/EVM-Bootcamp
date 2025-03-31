import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { MintTokenDto } from './mintToken.dto';

@ApiTags('TokenizedBallot')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mint')
  @ApiOperation({ summary: 'Mint voting tokens to a wallet address' })
  @ApiResponse({ status: 201, description: 'Tokens minted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async mint(@Body() mintTokenDto: MintTokenDto) {
    return {result: await this.appService.mintTokens(mintTokenDto.account, mintTokenDto.amount)};
  }

  @Post('redeploy-ballot')
  @ApiOperation({ summary: 'Redeploy TokenizedBallot contract to update voting power at target block' })
  @ApiResponse({ status: 201, description: 'TokenizedBallot redeployed successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async redeployBallot() {
    return {
      newContractAddress: await this.appService.redeployBallot()
    };
  }
}
