import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import * as authController from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";

export const authRouter: import("express").Router = Router();

authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post("/register", validateRequest(registerSchema), authController.register);
