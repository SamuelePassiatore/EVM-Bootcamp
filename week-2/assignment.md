# Report

Contract deployment :

```shell
❯ npx ts-node --files ./scripts/DeployWithViem.ts "arg1" "arg2" "arg3"                                                                                 ─╯
Last block number: 7915076n
Deployer address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Deployer balance: 0.018394177303327792 ETH

Deploying Ballot contract
Transaction hash: 0x83a8494e8e92493a31174ee0fe964ce8843a3e76cec41809935caee0297a55d3
Waiting for confirmations...
Ballot contract deployed to: 0x2af1b834ba184f2565577b7f095fc284c41489fa
```

Casting votes for proposal 1 and vote from chairman for proposal 1:

```shell
❯ npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"                                                           ─╯
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight: 1
Already voted: false
Proposal selected:
Voting to proposal "arg1" (index: 0, current votes: 0)
Confirm? (Y/n)
Y
Transaction hash: 0x7d051924ecef1d2f585772dae712178b109d8b3487f7ca05552873f61cbc63a4
Waiting for confirmations...
Transaction confirmed in block: 7915126n
Updated vote count for "arg1": 1
```

Try to revote for proposal 1 with same address:

```shell
❯ npx ts-node --files ./scripts/CastVote.ts "0x2af1b834ba184f2565577b7f095fc284c41489fa" "0"                                                           ─╯
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current voting weight: 1
Already voted: true
This address has already voted for proposal "arg1"
```

Try to vote for proposal 1 with another address:

```shell
Voter address: 0x86fd0D762B53f21011e531fa57629D294d576A36
Current voting weight: 0
Already voted: false
This address doesn't have the right to vote
```

