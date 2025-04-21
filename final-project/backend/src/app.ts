import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import { router as authRouter } from "./routes/auth";
import questionRouter from "./routes/question";
import Session from "express-session";
import { isAuthenticated } from "./middlewares/auth";
import nftRouter from './routes/nft';

dotenv.config();

const app = express();

// never do it in production
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  Session({
    name: "final-project",
    secret: process.env.SESSION_SECRET ?? "final-project-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: "lax" },
  })
);

// Routes
app.use("/", router);
app.use("/auth", authRouter);
app.use("/questions", questionRouter);
app.use('/nft', nftRouter);

export default app;
