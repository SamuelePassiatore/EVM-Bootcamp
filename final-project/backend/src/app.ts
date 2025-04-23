import express from "express";
import cors from "cors";
import router from "./routes/index";
import { router as authRouter } from "./routes/auth";
import questionRouter from "./routes/question";
import nftRewardRouter from "./routes/nftReward";
import testingRouter from "./routes/testing";
import Session from "express-session";
import usersRouter from "./routes/users";
import activityRouter from "./routes/activity";

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
  }),
);

// Routes
app.use("/", router);
app.use("/auth", authRouter);
app.use("/questions", questionRouter);
app.use("/testing", testingRouter);
app.use("/nft", nftRewardRouter);
app.use("/users", usersRouter);
app.use("/activity", activityRouter);

export default app;
