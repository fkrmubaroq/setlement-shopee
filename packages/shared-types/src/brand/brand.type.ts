import { z } from "zod";

export const BrandSchema = z.object({
  id: z.number().int().positive(),
  nama_brand: z.string().min(1, "Nama brand tidak boleh kosong").max(255),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateBrandRequestSchema = z.object({
  nama_brand: z.string().min(1, "Nama brand tidak boleh kosong").max(255),
});

export const UpdateBrandRequestSchema = z.object({
  nama_brand: z.string().min(1, "Nama brand tidak boleh kosong").max(255).optional(),
});

export type Brand = z.infer<typeof BrandSchema>;
export type CreateBrandRequest = z.infer<typeof CreateBrandRequestSchema>;
export type UpdateBrandRequest = z.infer<typeof UpdateBrandRequestSchema>;
