import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    const ext = path.extname(file.originalname).substring(1);
    const filename = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return {
      folder: env.UPLOAD_DIR,
      resource_type: "raw", // For non-image files like xlsx, csv
      public_id: `${filename}.${ext}`,
    };
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file Excel (.xlsx, .xls) atau CSV yang diizinkan"));
    }
  },
});
