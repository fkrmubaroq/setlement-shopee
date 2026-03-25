import { z } from "zod";

export const HppProdukSchema = z.object({
  id: z.number().int().positive(),
  id_brand: z.number().int().positive(),
  nama_produk: z.string().min(1, "Nama produk tidak boleh kosong").max(255),
  hpp: z.string().min(1, "HPP tidak boleh kosong").max(255),
  variasi_1: z.string().max(255).optional().nullable(),
  variasi_2: z.string().max(255).optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateHppProdukRequestSchema = z.object({
  id_brand: z.number().int().positive("ID Brand harus diisi"),
  nama_produk: z.string().min(1, "Nama produk tidak boleh kosong").max(255),
  hpp: z.string().min(1, "HPP tidak boleh kosong").max(255),
  variasi_1: z.string().max(255).optional().nullable(),
  variasi_2: z.string().max(255).optional().nullable(),
});

export const UpdateHppProdukRequestSchema = z.object({
  id_brand: z.number().int().positive().optional(),
  nama_produk: z.string().min(1, "Nama produk tidak boleh kosong").max(255).optional(),
  hpp: z.string().min(1, "HPP tidak boleh kosong").max(255).optional(),
  variasi_1: z.string().max(255).optional().nullable(),
  variasi_2: z.string().max(255).optional().nullable(),
});

export type HppProduk = z.infer<typeof HppProdukSchema>;
export type CreateHppProdukRequest = z.infer<typeof CreateHppProdukRequestSchema>;
export type UpdateHppProdukRequest = z.infer<typeof UpdateHppProdukRequestSchema>;

export const CreateHppProdukBulkRequestSchema = z.array(CreateHppProdukRequestSchema);
export type CreateHppProdukBulkRequest = z.infer<typeof CreateHppProdukBulkRequestSchema>;
