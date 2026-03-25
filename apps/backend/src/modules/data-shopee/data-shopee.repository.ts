import type { DataShopee } from "@setlement-shopee/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../config/db";

type DataShopeeRow = RowDataPacket & DataShopee;

export const createDataShopee = async (
  data: Omit<DataShopee, "id" | "created_at" | "updated_at">
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO data_shopee (
      id_brand, 
      dari_tanggal, 
      sampai_tanggal, 
      shopee_penghasilan_saya, 
      shopee_pesanan_saya, 
      shopee_biaya_iklan
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.id_brand,
      data.dari_tanggal,
      data.sampai_tanggal,
      data.shopee_penghasilan_saya,
      data.shopee_pesanan_saya,
      data.shopee_biaya_iklan,
    ]
  );
  return result.insertId;
};

export const findAllDataShopee = async (): Promise<DataShopeeRow[]> => {
  const [rows] = await pool.execute<DataShopeeRow[]>(
    "SELECT * FROM data_shopee ORDER BY created_at DESC"
  );
  return rows;
};

export const findDataShopeeById = async (id: number): Promise<DataShopeeRow | null> => {
  const [rows] = await pool.execute<DataShopeeRow[]>(
    "SELECT * FROM data_shopee WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
};
