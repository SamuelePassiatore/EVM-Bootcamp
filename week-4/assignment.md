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
* Initiate your local workspace with :

```shell
yarn install
```

* Import your `.env` file in the root of the project

**Be sure to have the following environment variables:**

```env
NEXT_PUBLIC_TOKEN_ADDRESS="0xEe30BaA4275D5EFbE6418cAc7DD1Cd1f43810c8E"
NEXT_PUBLIC_BALLOT_ADDRESS="0x958192c1479731d3b3c554510c4cc1398628aafb"
```

Thoses are the already deployed `MyToken.sol` and `TokenizedBallot.sol` contracts addresses (used for last weekend project).

## Utils commands

* Import account from private key for default use in project:

```shell
yarn account:import
```
