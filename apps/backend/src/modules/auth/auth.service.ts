import type { AuthResponse, AuthUser } from "@setlement-shopee/types";
import { AppError } from "../../middlewares/error-handler";
import { createUser, findUserByEmail } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";

// NOTE: In production, use bcrypt for hashing and jsonwebtoken for JWT
// These are simplified placeholders for the boilerplate

const hashPassword = (password: string): string => {
  // TODO: Replace with bcrypt.hashSync(password, 10)
  return Buffer.from(password).toString("base64");
};

const verifyPassword = (password: string, hash: string): boolean => {
  // TODO: Replace with bcrypt.compareSync(password, hash)
  return Buffer.from(password).toString("base64") === hash;
};

const generateToken = (userId: number, email: string): string => {
  // TODO: Replace with jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  return Buffer.from(JSON.stringify({ userId, email, iat: Date.now() })).toString("base64");
};

export const login = async (input: LoginInput): Promise<{ auth: AuthResponse; user: AuthUser }> => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateToken(user.id, user.email);
  const refreshToken = generateToken(user.id, user.email);

  return {
    auth: { accessToken, refreshToken },
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const register = async (
  input: RegisterInput
): Promise<{ auth: AuthResponse; user: AuthUser }> => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = hashPassword(input.password);
  const userId = await createUser(input.name, input.email, hashedPassword);

  const accessToken = generateToken(userId, input.email);
  const refreshToken = generateToken(userId, input.email);

  return {
    auth: { accessToken, refreshToken },
    user: { id: userId, name: input.name, email: input.email },
  };
};
