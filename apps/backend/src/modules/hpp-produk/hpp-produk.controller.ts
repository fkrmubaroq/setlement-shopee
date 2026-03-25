import type { ApiResponse, CreateHppProdukRequest, HppProduk, PaginatedResponse, UpdateHppProdukRequest } from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../utils/response";
import * as hppProdukService from "./hpp-produk.service";

export const getAllHppProduk = async (
  req: Request,
  res: Response<PaginatedResponse<HppProduk>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string | undefined;
    const idBrand = req.query.id_brand ? parseInt(req.query.id_brand as string, 10) : undefined;

    const result = await hppProdukService.getAllHppProduk(page, limit, search, idBrand);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getHppProdukById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<HppProduk>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await hppProdukService.getHppProdukById(parseInt(req.params.id, 10));
    sendSuccess(res, data, "Berhasil mengambil data HPP Produk");
  } catch (error) {
    next(error);
  }
};

export const createHppProduk = async (
  req: Request<unknown, ApiResponse<HppProduk>, CreateHppProdukRequest>,
  res: Response<ApiResponse<HppProduk>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await hppProdukService.createHppProduk(req.body);
    sendCreated(res, data, "Berhasil menambahkan HPP Produk");
  } catch (error) {
    next(error);
  }
};

export const bulkCreateHppProduk = async (
  req: Request<unknown, ApiResponse<{ insertedCount: number }>, CreateHppProdukRequest[]>,
  res: Response<ApiResponse<{ insertedCount: number }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const insertedCount = await hppProdukService.bulkCreateHppProduk(req.body);
    sendCreated(res, { insertedCount }, `Berhasil menambahkan ${insertedCount} produk`);
  } catch (error) {
    next(error);
  }
};

export const updateHppProduk = async (
  req: Request<{ id: string }, ApiResponse<HppProduk>, UpdateHppProdukRequest>,
  res: Response<ApiResponse<HppProduk>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await hppProdukService.updateHppProduk(parseInt(req.params.id, 10), req.body);
    sendSuccess(res, data, "Berhasil memperbarui HPP Produk");
  } catch (error) {
    next(error);
  }
};

export const deleteHppProduk = async (
  req: Request<{ id_brand: string; id: string }>,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  try {
    const idBrand = parseInt(req.params.id_brand, 10);
    const id = parseInt(req.params.id, 10);
    await hppProdukService.deleteHppProduk(idBrand, id);
    sendSuccess(res, undefined as void, "Berhasil menghapus HPP Produk");
  } catch (error) {
    next(error);
  }
};

export const clearHppProdukByBrand = async (
  req: Request<{ id_brand: string }>,
  res: Response<ApiResponse<{ deletedCount: number }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const idBrand = parseInt(req.params.id_brand, 10);
    const deletedCount = await hppProdukService.clearHppProdukByBrand(idBrand);
    sendSuccess(res, { deletedCount }, `Berhasil menghapus ${deletedCount} HPP Produk untuk brand ini`);
  } catch (error) {
    next(error);
  }
};
