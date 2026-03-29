import type {
  ApiResponse,
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../utils/response";
import * as brandService from "./brand.service";

import { AppError } from "../../middlewares/error-handler";

export const getAllBrands = async (
  req: Request,
  res: Response<ApiResponse<Brand[]>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const brands = await brandService.getAllBrands();
    const filteredBrands =
      req.user?.role === "user_brand"
        ? brands.filter((b) => b.id === req.user?.id_brand)
        : brands;
    sendSuccess(res, filteredBrands);
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Brand>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const brand = await brandService.getBrandById(parseInt(req.params.id, 10));

    if (req.user?.role === "user_brand" && brand.id !== req.user.id_brand) {
      throw new AppError(
        "Forbidden: You can only view your assigned brand",
        403,
      );
    }
    sendSuccess(res, brand);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (
  req: Request<unknown, ApiResponse<Brand>, CreateBrandRequest>,
  res: Response<ApiResponse<Brand>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const brand = await brandService.createBrand(req.body);
    sendCreated(res, brand, "Berhasil menambahkan brand");
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (
  req: Request<{ id: string }, ApiResponse<Brand>, UpdateBrandRequest>,
  res: Response<ApiResponse<Brand>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const brand = await brandService.updateBrand(
      parseInt(req.params.id, 10),
      req.body,
    );
    sendSuccess(res, brand, "Berhasil memperbarui brand");
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    await brandService.deleteBrand(parseInt(req.params.id, 10));
    sendSuccess(res, undefined as void, "Berhasil menghapus brand");
  } catch (error) {
    next(error);
  }
};
