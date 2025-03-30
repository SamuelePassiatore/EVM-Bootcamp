import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/mint')
  Mint(@Body() mintTokenDto: MintTokenDto) {
    const { account, amount } = mintTokenDto;
    return this.appService.Mint(account, amount);
  }
}
