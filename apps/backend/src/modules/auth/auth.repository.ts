import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../config/db";

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "user_brand";
  id_brand: number | null;
  created_at: string;
  updated_at: string;
};

export const findUserByEmail = async (
  email: string,
): Promise<UserRow | null> => {
  const [rows] = await pool.execute<UserRow[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  return rows[0] ?? null;
};

export const findUserById = async (id: number): Promise<UserRow | null> => {
  const [rows] = await pool.execute<UserRow[]>(
    "SELECT id, name, email, role, id_brand, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] ?? null;
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
  );
  return result.insertId;
};
