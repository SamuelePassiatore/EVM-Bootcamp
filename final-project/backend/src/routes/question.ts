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
      { questionLevel: level },
      { new: true },
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ questionLevel: user.questionLevel });
    return;
  } catch (error) {
    console.error("Error updating last level:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
});

router.post("/wrong-answer", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.siwe!.userId;
    
    const now = new Date();
    await User.findByIdAndUpdate(
      userId,
      { 
        lastWrongAnswerTime: now,
        isBlocked: true
      },
      { new: true }
    );
    
    res.status(200).json({ success: true, blockedUntil: new Date(now.getTime() + 12000) });
  } catch (error) {
    console.error("Error updating wrong answer status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user-data", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.siwe!.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    let isBlocked = false;
    let blockedUntil = null;
    
    if (user.isBlocked && user.lastWrongAnswerTime) {
      const blockDuration = 60000;
      const blockEndTime = new Date(user.lastWrongAnswerTime.getTime() + blockDuration);
      const now = new Date();
      
      if (now < blockEndTime) {
        isBlocked = true;
        blockedUntil = blockEndTime;
      } else {
        user.isBlocked = false;
        await user.save();
      }
    }
    
    const userData = {
      id: user._id,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      questionLevel: user.questionLevel || 0,
      mintedNFT: user.mintedNFT || false,
      isBlocked,
      blockedUntil
    };
    res.status(200).json(userData);
    return;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
