# Report

MyToken.sol contract deployment address on Sepolia network: [0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e](https://sepolia.etherscan.io/address/0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e)

```shell
❯ npx hardhat run ./scripts/DeployMyTokenWithViem.ts --network sepolia
Deploying MyToken contract...
Deployer address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Network: 11155111
MyToken contract deployed at 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Deployment successful! You can find the transaction details on Etherscan.
Current block number: 7952518

Verifying contract details...
Token name: MyToken
Token symbol: MTK
Deployer has minter role: true
Deployer has admin role: true
```

TokenizedBallot.sol contract deployment address on Sepolia network: [0x8551314638172060b7a39f9f64e0e024f6a713db](https://sepolia.etherscan.io/address/0x8551314638172060b7a39f9f64e0e024f6a713db)

```shell
❯ npx hardhat run scripts/DeployTokenizedBallot.ts --network sepolia
Deploying TokenizedBallot contract...
Token contract address: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Deployer address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current block number: 7952531
Target block number: 7952431
Proposals: [ 'Proposal 1', 'Proposal 2', 'Proposal 3' ]
Proposals in bytes32: [
  '0x50726f706f73616c203100000000000000000000000000000000000000000000',
  '0x50726f706f73616c203200000000000000000000000000000000000000000000',
  '0x50726f706f73616c203300000000000000000000000000000000000000000000'
]
Attempting to deploy with parameters:
- Proposals: [
  '0x50726f706f73616c203100000000000000000000000000000000000000000000',
  '0x50726f706f73616c203200000000000000000000000000000000000000000000',
  '0x50726f706f73616c203300000000000000000000000000000000000000000000'
]
- Token Contract: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
- Target Block Number: 7952431
Deployment transaction hash: 0x1392a212ddf45636cb20d56e722d6bbbdcaec2e9107235aac69cec4d7fd9c11f
TokenizedBallot deployed to: 0x8551314638172060b7a39f9f64e0e024f6a713db

Verifying deployment...
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952431
Proposal 0: Proposal 1, Vote Count: 0
Proposal 1: Proposal 2, Vote Count: 0
Proposal 2: Proposal 3, Vote Count: 0
```

Minting tokens with MyToken and TokenizedBallot deployer address :

```shell
❯ npx hardhat run scripts/MintTokens.ts --network sepolia
Minting tokens...
Token contract address: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Minter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Recipient address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Mint amount: 100 tokens
Recipient balance before minting: 0 tokens
Minting transaction hash: 0x85ecf3ca2b103ec2e00e940d4c877e4fcb1a3aa7fba2c3c7d22b275e5deaee8e
Transaction confirmed in block 7952580
Recipient balance after minting: 100 tokens
Recipient voting power before delegation: 0
```

- Transaction details (hash: [0x85ecf3ca2b103ec2e00e940d4c877e4fcb1a3aa7fba2c3c7d22b275e5deaee8e](https://sepolia.etherscan.io/tx/0x85ecf3ca2b103ec2e00e940d4c877e4fcb1a3aa7fba2c3c7d22b275e5deaee8e)) :

```markdown
Function: mint(address _account, uint256 _amount) ***

MethodID: 0x40c10f19
[0]:  0000000000000000000000008790f7d137040d6dad7a0aeaee994cfd76577b23
[1]:  0000000000000000000000000000000000000000000000000000000000000064
```

Delegating voting power to deployer address :

```shell
❯ npx hardhat run scripts/DelegateVote.ts --network sepolia
Delegating voting power...
Token contract address: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Delegating to: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Voter's voting power before delegation: 0
Delegatee's voting power before: 0
Delegation transaction hash: 0xfefdf86d61cc038fe84e2faf3462ea3562d3553f9e828b0f0d40d34bfb97a16a
Transaction confirmed in block 7952649
Voter's voting power after delegation: 100
Delegatee's voting power after: 100
Voter is now delegating to: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
```

- Transaction details (hash: [0xfefdf86d61cc038fe84e2faf3462ea3562d3553f9e828b0f0d40d34bfb97a16a](https://sepolia.etherscan.io/tx/0xfefdf86d61cc038fe84e2faf3462ea3562d3553f9e828b0f0d40d34bfb97a16a)) :

```markdown
Function: delegate(address delegatee) ***

MethodID: 0x5c19a95c
[0]:  0000000000000000000000008790f7d137040d6dad7a0aeaee994cfd76577b23
```

New TokenizedBallot contract deployed after delegating voting power :

```shell
❯ npx hardhat run scripts/DeployTokenizedBallotWithRecentBlock.ts --network sepolia
Deploying TokenizedBallot contract with recent target block...
Token contract address: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Deployer address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current block number: 7952773
Target block number: 7952763
Proposals: [ 'Proposal 1', 'Proposal 2', 'Proposal 3' ]
Proposals in bytes32: [
  '0x50726f706f73616c203100000000000000000000000000000000000000000000',
  '0x50726f706f73616c203200000000000000000000000000000000000000000000',
  '0x50726f706f73616c203300000000000000000000000000000000000000000000'
]
Attempting to deploy with parameters:
- Proposals: [
  '0x50726f706f73616c203100000000000000000000000000000000000000000000',
  '0x50726f706f73616c203200000000000000000000000000000000000000000000',
  '0x50726f706f73616c203300000000000000000000000000000000000000000000'
]
- Token Contract: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
- Target Block Number: 7952763
Deployment transaction hash: 0x8dca16672cba1fcde6ce87c9bff35a6ac8e8ecbc65f8f66c05fc291ff1ed61c8
TokenizedBallot deployed to: 0x958192c1479731d3b3c554510c4cc1398628aafb
Add this to your .env file: TOKENIZED_BALLOT_ADDRESS=0x958192c1479731d3b3c554510c4cc1398628aafb

Verifying deployment...
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 0: Proposal 1, Vote Count: 0
Proposal 1: Proposal 2, Vote Count: 0
Proposal 2: Proposal 3, Vote Count: 0

```

- Transaction details (hash: [0x8dca16672cba1fcde6ce87c9bff35a6ac8e8ecbc65f8f66c05fc291ff1ed61c8](https://sepolia.etherscan.io/tx/0x8dca16672cba1fcde6ce87c9bff35a6ac8e8ecbc65f8f66c05fc291ff1ed61c8)) :

Casting vote on random proposal with random vote amount :

```shell
❯ npx hardhat run scripts/CastVote.ts --network sepolia
Casting vote...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Proposal ID: 1
Vote amount: 1
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 1 vote count before: 0
Vote transaction hash: 0x57659f6e6adf85999a0480dfde7a6b71a5f177647df3c2625e38a3c448c6a597
Transaction confirmed in block 7952779
Proposal 1 vote count after: 1
Remaining voting power after voting: 99
```

- Transaction details (hash: [0x57659f6e6adf85999a0480dfde7a6b71a5f177647df3c2625e38a3c448c6a597](https://sepolia.etherscan.io/tx/0x57659f6e6adf85999a0480dfde7a6b71a5f177647df3c2625e38a3c448c6a597)) :

```markdown
Function: vote(uint256 proposal,uint256 amount) ***

MethodID: 0xb384abef
[0]:  0000000000000000000000000000000000000000000000000000000000000001
[1]:  0000000000000000000000000000000000000000000000000000000000000001
```

```shell
❯ npx hardhat run scripts/CastVote.ts --network sepolia
Casting vote...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Proposal ID: 2
Vote amount: 5
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 2 vote count before: 0
Vote transaction hash: 0x1a74044674fb2810202cf929974ef8d06031c3ce9df8460d5a41f720bde26ba1
Transaction confirmed in block 7952783
Proposal 2 vote count after: 5
Remaining voting power after voting: 94
```

- Transaction details (hash: [0x1a74044674fb2810202cf929974ef8d06031c3ce9df8460d5a41f720bde26ba1](https://sepolia.etherscan.io/tx/0x1a74044674fb2810202cf929974ef8d06031c3ce9df8460d5a41f720bde26ba1)) :

```markdown
Function: vote(uint256 proposal,uint256 amount) ***

MethodID: 0xb384abef
[0]:  0000000000000000000000000000000000000000000000000000000000000002
[1]:  0000000000000000000000000000000000000000000000000000000000000005
```

```shell
❯ npx hardhat run scripts/CastVote.ts --network sepolia
Casting vote...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Proposal ID: 2
Vote amount: 5
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 2 vote count before: 5
Vote transaction hash: 0x84ffde952ebddd7a545769cf35eaccde1f1938e66f84c35dba01fb9b7c56ada4
Transaction confirmed in block 7952785
Proposal 2 vote count after: 10
Remaining voting power after voting: 89
```

- Transaction details (hash: [0x84ffde952ebddd7a545769cf35eaccde1f1938e66f84c35dba01fb9b7c56ada4](https://sepolia.etherscan.io/tx/0x84ffde952ebddd7a545769cf35eaccde1f1938e66f84c35dba01fb9b7c56ada4)) :

```markdown
Function: vote(uint256 proposal,uint256 amount) ***

MethodID: 0xb384abef
[0]:  0000000000000000000000000000000000000000000000000000000000000002
[1]:  0000000000000000000000000000000000000000000000000000000000000005
```

```shell
❯ npx hardhat run scripts/CastVote.ts --network sepolia
Casting vote...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Proposal ID: 2
Vote amount: 8
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 2 vote count before: 10
Vote transaction hash: 0x09fbb4b33ecc1b9c419e231a411b82ca466fbf1f224b43cd853391f3dfafc867
Transaction confirmed in block 7952787
Proposal 2 vote count after: 18
Remaining voting power after voting: 81
```

- Transaction details (hash: [0x09fbb4b33ecc1b9c419e231a411b82ca466fbf1f224b43cd853391f3dfafc867](https://sepolia.etherscan.io/tx/0x09fbb4b33ecc1b9c419e231a411b82ca466fbf1f224b43cd853391f3dfafc867)) :

```markdown
Function: vote(uint256 proposal,uint256 amount) ***

MethodID: 0xb384abef
[0]:  0000000000000000000000000000000000000000000000000000000000000002
[1]:  0000000000000000000000000000000000000000000000000000000000000008
```

```shell
❯ npx hardhat run scripts/CastVote.ts --network sepolia
Casting vote...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Proposal ID: 1
Vote amount: 1
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Proposal 1 vote count before: 1
Vote transaction hash: 0xc52f6e8d2ce6b7f9449787e4790cced518aa61c2ec74bb62e633c3dcef13631d
Transaction confirmed in block 7952821
Proposal 1 vote count after: 2
Remaining voting power after voting: 80
```

- Transaction details (hash: [0xc52f6e8d2ce6b7f9449787e4790cced518aa61c2ec74bb62e633c3dcef13631d](https://sepolia.etherscan.io/tx/0xc52f6e8d2ce6b7f9449787e4790cced518aa61c2ec74bb62e633c3dcef13631d)) :

```markdown
Function: vote(uint256 proposal,uint256 amount) ***

MethodID: 0xb384abef
[0]:  0000000000000000000000000000000000000000000000000000000000000001
[1]:  0000000000000000000000000000000000000000000000000000000000000001
```

Checking voting power after vote casting :

```shell
❯ npx hardhat run scripts/CheckVotingPower.ts --network sepolia                                                                  ─╯
Checking voting power...
Token contract address: 0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e
Ballot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Voter address: 0x8790f7d137040D6Dad7A0AEAEe994CFD76577B23
Current block number: 7952827
Ballot target block number: 7952763
Token balance: 100
Current voting power: 100
Voting power at target block 7952763: 100
Remaining voting power in ballot: 80
Vote power spent: 20

Voting power details:
- Total token balance: 100
- Current active voting power: 100
- Voting power at target block: 100
- Power spent in ballot: 20
- Remaining power for ballot: 80
```

Querying result :

```shell
❯ npx hardhat run scripts/QueryResults.ts --network sepolia
Querying voting results...
TokenizedBallot contract address: 0x958192c1479731d3b3c554510c4cc1398628aafb
Token contract address: 0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E
Target block number: 7952763
Found 3 proposals

Proposals and vote counts:
0: Proposal 1 - 0 votes
1: Proposal 2 - 2 votes
2: Proposal 3 - 18 votes

Winning proposal ID: 2
Winning proposal name: Proposal 3
Winning proposal vote count: 18

Total votes cast: 20

Vote distribution:
Proposal 1: 0%
Proposal 2: 10%
Proposal 3: 90%
```
