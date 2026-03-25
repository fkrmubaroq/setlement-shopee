import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "@setlement-shopee/types";
import { httpClient } from "../http-client";

type AuthResponseData = {
  auth: AuthResponse;
  user: AuthUser;
};

export const authApi = {
  login: (data: LoginRequest) =>
    httpClient.post<AuthResponseData>("/auth/login", data),

  register: (data: RegisterRequest) =>
    httpClient.post<AuthResponseData>("/auth/register", data),
};
