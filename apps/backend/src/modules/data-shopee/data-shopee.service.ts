import { ExcelReader } from "@/utils/excel";
import { arrayToObject } from "@/utils/object";
import { parsedHppToObj, parsedOrdersToObj } from "@/utils/parse";
import type {
  CreateDataShopeeRequest,
  DataBiayaIklanShopee,
  DataPenghasilanSaya,
  DataPesananSaya,
  DataShopee,
} from "@setlement-shopee/types";
import fs from "fs";
import path from "path";
import { AppError } from "../../middlewares/error-handler";
import { HppProdukRow } from "../hpp-produk/hpp-produk.repository";
import * as dataShopeeRepo from "./data-shopee.repository";

export const getAllDataShopee = async (): Promise<DataShopee[]> => {
  return await dataShopeeRepo.findAllDataShopee();
};

export const getDataShopeeById = async (id: number): Promise<DataShopee> => {
  const item = await dataShopeeRepo.findDataShopeeById(id);
  if (!item) {
    throw new AppError("Data Shopee tidak ditemukan", 404);
  }
  return item;
};

export const createDataShopee = async (
  req: CreateDataShopeeRequest,
  files: {
    shopee_penghasilan_saya: string;
    shopee_pesanan_saya: string;
    shopee_biaya_iklan: string;
  },
): Promise<DataShopee> => {
  const insertId = await dataShopeeRepo.createDataShopee({
    id_brand: req.id_brand,
    dari_tanggal: req.dari_tanggal,
    sampai_tanggal: req.sampai_tanggal,
    orders_reference_column: req.orders_reference_column, 
    ...files,
  });

  const newItem = await dataShopeeRepo.findDataShopeeById(insertId);
  if (!newItem) {
    throw new AppError("Gagal mengambil data shopee yang baru dibuat", 500);
  }

  return newItem;
};

