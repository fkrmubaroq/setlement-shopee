import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler";
import type { AuthUser } from "@setlement-shopee/types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payloadStr = Buffer.from(token, "base64").toString("utf8");
    const payload = JSON.parse(payloadStr);

    if (!payload.userId || !payload.email || !payload.role) {
      throw new Error("Invalid token payload");
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name || "",
      role: payload.role,
      id_brand: payload.id_brand || null,
    };
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireRole = (
  roles: Array<"super_admin" | "admin" | "user_brand">,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    if (!roles.includes(req.user.role as any)) {
      return next(new AppError("Forbidden: Insufficient permissions", 403));
    }
    next();
  };
};
