import express from "express";
import Question from "../schema/question";
import User from "../schema/user";

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

router.post("/update-level", async (req, res) => {
    try {
  
      if (!req.session.siwe?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { level } = req.body;
  
      if (typeof level !== 'number' || level < 0) {
        return res.status(400).json({ message: "Invalid level" });
      }
  
      const user = await User.findByIdAndUpdate(
        req.session.siwe.userId, 
        { lastCompletedLevel: level }, 
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ lastCompletedLevel: user.lastCompletedLevel });
    } catch (error) {
      console.error("Error updating last level:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

export default router;