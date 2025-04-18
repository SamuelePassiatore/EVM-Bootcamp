import app from "./app";
import { port } from "./constants";
import connectDB from "./lib/mongo";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
