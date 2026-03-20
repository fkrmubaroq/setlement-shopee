import type { Response } from "express";
import type { ApiResponse } from "shared-types";

export const sendSuccess = <T>(
  res: Response<ApiResponse<T>>,
  data: T,
  message = "Success",
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = <T>(
  res: Response<ApiResponse<T>>,
  data: T,
  message = "Created successfully"
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendError = (
  res: Response<ApiResponse>,
  message = "Something went wrong",
  statusCode = 500,
  error?: unknown
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export const sendNotFound = (
  res: Response<ApiResponse>,
  message = "Resource not found"
): void => {
  sendError(res, message, 404);
};
