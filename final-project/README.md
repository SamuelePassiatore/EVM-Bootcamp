# QuizChain dApp Setup Guide

This guide will walk you through setting up and running the QuizChain application on your local machine. QuizChain is a web3 blockchain quiz game where users can test their blockchain knowledge, earn rewards, and mint NFTs based on their progress.

## Table of Contents

- [QuizChain dApp Setup Guide](#quizchain-dapp-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
  - [MongoDB Atlas Setup](#mongodb-atlas-setup)
  - [Environment Configuration](#environment-configuration)
    - [1. Backend Configuration](#1-backend-configuration)
    - [2. Frontend Configuration](#2-frontend-configuration)
  - [Running the Application](#running-the-application)
    - [1. Seed the Database](#1-seed-the-database)
    - [2. Start the Backend Server](#2-start-the-backend-server)
    - [3. Start the Frontend Development Server](#3-start-the-frontend-development-server)
  - [Smart Contract Deployment](#smart-contract-deployment)
    - [1. Start a Local Blockchain](#1-start-a-local-blockchain)
    - [2. Deploy the Contract](#2-deploy-the-contract)
  - [Testing the Application](#testing-the-application)

## Project Overview

QuizChain consists of three main components:

1. **Frontend**: React application with TypeScript and Vite
2. **Backend**: Express.js server with MongoDB
3. **Smart Contracts**: Solidity contracts for NFT rewards

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn
- Git
- A code editor (VS Code recommended)
- A modern web browser
- A crypto wallet (MetaMask recommended)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd final-project
```

### 2. Install Dependencies

You need to install dependencies for each part of the application:

```bash
# Install frontend dependencies
cd final-project/frontend
npm install

# Install backend dependencies
cd final-project/backend
npm install

# Install smart contract dependencies
cd final-project/contracts
npm install
```

## MongoDB Atlas Setup

The application uses MongoDB as its database. Here's how to set it up:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Build a database (choose the FREE shared cluster option)
4. Set up database access:
   - Go to "Database Access" and add a new database user
   - Choose "Password" authentication
   - Create a username and password (save these for later)
   - Set privileges to "Read and write to any database"
5. Set up network access:
   - Go to "Network Access" and click "Add IP Address"
   - Choose "Allow access from anywhere" for development purposes
6. Get your connection string:
   - Go to "Databases" and click "Connect" on your cluster
   - Choose "Connecting with MongoDB for VS Code"
   - Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/`)
   - Replace `<username>` and `<password>` with your database user credentials

## Environment Configuration

### 1. Backend Configuration

Create a `.env` file in the `backend` directory by copying the `.env.example` file.

Complete the following content to the `.env` file:

```.env
MONGODB_URI=
PORT=
REOWN_PROJECT_ID=
```

With the following values:

- The MongoDB URI with your actual connection string
- Your REOWN project ID with a project ID from [reown.xyz](https://reown.xyz/) (you can use any placeholder for now if you don't have one)
- The port number (default is `8001`)

### 2. Frontend Configuration

Create a `.env` file in the `frontend` directory by copying the `.env.example` file.

Complete the content to the `.env` file with the following:

```.env
VITE_API_URL=http://localhost:8001
VITE_REOWN_PROJECT_ID=your-reown-project-id
```

Use the same project ID as in the backend.

## Running the Application

### 1. Seed the Database

First, seed the MongoDB database with initial questions:

```bash
cd final-project/backend
npx tsx scripts/seed-db.ts
```

You should see a success message confirming that questions have been saved.

### 2. Start the Backend Server

```bash
cd final-project/backend
npm run dev
```

The server should start at <http://localhost:8001>

### 3. Start the Frontend Development Server

In a new terminal:

```bash
cd final-project/frontend
npm run dev
```

The frontend should be available at <http://localhost:5173> (or another port if 5173 is in use)

## Smart Contract Deployment

### 1. Start a Local Blockchain

In a new terminal:

```bash
cd final-project/contracts
npx hardhat node
```

This will start a local Ethereum network and print out several test accounts with private keys.

### 2. Deploy the Contract

In another terminal:

```bash
cd final-project/contracts
npx hardhat run scripts/deploy.ts --network localhost
```

You should see a success message with the contract address. **Note this address** for future reference.

## Testing the Application

1. Open your browser and navigate to <http://localhost:5173>
2. You should see the QuizChain welcome page
3. Click on the "Connect" button to connect your wallet
   - You may need to configure MetaMask to connect to your local network:
     - Network Name: Hardhat
     - RPC URL: <http://127.0.0.1:8545>
     - Chain ID: 31337
     - Currency Symbol: ETH
4. Once connected, you can start answering blockchain questions
5. Complete the quiz to see your progress saved

---

If you encounter any issues, please refer to the documentation for the specific technologies or open an issue in the project repository.
