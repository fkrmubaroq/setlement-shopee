import type { Brand, CreateBrandRequest, UpdateBrandRequest } from "@setlement-shopee/types";
import { AppError } from "../../middlewares/error-handler";
import * as brandRepo from "./brand.repository";

export const getAllBrands = async (): Promise<Brand[]> => {
  return await brandRepo.findAllBrands();
};

export const getBrandById = async (id: number): Promise<Brand> => {
  const brand = await brandRepo.findBrandById(id);
  if (!brand) {
    throw new AppError("Brand tidak ditemukan", 404);
  }
  return brand;
};

export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const insertId = await brandRepo.createBrand(data.nama_brand);
  return await getBrandById(insertId);
};

export const updateBrand = async (id: number, data: UpdateBrandRequest): Promise<Brand> => {
  const brand = await brandRepo.findBrandById(id);
  if (!brand) {
    throw new AppError("Brand tidak ditemukan", 404);
  }

  const newNamaBrand = data.nama_brand ?? brand.nama_brand;
  await brandRepo.updateBrand(id, newNamaBrand);

  return await getBrandById(id);
};

export const deleteBrand = async (id: number): Promise<void> => {
  const brand = await brandRepo.findBrandById(id);
  if (!brand) {
    throw new AppError("Brand tidak ditemukan", 404);
  }

  // Handle foreign key constraint here if needed or let DB throw error.
  await brandRepo.deleteBrand(id);
};
