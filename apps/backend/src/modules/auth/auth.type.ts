import type { AuthUser, LoginRequest, RegisterRequest } from "shared-types";

export type AuthTokenPayload = {
  userId: number;
  email: string;
};

export type { AuthUser, LoginRequest, RegisterRequest };

