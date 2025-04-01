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

    calculateVoteResults() {
        // Group votes by proposal ID and sum the amounts
        const proposalVotes = {};
        let totalVotes = 0;
        
        this.votes.forEach(vote => {
            if (!proposalVotes[vote.proposalId]) {
                proposalVotes[vote.proposalId] = 0;
            }
            proposalVotes[vote.proposalId] += vote.amount;
            totalVotes += vote.amount;
        });
        
        // Calculate percentages and format results
        const results = Object.keys(proposalVotes).map(proposalId => {
            const votes = proposalVotes[proposalId];
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            
            return {
                proposalId: parseInt(proposalId),
                votes,
                percentage
            };
        });
        
        // Sort by votes (descending)
        results.sort((a, b) => b.votes - a.votes);
        
        return {
            results,
            totalVotes
        };
    }
}