import type { ApiResponse, AuthResponse, AuthUser } from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../utils/response";
import type { LoginInput, RegisterInput } from "./auth.schema";
import * as authService from "./auth.service";

type AuthResponseData = {
  auth: AuthResponse;
  user: AuthUser;
};

export const login = async (
  req: Request<unknown, ApiResponse<AuthResponseData>, LoginInput>,
  res: Response<ApiResponse<AuthResponseData>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request<unknown, ApiResponse<AuthResponseData>, RegisterInput>,
  res: Response<ApiResponse<AuthResponseData>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    sendCreated(res, result, "Registration successful");
  } catch (error) {
    next(error);
  }
};
