import express from "express";
import Question from "../schema/question";
import User from "../schema/user";
import { isAuthenticated } from "../middlewares/auth";

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

router.post("/update-level", isAuthenticated, async (req, res) => {
  try {
    const { level } = req.body;

    if (typeof level !== "number" || level < 0) {
      res.status(400).json({ message: "Invalid level" });
      return;
    }

    const userId = req.session.siwe!.userId;
    console.log(`userId: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { lastCompletedLevel: level },
      { new: true },
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ lastCompletedLevel: user.lastCompletedLevel });
    return;
  } catch (error) {
    console.error("Error updating last level:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

export default router;
