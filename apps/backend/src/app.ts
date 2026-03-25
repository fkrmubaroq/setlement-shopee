import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { errorHandler } from "./middlewares/error-handler";
import { authRouter } from "./modules/auth/auth.route";
import { brandRouter } from "./modules/brand/brand.route";
import dataShopeeRouter from "./modules/data-shopee/data-shopee.route";
import { hppProdukRouter } from "./modules/hpp-produk/hpp-produk.route";

export const createApp = (): express.Application => {
  const app = express();

  // Global middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure uploads directory exists
  const uploadPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  // Static files for uploads
  app.use("/uploads", express.static(uploadPath));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/hpp-produk", hppProdukRouter);
  app.use("/api/data-shopee", dataShopeeRouter);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
