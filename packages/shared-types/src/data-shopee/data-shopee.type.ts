import { z } from "zod";

export const DataShopeeSchema = z.object({
  id: z.number().int().positive(),
  id_brand: z.number().int().positive(),
  dari_tanggal: z.string().or(z.date()),
  sampai_tanggal: z.string().or(z.date()),
  shopee_penghasilan_saya: z.string().min(1),
  shopee_pesanan_saya: z.string().min(1),
  shopee_biaya_iklan: z.string().min(1),
  orders_reference_column: z.string().optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateDataShopeeRequestSchema = z.object({
  id_brand: z.number().int().positive("ID Brand harus diisi"),
  dari_tanggal: z.string().min(1, "Dari tanggal harus diisi"),
  sampai_tanggal: z.string().min(1, "Sampai tanggal harus diisi"),
  orders_reference_column: z.string().min(1, "Kolom referensi pesanan harus diisi"),
  // Files will be handled via FormData in multipart request
});

export type DataShopee = z.infer<typeof DataShopeeSchema> & {
  sharing_brand: number;
  sharing_platform: number;
};
export type CreateDataShopeeRequest = z.infer<typeof CreateDataShopeeRequestSchema>;

export type DataPenghasilanSaya = {
  "No.": string
  "No. Pesanan": string
  "No. Pengajuan": string
  "Username (Pembeli)": string
  "Waktu Pesanan Dibuat": string
  "Metode pembayaran pembeli": string
  "Tanggal Dana Dilepaskan": string
  "Harga Asli Produk": string
  "Total Diskon Produk": string
  "Jumlah Pengembalian Dana ke Pembeli": string
  "Diskon Produk dari Shopee": string
  "Voucher disponsor oleh Penjual": string
  "Voucher co-fund disponsor oleh Penjual": string
  "Cashback Koin disponsori Penjual": string
  "Cashback Koin Co-fund disponsori Penjual": string
  "Ongkir Dibayar Pembeli": string
  "Diskon Ongkir Ditanggung Jasa Kirim": string
  "Gratis Ongkir dari Shopee": string
  "Ongkir yang Diteruskan oleh Shopee ke Jasa Kirim": string
  "Ongkos Kirim Pengembalian Barang": string
  "Kembali ke Biaya Pengiriman Pengirim": string
  "Pengembalian Biaya Kirim": string
  "Biaya Komisi AMS": string
  "Biaya Administrasi": string
  "Biaya Layanan": string
  "Biaya Proses Pesanan": string
  Premi: string
  "Biaya Program Hemat Biaya Kirim": string
  "Biaya Transaksi": string
  "Biaya Kampanye": string
  "Bea Masuk, PPN & PPh": string
  "Biaya Isi Saldo Otomatis (dari Penghasilan)": string
  "Total Penghasilan": string
  "Kode Voucher": string
  Kompensasi: string
  "Promo Gratis Ongkir dari Penjual": string
  "Jasa Kirim": string
  "Nama Kurir": string
  "Pengembalian Dana ke Pembeli": string
  "Pro-rata Koin yang Ditukarkan untuk Pengembalian Barang": string
  "Pro-rata Voucher Shopee untuk Pengembalian Barang": string
  "Pro-rated Bank Payment Channel Promotion  for return refund Items": string
  "Pro-rated Shopee Payment Channel Promotion  for return refund Items": string 
}

export type DataPesananSaya = {
  "No. Pesanan": string
  "Status Pesanan": string
  "Shipped by Advance Fulfilment": string
  "Status Pembatalan/ Pengembalian": string
  "No. Resi": string
  "Opsi Pengiriman": string
  "Antar ke counter/ pick-up": string
  "Pesanan Harus Dikirimkan Sebelum (Menghindari keterlambatan)": string
  "Waktu Pengiriman Diatur": string
  "Waktu Pesanan Dibuat": string
  "Waktu Pembayaran Dilakukan": string
  "Metode Pembayaran": string
  "SKU Induk": string
  "Nama Produk": string
  "Nomor Referensi SKU": string
  "Nama Variasi": string
  "Harga Awal": string
  "Harga Setelah Diskon": string
  Jumlah: string
  "Returned quantity": string
  "Dibayar Pembeli": string
  "Total Diskon": string
  "Diskon Dari Penjual": string
  "Diskon Dari Shopee": string
  "Berat Produk": string
  "Jumlah Produk di Pesan": string
  "Total Berat": string
  "Voucher Ditanggung Penjual": string
  "Cashback Koin": string
  "Voucher Ditanggung Shopee": string
  "Paket Diskon": string
  "Paket Diskon (Diskon dari Shopee)": string
  "Paket Diskon (Diskon dari Penjual)": string
  "Potongan Koin Shopee": string
  "Diskon Kartu Kredit": string
  "Ongkos Kirim Dibayar oleh Pembeli": string
  "Estimasi Potongan Biaya Pengiriman": string
  "Ongkos Kirim Pengembalian Barang": string
  "Total Pembayaran": string
  "Perkiraan Ongkos Kirim": string
  "Catatan dari Pembeli": string
  Catatan: string
  "Username (Pembeli)": string
  "Nama Penerima": string
  "No. Telepon": string
  "Alamat Pengiriman": string
  "Kota/Kabupaten": string
  Provinsi: string
  "Waktu Pesanan Selesai": string 
}

export type DataDetailShopeeItem = {
  nama_produk: string
  variasi_1: string
  variasi_2: string
  terjual: number
  hpp: number
  total: number
}

/** Satu baris pesanan: gabungan DataPesananSaya + rincian keuangan DataPenghasilanSaya (join No. Pesanan). */
export type DataRincianPesanan = {
  // Dari DataPesananSaya
  no_pesanan: string
  username: string
  nama_produk: string
  nama_variasi: string
  jumlah: string
  harga_awal: string
  harga_setelah_diskon: string
  waktu_pesanan_dibuat: string
  waktu_pembayaran: string
  metode_pembayaran: string
  // Dari DataPenghasilanSaya (subset yang diminta)
  harga_asli_produk: string
  total_diskon_produk: string
  jumlah_pengembalian_dana: string
  diskon_produk_dari_shopee: string
  voucher_sponsor_penjual: string
  voucher_cofund_penjual: string
  cashback_koin_penjual: string
  cashback_koin_cofund_penjual: string
  ongkir_dibayar_pembeli: string
  diskon_ongkir_jasa_kirim: string
  gratis_ongkir_shopee: string
  ongkir_diteruskan_shopee: string
  ongkos_kirim_pengembalian: string
  kembali_biaya_pengiriman: string
  pengembalian_biaya_kirim: string
  biaya_komisi_ams: string
  biaya_administrasi: string
  biaya_layanan: string
  biaya_proses_pesanan: string
  premi: string
  biaya_program_hemat_ongkir: string
  biaya_transaksi: string
  biaya_kampanye: string
  bea_masuk_ppn_pph: string
  biaya_isi_saldo_otomatis: string
  total_penghasilan: string
}

export type DataDetailShopee = {
  total_hpp: number
  total_yg_dilepas: number
  total_biaya_iklan: number
  total_revenue: number
  total_biaya_campaign: number
  ppn_biaya_iklan: number
  sharing: {
    brand: number
    platform: number
  }
  net_profit: number
  total_produk_yg_sudah_masuk: number
  total_produk_yg_belum_masuk: number
  detail: DataDetailShopeeItem[]
  detail_yg_belum_masuk: DataDetailShopeeItem[]
  rincian_pesanan: DataRincianPesanan[]
}

export type DataBiayaIklanShopee = {
  Urutan: string
  "Nama Iklan": string
  Status: string
  "Jenis Iklan": string
  "Kode Produk": string
  "Tampilan Iklan": string
  "Mode Bidding": string
  "Penempatan Iklan": string
  "Tanggal Mulai": string
  "Tanggal Selesai": string
  Dilihat: string
  "Jumlah Klik": string
  "Persentase Klik": string
  Konversi: string
  "Konversi Langsung": string
  "Tingkat konversi": string
  "Tingkat Konversi Langsung": string
  "Biaya per Konversi": string
  "Biaya per Konversi Langsung": string
  "Produk Terjual": string
  "Terjual Langsung": string
  "Omzet Penjualan": string
  "Penjualan Langsung (GMV Langsung)": string
  Biaya: string
  "Efektifitas Iklan": string
  "Efektivitas Langsung": string
  "Persentase Biaya Iklan terhadap Penjualan dari Iklan (ACOS)": string
  "Persentase Biaya Iklan terhadap Penjualan dari Iklan Langsung (ACOS Langsung)": string
  "Jumlah Produk Dilihat": string
  "Jumlah Klik Produk": string
  "Persentase Klik Produk": string
}