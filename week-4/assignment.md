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

## Utils commands

* Import account from private key for default use in project:

```shell
yarn account:import
```

* Deploy smart contracts to sepolia testnet:

```shell
yarn deploy [contract-tag] --network sepolia
```
