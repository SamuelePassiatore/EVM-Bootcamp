import mongoose, { Schema } from "mongoose";
import { IQuestion } from "../interface";

const questionSchema = new Schema<IQuestion>({
  level: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
