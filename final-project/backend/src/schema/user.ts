import mongoose, { Schema } from "mongoose";

interface IUser {
  username: string;
  walletAddress: string;
  createdAt: Date;
}

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
});

const User = mongoose.model("User", userSchema);

export default User;
