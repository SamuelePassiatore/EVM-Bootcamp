# TokenizedBallot Implementation Guide

This guide walks through the complete process of deploying and interacting with the `TokenizedBallot` contract system, including all necessary steps from token deployment to voting and querying results.

## Contract Deployment

### MyToken Deployment

First, deploy the `MyToken` contract to the Sepolia testnet:

```bash
npx hardhat run scripts/DeployMyTokenWithViem.ts --network sepolia
```

Save the deployed contract address for later use

### TokenizedBallot Deployment

Next, deploy the `TokenizedBallot` contract. **Important note:** The contract requires a target block number in the past for the voting power snapshot.

```bash
npx hardhat run scripts/DeployTokenizedBallot.ts --network sepolia
```

Save the deployed contract address for later use

## Token Operations

### Minting Tokens

Mint tokens to participate in the voting:

```bash
npx hardhat run scripts/MintTokens.ts --network sepolia
```

### Delegating Voting Power

**Critical Step:** After minting, you must delegate your tokens to activate voting power:

```bash
npx hardhat run scripts/DelegateVote.ts --network sepolia
```

## Voting Operations

### Checking Voting Power

Check your voting power before attempting to vote:

```bash
npx hardhat run scripts/CheckVotingPower.ts --network sepolia
```

### Important Note on Target Block

If your "Voting power at target block" is 0 despite having delegated tokens, this means you delegated **after** the target block used by the ballot contract. There are two solutions:

1. **Recommended:** Deploy a new TokenizedBallot with a more recent target block (after your delegation)

   ```bash
   npx hardhat run scripts/DeployTokenizedBallotWithRecentBlock.ts --network sepolia
   ```

2. **Alternative:** Mint and delegate tokens from a different account that already had tokens at the target block

### Casting Votes

Cast your vote for a proposal:

```bash
npx hardhat run scripts/CastVote.ts --network sepolia
```

### Querying Results

After votes have been cast, query the results:

```bash
npx hardhat run scripts/QueryResults.ts --network sepolia
```

---

By following this guide, you should be able to successfully deploy the TokenizedBallot system, mint and delegate tokens, cast votes, and query results on the Sepolia testnet.
