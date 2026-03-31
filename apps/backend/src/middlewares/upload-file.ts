import type { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import { env } from "../config/env";
import { AppError } from "./error-handler";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: env.UPLOAD_DIR,
      resource_type: isImage ? "image" : "raw",
      public_id: isImage ? filename : `${filename}.${ext}`,
    };
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});

export const uploadSingle = (fieldName: string): RequestHandler =>
  upload.single(fieldName);
export const uploadMultiple = (
  fieldName: string,
  maxCount: number,
): RequestHandler => upload.array(fieldName, maxCount);
