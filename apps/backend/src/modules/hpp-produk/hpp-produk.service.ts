import type { CreateHppProdukRequest, HppProduk, PaginatedResponse, UpdateHppProdukRequest } from "@setlement-shopee/types";
import { AppError } from "../../middlewares/error-handler";
import * as hppProdukRepo from "./hpp-produk.repository";

export const getAllHppProduk = async (
  page: number,
  limit: number,
  search?: string,
  idBrand?: number
): Promise<PaginatedResponse<HppProduk>> => {
  const { data, total } = await hppProdukRepo.findAllHppProduk({ page, limit, search, idBrand });
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    message: "Berhasil mengambil data HPP Produk",
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getHppProdukByBrandId = async (idBrand: number) => {
  const data = await hppProdukRepo.findAllHppProdukByBrandId(idBrand)
  return data;
}

export const getHppProdukById = async (id: number): Promise<HppProduk> => {
  const item = await hppProdukRepo.findHppProdukById(id);
  if (!item) {
    throw new AppError("HPP Produk tidak ditemukan", 404);
  }
  return item;
};

export const createHppProduk = async (data: CreateHppProdukRequest): Promise<HppProduk> => {
  // Option: We could verify if the brand exists here using brandRepo.findBrandById
  const insertId = await hppProdukRepo.createHppProduk(
    data.id_brand,
    data.nama_produk,
    data.hpp,
    data.variasi_1,
    data.variasi_2
  );
  return await getHppProdukById(insertId);
};

export const bulkCreateHppProduk = async (data: CreateHppProdukRequest[]): Promise<number> => {
  return await hppProdukRepo.bulkCreateHppProduk(data);
};

export const updateHppProduk = async (id: number, data: UpdateHppProdukRequest): Promise<HppProduk> => {
  const item = await hppProdukRepo.findHppProdukById(id);
  if (!item) {
    throw new AppError("HPP Produk tidak ditemukan", 404);
  }

  const newIdBrand = data.id_brand ?? item.id_brand;
  const newNamaProduk = data.nama_produk ?? item.nama_produk;
  const newHpp = data.hpp ?? item.hpp;
  const newVariasi1 = data.variasi_1 !== undefined ? data.variasi_1 : item.variasi_1;
  const newVariasi2 = data.variasi_2 !== undefined ? data.variasi_2 : item.variasi_2;

  await hppProdukRepo.updateHppProduk(id, newIdBrand, newNamaProduk, newHpp, newVariasi1, newVariasi2);

  return await getHppProdukById(id);
};

export const deleteHppProduk = async (idBrand: number, id: number): Promise<void> => {
  const item = await hppProdukRepo.findHppProdukById(id);
  if (!item || item.id_brand !== idBrand) {
    throw new AppError("HPP Produk tidak ditemukan", 404);
  }

  await hppProdukRepo.deleteHppProduk(idBrand, id);
};

export const clearHppProdukByBrand = async (idBrand: number): Promise<number> => {
  // Option: We could verify if the brand exists here too
  return await hppProdukRepo.clearHppProdukByBrand(idBrand);
};
