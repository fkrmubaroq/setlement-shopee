import type { HppProduk } from "@setlement-shopee/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../config/db";

type HppProdukRow = RowDataPacket & HppProduk;

interface FindAllHppProdukParams {
  page: number;
  limit: number;
  search?: string;
  idBrand?: number;
}

export const findAllHppProduk = async ({ page, limit, search, idBrand }: FindAllHppProdukParams): Promise<{ data: HppProdukRow[]; total: number }> => {
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM hpp_produk";
  let countQuery = "SELECT COUNT(*) as total FROM hpp_produk";
  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (idBrand) {
    conditions.push("id_brand = ?");
    queryParams.push(idBrand);
  }

  if (search) {
    conditions.push("nama_produk LIKE ?");
    queryParams.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    const whereClause = " WHERE " + conditions.join(" AND ");
    query += whereClause;
    countQuery += whereClause;
  }

  query += ` ORDER BY id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
  
  const [countResult] = await pool.query<RowDataPacket[]>(countQuery, queryParams);
  const total = countResult[0].total as number;

  const [rows] = await pool.query<HppProdukRow[]>(query, queryParams);

  return { data: rows, total };
};

export const findHppProdukById = async (id: number): Promise<HppProdukRow | null> => {
  const [rows] = await pool.execute<HppProdukRow[]>(
    "SELECT * FROM hpp_produk WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
};

export const createHppProduk = async (
  idBrand: number,
  namaProduk: string,
  hpp: string,
  variasi1?: string | null,
  variasi2?: string | null
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO hpp_produk (id_brand, nama_produk, hpp, variasi_1, variasi_2) VALUES (?, ?, ?, ?, ?)",
    [idBrand, namaProduk, hpp, variasi1 ?? null, variasi2 ?? null]
  );
  return result.insertId;
};

export const bulkCreateHppProduk = async (
  items: { id_brand: number; nama_produk: string; hpp: string; variasi_1?: string | null; variasi_2?: string | null }[]
): Promise<number> => {
  if (items.length === 0) return 0;
  
  const placeholders = items.map(() => "(?, ?, ?, ?, ?)").join(", ");
  const values = items.flatMap(item => [item.id_brand, item.nama_produk, item.hpp, item.variasi_1 ?? null, item.variasi_2 ?? null]);
  
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO hpp_produk (id_brand, nama_produk, hpp, variasi_1, variasi_2) VALUES ${placeholders}`,
    values
  );
  return result.affectedRows;
};

export const updateHppProduk = async (
  id: number,
  idBrand: number,
  namaProduk: string,
  hpp: string,
  variasi1?: string | null,
  variasi2?: string | null
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE hpp_produk SET id_brand = ?, nama_produk = ?, hpp = ?, variasi_1 = ?, variasi_2 = ? WHERE id = ?",
    [idBrand, namaProduk, hpp, variasi1 ?? null, variasi2 ?? null, id]
  );
  return result.affectedRows > 0;
};

export const deleteHppProduk = async (idBrand: number, id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM hpp_produk WHERE id_brand = ? AND id = ?",
    [idBrand, id]
  );
  return result.affectedRows > 0;
};

export const clearHppProdukByBrand = async (idBrand: number): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM hpp_produk WHERE id_brand = ?",
    [idBrand]
  );
  return result.affectedRows;
};

export const findAllHppProdukByBrandId = async (idBrand: number): Promise<HppProdukRow[]> => {
  const [rows] = await pool.execute<HppProdukRow[]>(
    "SELECT * FROM hpp_produk WHERE id_brand = ?",
    [idBrand]
  );
  return rows;
}