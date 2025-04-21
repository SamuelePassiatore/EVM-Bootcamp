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
  questionLevel: {
    type: Number,
    default: 1,
  },
  mintedNFT: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", userSchema);

export default User;