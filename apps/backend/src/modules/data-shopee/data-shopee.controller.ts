import type {
  ApiResponse,
  CreateDataShopeeRequest,
  DataDetailShopee,
  DataShopee,
} from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error-handler";
import { sendCreated, sendSuccess } from "../../utils/response";
import * as dataShopeeService from "./data-shopee.service";

export const getAllDataShopee = async (
  req: Request,
  res: Response<ApiResponse<DataShopee[]>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await dataShopeeService.getAllDataShopee();
    const filteredData =
      req.user?.role === "user_brand"
        ? data.filter((d) => d.id_brand === req.user?.id_brand)
        : data;
    sendSuccess(res, filteredData, "Berhasil mengambil data shopee");
  } catch (error) {
    next(error);
  }
};

export const getDataShopeeById = async (
  req: Request<{ id: string }>,
  res: Response<DataDetailShopee>,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const dataShopee = await dataShopeeService.getDataShopeeById(id);

    if (
      req.user?.role === "user_brand" &&
      dataShopee.id_brand !== req.user.id_brand
    ) {
      throw new AppError(
        "Forbidden: You can only view data for your assigned brand",
        403,
      );
    }
    const result = await dataShopeeService.calculateNetProfit({
      file_penghasilan_saya: dataShopee.shopee_penghasilan_saya,
      file_biaya_iklan: dataShopee.shopee_biaya_iklan,
      file_pesanan_saya: dataShopee.shopee_pesanan_saya,
      orders_reference_column: dataShopee.orders_reference_column || undefined,
      id_brand: dataShopee.id_brand,
    });

    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export const createDataShopee = async (
  req: Request<unknown, ApiResponse<DataShopee>, any>,
  res: Response<ApiResponse<DataShopee>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (
      !files?.shopee_penghasilan_saya?.[0] ||
      !files?.shopee_pesanan_saya?.[0] ||
      !files?.shopee_biaya_iklan?.[0]
    ) {
      throw new AppError("Ketiga file Shopee wajib diunggah", 400);
    }

    const brandId = parseInt(req.body.id_brand, 10);
    const filePaths = {
      shopee_penghasilan_saya: files.shopee_penghasilan_saya[0].path,
      shopee_pesanan_saya: files.shopee_pesanan_saya[0].path,
      shopee_biaya_iklan: files.shopee_biaya_iklan[0].path,
    };


    const result = await dataShopeeService.calculateNetProfit({
      file_penghasilan_saya: filePaths.shopee_penghasilan_saya,
      file_biaya_iklan: filePaths.shopee_biaya_iklan,
      file_pesanan_saya: filePaths.shopee_pesanan_saya,
      orders_reference_column: req.body.orders_reference_column || undefined,
      id_brand: brandId,
    });


    const body: CreateDataShopeeRequest = {
      id_brand: brandId,
      dari_tanggal: req.body.dari_tanggal,
      sampai_tanggal: req.body.sampai_tanggal,
      orders_reference_column: req.body.orders_reference_column,
      sharing_brand: result.sharing.brand,
      sharing_platform: result.sharing.platform,
    };


    const data = await dataShopeeService.createDataShopee(body, filePaths);
    sendCreated(res, data, "Berhasil menambahkan data shopee");
  } catch (error) {
    next(error);
  }
};

export const deleteDataShopee = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await dataShopeeService.deleteDataShopee(id);
    sendSuccess(res, null, "Berhasil menghapus data shopee");
  } catch (error) {
    next(error);
  }
};

export const updateDataShopee = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const body: any = {
      id_brand: req.body.id_brand ? parseInt(req.body.id_brand, 10) : undefined,
      dari_tanggal: req.body.dari_tanggal || undefined,
      sampai_tanggal: req.body.sampai_tanggal || undefined,
      orders_reference_column: req.body.orders_reference_column || undefined,
    };

    const newFiles: any = {};
    if (files?.shopee_penghasilan_saya?.[0])
      newFiles.shopee_penghasilan_saya = files.shopee_penghasilan_saya[0].path;
    if (files?.shopee_pesanan_saya?.[0])
      newFiles.shopee_pesanan_saya = files.shopee_pesanan_saya[0].path;
    if (files?.shopee_biaya_iklan?.[0])
      newFiles.shopee_biaya_iklan = files.shopee_biaya_iklan[0].path;

    const data = await dataShopeeService.updateDataShopee(
      id,
      body,
      Object.keys(newFiles).length ? newFiles : undefined,
    );
    sendSuccess(res, data, "Berhasil memperbarui data shopee");
  } catch (error) {
    next(error);
  }
};
