import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { authRouter } from "./modules/auth/auth.route";

export const createApp = (): express.Application => {
  const app = express();

  // Global middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  // API routes
  app.use("/api/auth", authRouter);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
