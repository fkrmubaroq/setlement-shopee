import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "@setlement-shopee/types";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validateRequest = (
  schema: ZodSchema,
  target: ValidationTarget = "body"
) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: errors,
      });
      return;
    }

    req[target] = result.data;
    next();
  };
};
