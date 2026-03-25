import { ExcelReader } from "@/utils/excel";
import { arrayToObject } from "@/utils/object";
import type { CreateDataShopeeRequest, DataPenghasilanSaya, DataPesananSaya, DataShopee } from "@setlement-shopee/types";
import { AppError } from "../../middlewares/error-handler";
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
  }
): Promise<DataShopee> => {
  const insertId = await dataShopeeRepo.createDataShopee({
    id_brand: req.id_brand,
    dari_tanggal: req.dari_tanggal,
    sampai_tanggal: req.sampai_tanggal,
    ...files,
  });

  const newItem = await dataShopeeRepo.findDataShopeeById(insertId);
  if (!newItem) {
    throw new AppError("Gagal mengambil data shopee yang baru dibuat", 500);
  }

  return newItem;
};

export const parsedDataPenghasilanSaya = (fileName: string) => {
  const START_HEADER_INDEX = 5;
  const fromUploads = ExcelReader.fromUploads(fileName)
  const sheet = fromUploads.sheet('Summary');

  const totalYgDilepas = sheet.getCellValue('D48') || 0;
  const detail = sheet.sheet("Income").toArray();
  const header = detail[START_HEADER_INDEX];
  const dataIncome = sheet.sheet("Income").toArray(START_HEADER_INDEX) as DataPenghasilanSaya[];
  const totalPenghasilan = dataIncome.reduce((acc, item) => { 
    const totalPenghasilan = item['Total Penghasilan'];
    return acc + parseInt(totalPenghasilan, 10);
  }, 0);

  if(totalPenghasilan !== totalYgDilepas) {
    throw new AppError("Total penghasilan tidak sesuai dengan total yang dilepas", 400);
  }
  // fs.writeFileSync('detail.json', JSON.stringify(total));
  return {
    total: totalPenghasilan,
    data: dataIncome
  };
}

export const calculateOrders = async (fileName: string, dataPenghasilanSaya: DataPenghasilanSaya[]) => {
  const dataOrders = ExcelReader.fromUploads(fileName).sheet("orders").toArray() as DataPesananSaya[];
  const dataOrdersObject = arrayToObject(dataPenghasilanSaya, "No. Pesanan", "Total Penghasilan");
  
  const dataOrdersFiltered = dataOrders.filter(row => {
    if (row["Status Pembatalan/ Pengembalian"].toLowerCase() === "permintaan disetujui") return false;
    if (!dataOrdersObject[row["No. Pesanan"]]) return false;
    return true;
  })

  return dataOrdersFiltered

}