import { Injectable } from '@nestjs/common';
import { VoteRecordDto } from '../dtos/voteRecord.dto';

@Injectable()
export class VotesService {
    private votes: VoteRecordDto[] = [];

    // Add a new vote to the history
    addVote(vote: VoteRecordDto): VoteRecordDto {
        const newVote = {
        ...vote,
        timestamp: new Date()
        };
        
        this.votes.push(newVote);
        
        // Keep only the last 50 votes
        if (this.votes.length > 50) {
        this.votes = this.votes.slice(-50);
        }
        
        return newVote;
    }

    // Get all votes
    getAllVotes(): VoteRecordDto[] {
        return this.votes;
    }

    // Get votes by address
    getVotesByAddress(address: string): VoteRecordDto[] {
        return this.votes.filter(vote => 
        vote.voter.toLowerCase() === address.toLowerCase()
        );
    }
    
    // Get recent votes (last 10)
    getRecentVotes(): VoteRecordDto[] {
        return this.votes.slice(-10).reverse();
    }
}