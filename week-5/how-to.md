# Lottery dapp

## Prerequisite

- Prepare accounts for the deployed chain with Metamask.
- Update `.env` if deployed to non-local chain.

## Deploy the contracts with selected chain

- Go to `hardhat` package

### hardhat (start the chain with deployment)

```sh
   yarn hardhat node --network hardhat
```

### sepolia

- Prepare account for deploying the contracts with sufficient balance

```sh
   yarn hardhat deploy --network sepolia
```

## Start the application

- Go to `nextjs` package

```sh
   yarn start # from nextjs package
```

## Testing

1. Use the owner account to start the Lottery
2. Buy some lottery token and Place bet with another account
3. Use owner account to force close the Lottery
4. Check the prize pool in UI
5. Withdraw the prize
6. Burn the withdrawed token
7. Check the ETH balance
