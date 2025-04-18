import mongoose from 'mongoose';
import Question from '../src/schema/question';
import connectDB from '../src/lib/mongo';

const seedQuestions = async () => {
  await connectDB();

  await Question.deleteMany();

  const fixedQuestions = [
    {
      level: 1,
      text: "What is a blockchain?",
      options: [
        "A centralized database owned by a single company",
        "A distributed ledger technology that records transactions across multiple computers"
      ],
      correctOptionIndex: 1
    },
    {
      level: 2,
      text: "Which of these is NOT a property of most blockchain systems?",
      options: [
        "Data can be easily modified after being recorded",
        "Transactions are verified by a network of computers"
      ],
      correctOptionIndex: 0
    },
    {
      level: 3,
      text: "What is a smart contract?",
      options: [
        "A self-executing contract with the terms directly written into code",
        "A legal contract written by AI"
      ],
      correctOptionIndex: 0
    }
  ];

  await Question.insertMany(fixedQuestions);
  console.log('✅ 3 questions successfully saved!');
  process.exit(0);
};

seedQuestions().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});