import { ExcelReader } from "@/utils/excel";
import { arrayToObject } from "@/utils/object";
import { parsedHppToObj, parsedOrdersToObj } from "@/utils/parse";
import type {
  CreateDataShopeeRequest,
  DataBiayaIklanShopee,
  DataPenghasilanSaya,
  DataPesananSaya,
  DataRincianPesanan,
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

import { v2 as cloudinary } from "cloudinary";

const deleteUploadedFile = async (fileUrlOrName: string) => {
  try {
    if (fileUrlOrName.includes("cloudinary.com")) {
      const urlParts = fileUrlOrName.split("/upload/");
      if (urlParts.length === 2) {
        const withoutVersion = urlParts[1].replace(/^v\d+\//, "");
        // For raw files, public_id includes the extension
        await cloudinary.uploader.destroy(withoutVersion, {
          resource_type: "raw",
        });
      }
    } else {
      const filePath = path.join(process.cwd(), "uploads", fileUrlOrName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};

export const deleteDataShopee = async (id: number): Promise<void> => {
  const item = await dataShopeeRepo.findDataShopeeById(id);
  if (!item) throw new AppError("Data Shopee tidak ditemukan", 404);

  await dataShopeeRepo.deleteDataShopee(id);

  await deleteUploadedFile(item.shopee_penghasilan_saya);
  await deleteUploadedFile(item.shopee_pesanan_saya);
  await deleteUploadedFile(item.shopee_biaya_iklan);
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
    await deleteUploadedFile(item.shopee_penghasilan_saya);
  if (newFiles?.shopee_pesanan_saya)
    await deleteUploadedFile(item.shopee_pesanan_saya);
  if (newFiles?.shopee_biaya_iklan)
    await deleteUploadedFile(item.shopee_biaya_iklan);

  await dataShopeeRepo.updateDataShopee(id, { ...req, ...newFiles });

  const updated = await dataShopeeRepo.findDataShopeeById(id);
  if (!updated) throw new AppError("Gagal mengambil data setelah update", 500);
  return updated;
};

export const parsedDataPenghasilanSaya = async (fileName: string) => {
  const START_HEADER_INDEX = 5;
  const excelReader = new ExcelReader();
  const fromUploads = await excelReader.fromUrl(fileName);
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

export const calculateOrders = async (
  fileName: string,
  dataPenghasilanSaya: DataPenghasilanSaya[],
) => {
  const excelReader = new ExcelReader();
  const reader = await excelReader.fromUrl(fileName);
  const dataOrders = reader.sheet("orders").toArray() as DataPesananSaya[];
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
    dataOrders,
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
  ordersReferenceColumn: string,
) => {
  const parsedDataHppObj = parsedHppToObj(dataHpp);
  const parsedDataOrderToObj = parsedOrdersToObj(
    dataOrders,
    ordersReferenceColumn,
  );
  // console.log("XAX", ordersReferenceColumn);
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

export const parsedDataTotalBiayaIklan = async (fileName: string) => {
  const START_HEADER_INDEX = 7;
  const excelReader = new ExcelReader();
  const fromUploads = await excelReader.fromUrl(fileName);
  const sheet = fromUploads.sheetIndex(0);

  const dataIncome = sheet.toArray(
    START_HEADER_INDEX,
  ) as DataBiayaIklanShopee[];
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

function cellString(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v);
}

/** Gabungkan baris Pesanan Saya dengan rincian Penghasilan Saya per `No. Pesanan`. */
export function mergeOrdersWithPenghasilan(
  dataOrdersFiltered: DataPesananSaya[],
  dataPenghasilanSaya: DataPenghasilanSaya[],
): DataRincianPesanan[] {
  const penghasilanByOrderNo = new Map<string, DataPenghasilanSaya>();
  for (const row of dataPenghasilanSaya) {
    const key = cellString(row["No. Pesanan"]);
    if (key) penghasilanByOrderNo.set(key, row);
  }

  return dataOrdersFiltered.map((order) => {
    const no = cellString(order["No. Pesanan"]);
    const p = penghasilanByOrderNo.get(no);

    return {
      no_pesanan: no,
      username: cellString(order["Username (Pembeli)"]),
      nama_produk: cellString(order["Nama Produk"]),
      nama_variasi: cellString(order["Nama Variasi"]),
      jumlah: cellString(order.Jumlah),
      harga_awal: cellString(order["Harga Awal"]),
      harga_setelah_diskon: cellString(order["Harga Setelah Diskon"]),
      waktu_pesanan_dibuat: cellString(order["Waktu Pesanan Dibuat"]),
      waktu_pembayaran: cellString(order["Waktu Pembayaran Dilakukan"]),
      metode_pembayaran: cellString(order["Metode Pembayaran"]),
      harga_asli_produk: p ? cellString(p["Harga Asli Produk"]) : "",
      total_diskon_produk: p ? cellString(p["Total Diskon Produk"]) : "",
      jumlah_pengembalian_dana: p
        ? cellString(p["Jumlah Pengembalian Dana ke Pembeli"])
        : "",
      diskon_produk_dari_shopee: p
        ? cellString(p["Diskon Produk dari Shopee"])
        : "",
      voucher_sponsor_penjual: p
        ? cellString(p["Voucher disponsor oleh Penjual"])
        : "",
      voucher_cofund_penjual: p
        ? cellString(p["Voucher co-fund disponsor oleh Penjual"])
        : "",
      cashback_koin_penjual: p
        ? cellString(p["Cashback Koin disponsori Penjual"])
        : "",
      cashback_koin_cofund_penjual: p
        ? cellString(p["Cashback Koin Co-fund disponsori Penjual"])
        : "",
      ongkir_dibayar_pembeli: p ? cellString(p["Ongkir Dibayar Pembeli"]) : "",
      diskon_ongkir_jasa_kirim: p
        ? cellString(p["Diskon Ongkir Ditanggung Jasa Kirim"])
        : "",
      gratis_ongkir_shopee: p ? cellString(p["Gratis Ongkir dari Shopee"]) : "",
      ongkir_diteruskan_shopee: p
        ? cellString(p["Ongkir yang Diteruskan oleh Shopee ke Jasa Kirim"])
        : "",
      ongkos_kirim_pengembalian: p
        ? cellString(p["Ongkos Kirim Pengembalian Barang"])
        : "",
      kembali_biaya_pengiriman: p
        ? cellString(p["Kembali ke Biaya Pengiriman Pengirim"])
        : "",
      pengembalian_biaya_kirim: p
        ? cellString(p["Pengembalian Biaya Kirim"])
        : "",
      biaya_komisi_ams: p ? cellString(p["Biaya Komisi AMS"]) : "",
      biaya_administrasi: p ? cellString(p["Biaya Administrasi"]) : "",
      biaya_layanan: p ? cellString(p["Biaya Layanan"]) : "",
      biaya_proses_pesanan: p ? cellString(p["Biaya Proses Pesanan"]) : "",
      premi: p ? cellString(p.Premi) : "",
      biaya_program_hemat_ongkir: p
        ? cellString(p["Biaya Program Hemat Biaya Kirim"])
        : "",
      biaya_transaksi: p ? cellString(p["Biaya Transaksi"]) : "",
      biaya_kampanye: p ? cellString(p["Biaya Kampanye"]) : "",
      bea_masuk_ppn_pph: p ? cellString(p["Bea Masuk, PPN & PPh"]) : "",
      biaya_isi_saldo_otomatis: p
        ? cellString(p["Biaya Isi Saldo Otomatis (dari Penghasilan)"])
        : "",
      total_penghasilan: p ? cellString(p["Total Penghasilan"]) : "",
    };
  });
}
