# Weekend Project

This is a group activity for at least 3 students:

* Complete the projects together with your group
* Create a voting dApp to cast votes, delegate and query results on chain
* Request voting tokens to be minted using the API
* (bonus) Store a list of recent votes in the backend and display that on frontend
* (bonus) Use an oracle to fetch off-chain data
  * Use an oracle to fetch information from a data source of your preference
  * Use the data fetched to create the proposals in the constructor of the ballot

## Voting dApp integration guidelines

* Build the frontend using Scaffold ETH 2 as a base
* Build the backend using NestJS to provide the `Mint` method
  * Implement a single POST method
    * Request voting tokens from API
* Use these tokens to interact with the tokenized ballot
* All other interactions must be made directly on-chain

## Start working on the `dapp-voting` project

* Pull the latest change from our github repo
* Initiate your local workspace within the just clone `dapp-voting` directory root with :

```shell
yarn install
```

* Import your `.env` file in the root of the project

**Be sure to have the following environment variables:**

* `.env` or `.env.local` file in the `packages/nextjs` directory:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_TOKEN_ADDRESS="0x426cC3aB245a17425901DF2B710c215d8EF955c5" # Already deployed MyToken.sol contract address
```

* `.env` or `.env.local` file in the `packages/nestjs` directory:

```env
TOKEN_ADDRESS="0x426cC3aB245a17425901DF2B710c215d8EF955c5" # Already deployed MyToken.sol contract address
ALCHEMY_RPC_ENDPOINT_URL=
DEPLOYER_PRIVATE_KEY=
```

* `.env` file in the `packages/hardhat` directory:

```env
ALCHEMY_API_KEY=
ETHERSCAN_MAINNET_API_KEY=

# Don't fill this value manually, run `yarn account:import` within the `dapp-voting/packages/hardhat` directory and follow the instructions to import an existing private key.
DEPLOYER_PRIVATE_KEY_ENCRYPTED=
```

* Start both frontend and backend services:

Run NestJS backend:

```shell
cd packages/nestjs
yarn start:dev
```

Run NextJS frontend:

```shell
cd packages/nextjs
yarn dev
```

* Open your browser and go to `http://localhost:3000/` to see the frontend
* Open your browser and go to `http://localhost:3001/api` to see the backend swagger interface

## Utils commands

* Import account from private key for default use in project:

```shell
yarn account:import
```
