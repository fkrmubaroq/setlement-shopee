import { HppProdukRow } from "@/modules/hpp-produk/hpp-produk.repository";
import { DataPesananSaya } from "@setlement-shopee/types";

export function onlyNumber(str: string) {
  return str.replace(/[^0-9]/g, "");
}

export function parsedHppToObj(data: HppProdukRow[]) {
  const temp: Record<string, number> = {};
  data.forEach((item) => {
    const variasi1 = item.variasi_1 ? ` --- ${item.variasi_1}` : "";
    const variasi2 = item.variasi_2 ? ` --- ${item.variasi_2}` : "";
    const key = `${item.nama_produk}${variasi1}${variasi2}`.toLowerCase();

    temp[key] = Number(item.hpp);
  });

  return temp;
}

export function parsedOrdersToObj(data: DataPesananSaya[]) {
  const temp: Record<string, number> = {};
  data.forEach((item) => {
    const key = `${item["Nomor Referensi SKU"]} --- ${item["Nama Variasi"]}`
      .toLowerCase()
      .trim();
    temp[key] = Number(item["Jumlah"]);
  });

  return temp;
}
