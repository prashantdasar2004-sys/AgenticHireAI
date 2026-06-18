import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());

  app.get("/health", (req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.get("/", (req, res) => {
    res.json({ success: true, data: { name: "AgenticHireAI API", status: "ok" } });
  });

  app.use("/auth", authRoutes);
  app.use("/jobs", jobRoutes);
  app.use("/candidates", candidateRoutes);
  app.use("/workflow", workflowRoutes);
  app.use(errorHandler);

  return app;
}
