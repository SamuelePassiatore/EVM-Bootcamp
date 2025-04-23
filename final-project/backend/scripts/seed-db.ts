import Question from "../src/schema/question";
import User from "../src/schema/user";
import connectDB from "../src/lib/mongo";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const seedQuestions = async () => {
  try {
    console.log("Removing existing questions...");
    await Question.deleteMany({});

    const questions = [
      {
        level: 1,
        text: "What is a blockchain?",
        options: [
          "A centralized database owned by a single company",
          "A distributed ledger technology that records transactions across multiple computers",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 2,
        text: "Which of these is NOT a property of most blockchain systems?",
        options: [
          "Data can be easily modified after being recorded",
          "Transactions are verified by a network of computers",
        ],
        correctOptionIndex: 0,
      },
      {
        level: 3,
        text: "What is a smart contract?",
        options: [
          "A self-executing contract with the terms directly written into code",
          "A legal contract written by AI",
        ],
        correctOptionIndex: 0,
      },
      {
        level: 4,
        text: "What is a 'gas fee' in Ethereum?",
        options: [
          "A fee charged by gas stations to fuel mining equipment",
          "The cost required to perform a transaction on the Ethereum blockchain"
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        text: "What is the primary purpose of a cryptocurrency wallet?",
        options: [
          "To physically store digital coins",
          "To securely store private keys that give access to your cryptocurrency"
        ],
        correctOptionIndex: 1,
      },
      {
        level: 6,
        text: "What does DeFi stand for?",
        options: [
          "Decentralized Finance",
          "Digital Financial Instruments"
        ],
        correctOptionIndex: 0,
      },
      {
        level: 7,
        text: "What is the purpose of consensus mechanisms in blockchain?",
        options: [
          "To reach agreement on transaction data without a central authority",
          "To verify user identities before allowing transactions"
        ],
        correctOptionIndex: 0,
      }
    ];

    const result = await Question.insertMany(questions);
    console.log(`✅ ${result.length} questions successfully saved!`);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
  }
};

const seedUsers = async () => {
  try {
    // Only delete users in development mode to avoid data loss in production
    if (process.env.NODE_ENV === 'development') {
      console.log("Removing existing test users...");
      await User.deleteMany({});
    }

    // Test wallet address
    const testWalletAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    
    // Check if the test user already exists
    const existingUser = await User.findOne({ walletAddress: testWalletAddress });
    
    if (existingUser) {
      console.log(`✅ Test user already exists with ID: ${existingUser._id}`);
      return existingUser;
    }
    
    // Create new test user
    const user = await User.create({
      walletAddress: testWalletAddress,
      createdAt: new Date(),
      questionLevel: 1,
      mintedNFT: false
    });
    
    console.log(`✅ Test user created with ID: ${user._id}`);
    return user;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    return null;
  }
};

// Self-executing async function
(async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    
    console.log("Seeding questions...");
    await seedQuestions();
    
    console.log("Seeding users...");
    await seedUsers();
    
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  } finally {
    // Close the database connection when done
    try {
      await mongoose.disconnect();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
    
    // Exit the process with appropriate code
    if (mongoose.connection.readyState === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
})();