import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 8001;
export const mongodb_uri = process.env.MONGODB_URI;
export const reownProjectId = process.env.REOWN_PROJECT_ID;
