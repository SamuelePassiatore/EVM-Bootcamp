// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping (address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        require(
            _targetBlockNumber < block.number,
            "Target block number must be in the past"
        );
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(
            getRemainingVotingPower(msg.sender) >= amount,
            "Voter is trying to vote with more votes than it has"
        );
        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
    }

    function getRemainingVotingPower(address voter) public view returns (uint256 votePower_) {
        votePower_ = tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[voter];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}