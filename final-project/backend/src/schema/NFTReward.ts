import mongoose, { Schema } from "mongoose";
import { INFTReward } from "../interface";

const NFTRewardSchema = new Schema<INFTReward>({
  level: {
    type: Number,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  svgCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NFTReward = mongoose.model("NFTReward", NFTRewardSchema);

export default NFTReward;
