import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface";

const userSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastCompletedLevel: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
