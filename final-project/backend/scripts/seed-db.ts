import Question from "../src/schema/question";
import User from "../src/schema/user";
import connectDB from "../src/lib/mongo";

const seedQuestions = async () => {
  await Question.deleteMany();

  const fixedQuestions = [
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

  await Question.insertMany(fixedQuestions);
  console.log("✅ 7 questions successfully saved!");
};
const seedUsers = async () => {
  await User.deleteMany();

  const user = await User.insertOne({
    walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  });
  console.log(`✅ User ${user.id} successfully saved!`);
  return user;
};

(async () => {
  const db = await connectDB();
  await seedQuestions();
  await seedUsers();
  await db.disconnect();
})().catch((err) => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
