import type { AuthResponse, AuthUser } from "@setlement-shopee/types";
import bcrypt from "bcrypt";
import { AppError } from "../../middlewares/error-handler";
import { createUser, findUserByEmail } from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schema";

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (
  userId: number,
  email: string,
  role: string,
  id_brand: number | null,
): string => {
  // TODO: Replace with jwt.sign({ userId, email, role, id_brand }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  return Buffer.from(
    JSON.stringify({ userId, email, role, id_brand, iat: Date.now() }),
  ).toString("base64");
};

export const login = async (
  input: LoginInput,
): Promise<{ auth: AuthResponse; user: AuthUser }> => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateToken(
    user.id,
    user.email,
    user.role,
    user.id_brand,
  );
  const refreshToken = generateToken(
    user.id,
    user.email,
    user.role,
    user.id_brand,
  );

  return {
    auth: { accessToken, refreshToken },
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      id_brand: user.id_brand,
    },
  };
};

export const register = async (
  input: RegisterInput,
): Promise<{ auth: AuthResponse; user: AuthUser }> => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = hashPassword(input.password);
  const userId = await createUser(input.name, input.email, hashedPassword);

  // default role for new user
  const role = "user_brand";
  const id_brand = null;

  const accessToken = generateToken(userId, input.email, role, id_brand);
  const refreshToken = generateToken(userId, input.email, role, id_brand);

  return {
    auth: { accessToken, refreshToken },
    user: { id: userId, name: input.name, email: input.email, role, id_brand },
  };
};