const deleteUploadedFile = (filename: string) => {
  const filePath = path.join(process.cwd(), "uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteDataShopee = async (id: number): Promise<void> => {
  const item = await dataShopeeRepo.findDataShopeeById(id);
  if (!item) throw new AppError("Data Shopee tidak ditemukan", 404);

  await dataShopeeRepo.deleteDataShopee(id);

  deleteUploadedFile(item.shopee_penghasilan_saya);
  deleteUploadedFile(item.shopee_pesanan_saya);
  deleteUploadedFile(item.shopee_biaya_iklan);
};

export const updateDataShopee = async (
  id: number,
  req: Partial<CreateDataShopeeRequest>,
  newFiles?: {
    shopee_penghasilan_saya?: string;
    shopee_pesanan_saya?: string;
    shopee_biaya_iklan?: string;
  },
): Promise<DataShopee> => {
  const item = await dataShopeeRepo.findDataShopeeById(id);
  if (!item) throw new AppError("Data Shopee tidak ditemukan", 404);

  // Delete replaced files
  if (newFiles?.shopee_penghasilan_saya)
    deleteUploadedFile(item.shopee_penghasilan_saya);
  if (newFiles?.shopee_pesanan_saya)
    deleteUploadedFile(item.shopee_pesanan_saya);
  if (newFiles?.shopee_biaya_iklan) deleteUploadedFile(item.shopee_biaya_iklan);

  await dataShopeeRepo.updateDataShopee(id, { ...req, ...newFiles });

  const updated = await dataShopeeRepo.findDataShopeeById(id);
  if (!updated) throw new AppError("Gagal mengambil data setelah update", 500);
  return updated;
};

export const parsedDataPenghasilanSaya = (fileName: string) => {
  const START_HEADER_INDEX = 5;
  const fromUploads = ExcelReader.fromUploads(fileName);
  const sheet = fromUploads.sheet("Summary");

  const totalYgDilepas = sheet.getCellValue("D48") || 0;
  const detail = sheet.sheet("Income").toArray();
  const header = detail[START_HEADER_INDEX];
  const dataIncome = sheet
    .sheet("Income")
    .toArray(START_HEADER_INDEX) as DataPenghasilanSaya[];
  const totalPenghasilan = dataIncome.reduce((acc, item) => {
    const totalPenghasilan = item["Total Penghasilan"];
    return acc + parseInt(totalPenghasilan, 10);
  }, 0);

  if (totalPenghasilan !== totalYgDilepas) {
    throw new AppError(
      "Total penghasilan tidak sesuai dengan total yang dilepas",
      400,
    );
  }
  // fs.writeFileSync('detail.json', JSON.stringify(total));
  return {
    total: totalPenghasilan,
    data: dataIncome,
  };
};

export const calculateOrders = (
  fileName: string,
  dataPenghasilanSaya: DataPenghasilanSaya[],
) => {
  const dataOrders = ExcelReader.fromUploads(fileName)
    .sheet("orders")
    .toArray() as DataPesananSaya[];
  const dataOrdersObject = arrayToObject(
    dataPenghasilanSaya,
    "No. Pesanan",
    "Total Penghasilan",
  );

  const dataOrdersFiltered = dataOrders.filter((row) => {
    if (
      row["Status Pembatalan/ Pengembalian"].toLowerCase() ===
      "permintaan disetujui"
    )
      return false;
    if (!dataOrdersObject[row["No. Pesanan"]]) return false;
    return true;
  });

  return {
    dataOrdersFiltered,
    dataOrders
  };
};

type DataMatchAndOrder = {
  nama_produk: string;
  variasi_1: string;
  variasi_2: string;
  hpp: number;
  terjual: number;
  total: number;
};

export type ReturnDataMatchHppAndOrder = {
  data: DataMatchAndOrder;
  total: number;
};
export const getMatchHppAndOrder = (
  dataOrders: DataPesananSaya[],
  dataHpp: HppProdukRow[],
  ordersReferenceColumn: string
) => {
  const parsedDataHppObj = parsedHppToObj(dataHpp);
  const parsedDataOrderToObj = parsedOrdersToObj(dataOrders, ordersReferenceColumn);
  const temp: DataMatchAndOrder[] = [];
  const tempYgBelumMasuk: DataMatchAndOrder[] = [];

  let tempTotal = 0;
  let totalProdukYgSudahMasuk = 0;
  let totalProdukYgBelumMasuk = 0;
  Object.keys(parsedDataOrderToObj).forEach((key) => {
    if (!parsedDataHppObj[key]) {
      totalProdukYgBelumMasuk += parsedDataOrderToObj[key];
      tempYgBelumMasuk.push({
        nama_produk: key,
        variasi_1: "",
        variasi_2: "",
        terjual: parsedDataOrderToObj[key],
        hpp: 0,
        total: 0,
      });
      return;
    }
    const [namaProduk, variasi1, variasi2] = key.split("---");
    const total = parsedDataOrderToObj[key] * parsedDataHppObj[key];
    tempTotal += total;
    totalProdukYgSudahMasuk += parsedDataOrderToObj[key];
    temp.push({
      nama_produk: namaProduk.trim(),
      variasi_1: variasi1.trim(),
      variasi_2: variasi2 ? variasi2.trim() : "",
      terjual: parsedDataOrderToObj[key],
      hpp: parsedDataHppObj[key],
      total,
    });
  });
  return {
    total_hpp: tempTotal,
    data: temp,
    data_yg_belum_masuk: tempYgBelumMasuk,
    total_produk_yg_sudah_masuk: totalProdukYgSudahMasuk,
    total_produk_yg_belum_masuk: totalProdukYgBelumMasuk,
  };
};


export const parsedDataTotalBiayaIklan = (fileName: string) => {
  const START_HEADER_INDEX = 7;
  const fromUploads = ExcelReader.fromUploads(fileName);
  const sheet = fromUploads.sheetIndex(0);

  const dataIncome = sheet.toArray(START_HEADER_INDEX) as DataBiayaIklanShopee[];
  let totalBiayaIklan = 0;
  dataIncome.forEach((item) => {
    const biaya = item["Biaya"];
    if (biaya !== undefined && biaya !== null) {
      if (typeof biaya === "string") {
        totalBiayaIklan += Number(biaya.replace(/[^\d.-]/g, ""));
      } else {
        totalBiayaIklan += Number(biaya);
      }
    }
  }, 0);

  return totalBiayaIklan;
};