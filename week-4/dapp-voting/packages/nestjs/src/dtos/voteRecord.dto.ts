import { ApiProperty } from '@nestjs/swagger';

export class VoteRecordDto {
    @ApiProperty({ description: 'Wallet address that cast the vote' })
    voter: string;

    @ApiProperty({ description: 'Proposal ID voted for' })
    proposalId: number;

    @ApiProperty({ description: 'Amount of voting power used' })
    amount: number;

    @ApiProperty({ description: 'Transaction hash of the vote' })
    transactionHash: string;
}

export class CreateVoteRecordDto {
    @ApiProperty({ description: 'Wallet address that cast the vote' })
    voter: string;

    @ApiProperty({ description: 'Proposal ID voted for' })
    proposalId: number;

    @ApiProperty({ description: 'Amount of voting power used' })
    amount: number;

    @ApiProperty({ description: 'Transaction hash of the vote' })
    transactionHash: string;
}