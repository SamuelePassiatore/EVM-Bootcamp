import express from "express";
import Question from "../schema/question";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ level: 1 });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;