import { ExcelReader } from "@/utils/excel";
import type {
  ApiResponse,
  CreateDataShopeeRequest,
  DataDetailShopee,
  DataShopee,
} from "@setlement-shopee/types";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error-handler";
import { sendCreated, sendSuccess } from "../../utils/response";
import { getHppProdukByBrandId } from "../hpp-produk/hpp-produk.service";
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

    // Example usage of ExcelReader with chaining
    const { data: dataPenghasilanSaya, total: totalYgDilepas } =
      dataShopeeService.parsedDataPenghasilanSaya(
        dataShopee.shopee_penghasilan_saya,
      );

    const { dataOrdersFiltered, dataOrders } =
      dataShopeeService.calculateOrders(
        dataShopee.shopee_pesanan_saya,
        dataPenghasilanSaya,
      );

    const totalBiayaIklan = dataShopeeService.parsedDataTotalBiayaIklan(
      dataShopee.shopee_biaya_iklan,
    );
    const ppnBiayaIklan = totalBiayaIklan * 0.11;
    const dataHpp = await getHppProdukByBrandId(dataShopee.id_brand);

    const dataMatchHppAndOrders = dataShopeeService.getMatchHppAndOrder(
      dataOrdersFiltered,
      dataHpp,
      dataShopee.orders_reference_column || "Nama Produk",
    );
    const rincianPesanan = dataShopeeService.mergeOrdersWithPenghasilan(
      dataOrdersFiltered,
      dataPenghasilanSaya,
    );
    const netProfit =
      totalYgDilepas -
      (dataMatchHppAndOrders.total_hpp + totalBiayaIklan + ppnBiayaIklan);
    const sharing = {
      brand: netProfit * 0.7,
      platform: netProfit * 0.3,
    };
    const result = {
      total_hpp: dataMatchHppAndOrders.total_hpp,
      total_yg_dilepas: totalYgDilepas,
      total_biaya_iklan: totalBiayaIklan,
      ppn_biaya_iklan: ppnBiayaIklan,
      sharing,
      net_profit: netProfit,
      total_produk_yg_sudah_masuk:
        dataMatchHppAndOrders.total_produk_yg_sudah_masuk,
      total_produk_yg_belum_masuk:
        dataMatchHppAndOrders.total_produk_yg_belum_masuk,
      detail: dataMatchHppAndOrders.data,
      detail_yg_belum_masuk: dataMatchHppAndOrders.data_yg_belum_masuk,
      rincian_pesanan: rincianPesanan,
    };
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

    const body: CreateDataShopeeRequest = {
      id_brand: parseInt(req.body.id_brand, 10),
      dari_tanggal: req.body.dari_tanggal,
      sampai_tanggal: req.body.sampai_tanggal,
      orders_reference_column: req.body.orders_reference_column,
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
export function parsedDataFromExcel(
  fileName: string,
  sheet: string,
  cell: string,
) {
  return ExcelReader.fromUploads(fileName).sheet(sheet).getCellValue(cell);
}

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
      newFiles.shopee_penghasilan_saya =
        files.shopee_penghasilan_saya[0].filename;
    if (files?.shopee_pesanan_saya?.[0])
      newFiles.shopee_pesanan_saya = files.shopee_pesanan_saya[0].filename;
    if (files?.shopee_biaya_iklan?.[0])
      newFiles.shopee_biaya_iklan = files.shopee_biaya_iklan[0].filename;

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
