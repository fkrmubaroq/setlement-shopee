import type { DataShopee } from "@setlement-shopee/types";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../config/db";

type DataShopeeRow = RowDataPacket & DataShopee;

export const createDataShopee = async (
  data: Omit<DataShopee, "id" | "created_at" | "updated_at">,
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
    ],
  );
  return result.insertId;
};

export const findAllDataShopee = async (): Promise<DataShopeeRow[]> => {
  const [rows] = await pool.execute<DataShopeeRow[]>(
    "SELECT * FROM data_shopee ORDER BY created_at DESC",
  );
  return rows;
};

export const findDataShopeeById = async (
  id: number,
): Promise<DataShopeeRow | null> => {
  const [rows] = await pool.execute<DataShopeeRow[]>(
    "SELECT * FROM data_shopee WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] ?? null;
};

export const updateDataShopee = async (
  id: number,
  data: Partial<Omit<DataShopee, "id" | "created_at" | "updated_at">>,
): Promise<boolean> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.id_brand !== undefined) {
    fields.push("id_brand = ?");
    values.push(data.id_brand);
  }
  if (data.dari_tanggal !== undefined) {
    fields.push("dari_tanggal = ?");
    values.push(data.dari_tanggal);
  }
  if (data.sampai_tanggal !== undefined) {
    fields.push("sampai_tanggal = ?");
    values.push(data.sampai_tanggal);
  }
  if (data.shopee_penghasilan_saya !== undefined) {
    fields.push("shopee_penghasilan_saya = ?");
    values.push(data.shopee_penghasilan_saya);
  }
  if (data.shopee_pesanan_saya !== undefined) {
    fields.push("shopee_pesanan_saya = ?");
    values.push(data.shopee_pesanan_saya);
  }
  if (data.shopee_biaya_iklan !== undefined) {
    fields.push("shopee_biaya_iklan = ?");
    values.push(data.shopee_biaya_iklan);
  }

  if (fields.length === 0) return false;
  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE data_shopee SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows > 0;
};

export const deleteDataShopee = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM data_shopee WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};
