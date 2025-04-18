import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import { router as authRouter } from "./routes/auth";
import Session from "express-session";
import { isAuthenticated } from "./middlewares/auth";

dotenv.config();

const app = express();

// never do it in production
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  Session({
    name: "final-project",
    secret: "final-project-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true },
  }),
);

app.use("/", router);
app.use("/auth", authRouter);

export default app;
