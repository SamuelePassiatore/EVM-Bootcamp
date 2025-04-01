import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteRecordDto, VoteRecordDto } from '../dtos/voteRecord.dto';

@ApiTags('Voting History')
@Controller('votes')
export class VotesController {
    constructor(private readonly votesService: VotesService) {}

    @Post()
    @ApiOperation({ summary: 'Record a new vote' })
    @ApiResponse({ status: 201, description: 'Vote recorded successfully' })
    recordVote(@Body() voteData: CreateVoteRecordDto): VoteRecordDto {
        return this.votesService.addVote(voteData);
    }

    @Get()
    @ApiOperation({ summary: 'Get all votes' })
    getAllVotes(): VoteRecordDto[] {
        return this.votesService.getAllVotes();
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recent votes' })
    getRecentVotes(): VoteRecordDto[] {
        return this.votesService.getRecentVotes();
    }

    @Get('address/:address')
    @ApiOperation({ summary: 'Get votes by address' })
    getVotesByAddress(@Param('address') address: string): VoteRecordDto[] {
        return this.votesService.getVotesByAddress(address);
    }

    @Get('results')
    @ApiOperation({ summary: 'Get calculated results from recent votes' })
    getVoteResults() {
        return this.votesService.calculateVoteResults();
    }
}