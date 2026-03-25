import { ExcelReader } from "@/utils/excel";
import type { ApiResponse, CreateDataShopeeRequest, DataShopee } from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error-handler";
import { sendCreated, sendSuccess } from "../../utils/response";
import { getHppProdukByBrandId } from "../hpp-produk/hpp-produk.service";
import * as dataShopeeService from "./data-shopee.service";

export const getAllDataShopee = async (
  _req: Request,
  res: Response<ApiResponse<DataShopee[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await dataShopeeService.getAllDataShopee();
    sendSuccess(res, data, "Berhasil mengambil data shopee");
  } catch (error) {
    next(error);
  }
};

export const getDataShopeeById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<DataShopee>>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const dataShopee = await dataShopeeService.getDataShopeeById(id);
    
    // Example usage of ExcelReader with chaining
    const { data:dataPenghasilanSaya, total } = dataShopeeService.parsedDataPenghasilanSaya(dataShopee.shopee_penghasilan_saya);
    const dataOrdersFiltered = dataShopeeService.calculateOrders(dataShopee.shopee_pesanan_saya, dataPenghasilanSaya);
    const dataHpp = await getHppProdukByBrandId(dataShopee.id_brand)
    console.log(dataHpp)
    // const shopeePesananSaya = await dataShopeeService.getShopeePesananSayaById(id);
    // const shopeeBiayaIklan = await dataShopeeService.getShopeeBiayaIklanById(id);
    sendSuccess(res, dataShopee, "Berhasil mengambil detail data shopee");
  } catch (error) {
    next(error);
  }
};

export const createDataShopee = async (
  req: Request<unknown, ApiResponse<DataShopee>, any>,
  res: Response<ApiResponse<DataShopee>>,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files?.shopee_penghasilan_saya?.[0] || 
        !files?.shopee_pesanan_saya?.[0] || 
        !files?.shopee_biaya_iklan?.[0]) {
      throw new AppError("Ketiga file Shopee wajib diunggah", 400);
    }

    const body: CreateDataShopeeRequest = {
      id_brand: parseInt(req.body.id_brand, 10),
      dari_tanggal: req.body.dari_tanggal,
      sampai_tanggal: req.body.sampai_tanggal,
    };

    const filePaths = {
      shopee_penghasilan_saya: files.shopee_penghasilan_saya[0].filename,
      shopee_pesanan_saya: files.shopee_pesanan_saya[0].filename,
      shopee_biaya_iklan: files.shopee_biaya_iklan[0].filename,
    };

    const data = await dataShopeeService.createDataShopee(body, filePaths);
    sendCreated(res, data, "Berhasil menambahkan data shopee");
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to parse specific cell from uploads
 */
export function parsedDataFromExcel(fileName: string, sheet: string, cell: string) {
  return ExcelReader.fromUploads(fileName)
    .sheet(sheet)
    .getCellValue(cell);
}