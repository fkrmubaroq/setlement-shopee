import type { AuthUser, LoginRequest, RegisterRequest } from "@setlement-shopee/types";

export type AuthTokenPayload = {
  userId: number;
  email: string;
};

export type { AuthUser, LoginRequest, RegisterRequest };

