import mongoose from "mongoose";
import { mongodb_uri } from "../constants";

const connectDB = async () => {
  try {
    const uri = mongodb_uri;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
