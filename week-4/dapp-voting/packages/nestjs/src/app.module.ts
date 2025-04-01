import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VotesController } from './votes/votes.controller';
import { VotesService } from './votes/votes.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../.env.local'),
      isGlobal: true,
    }),
  ],
  controllers: [AppController, VotesController],
  providers: [AppService, VotesService],
})
export class AppModule {}