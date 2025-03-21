# Report

MyToken.sol contract deployment address on Sepolia network: [0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e](https://sepolia.etherscan.io/address/0xee30baa4275d5efbe6418cac7dd1cd1f43810c8e)

```shell
❯ npx hardhat run ./scripts/DeployMyTokenWithViem.ts --network sepolia                                                                                                       ─╯
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
❯ npx hardhat run scripts/DeployTokenizedBallot.ts --network sepolia                                                                                                         ─╯
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
❯ npx hardhat run scripts/MintTokens.ts --network sepolia                                                                        ─╯
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

