import type { Brand } from "@setlement-shopee/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../config/db";

type BrandRow = RowDataPacket & Brand;

export const findAllBrands = async (): Promise<BrandRow[]> => {
  const [rows] = await pool.execute<BrandRow[]>("SELECT * FROM brand ORDER BY id DESC");
  return rows;
};

export const findBrandById = async (id: number): Promise<BrandRow | null> => {
  const [rows] = await pool.execute<BrandRow[]>("SELECT * FROM brand WHERE id = ? LIMIT 1", [id]);
  return rows[0] ?? null;
};

export const createBrand = async (namaBrand: string): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO brand (nama_brand) VALUES (?)",
    [namaBrand]
  );
  return result.insertId;
};

export const updateBrand = async (id: number, namaBrand: string): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE brand SET nama_brand = ? WHERE id = ?",
    [namaBrand, id]
  );
  return result.affectedRows > 0;
};

export const deleteBrand = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM brand WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};
