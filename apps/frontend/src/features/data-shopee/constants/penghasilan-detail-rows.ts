import type { DataRincianPesanan } from "@setlement-shopee/types";

export const PENGHASILAN_DETAIL_ROWS: Array<{
  key: keyof DataRincianPesanan;
  label: string;
}> = [
  { key: "harga_asli_produk", label: "Harga Asli Produk" },
  { key: "total_diskon_produk", label: "Total Diskon Produk" },
  {
    key: "jumlah_pengembalian_dana",
    label: "Jumlah Pengembalian Dana ke Pembeli",
  },
  { key: "diskon_produk_dari_shopee", label: "Diskon Produk dari Shopee" },
  {
    key: "voucher_sponsor_penjual",
    label: "Voucher disponsor oleh Penjual",
  },
  {
    key: "voucher_cofund_penjual",
    label: "Voucher co-fund disponsor oleh Penjual",
  },
  {
    key: "cashback_koin_penjual",
    label: "Cashback Koin disponsori Penjual",
  },
  {
    key: "cashback_koin_cofund_penjual",
    label: "Cashback Koin Co-fund disponsori Penjual",
  },
  { key: "ongkir_dibayar_pembeli", label: "Ongkir Dibayar Pembeli" },
  {
    key: "diskon_ongkir_jasa_kirim",
    label: "Diskon Ongkir Ditanggung Jasa Kirim",
  },
  { key: "gratis_ongkir_shopee", label: "Gratis Ongkir dari Shopee" },
  {
    key: "ongkir_diteruskan_shopee",
    label: "Ongkir yang Diteruskan oleh Shopee ke Jasa Kirim",
  },
  {
    key: "ongkos_kirim_pengembalian",
    label: "Ongkos Kirim Pengembalian Barang",
  },
  {
    key: "kembali_biaya_pengiriman",
    label: "Kembali ke Biaya Pengiriman Pengirim",
  },
  { key: "pengembalian_biaya_kirim", label: "Pengembalian Biaya Kirim" },
  { key: "biaya_komisi_ams", label: "Biaya Komisi AMS" },
  { key: "biaya_administrasi", label: "Biaya Administrasi" },
  { key: "biaya_layanan", label: "Biaya Layanan" },
  { key: "biaya_proses_pesanan", label: "Biaya Proses Pesanan" },
  { key: "premi", label: "Premi" },
  {
    key: "biaya_program_hemat_ongkir",
    label: "Biaya Program Hemat Biaya Kirim",
  },
  { key: "biaya_transaksi", label: "Biaya Transaksi" },
  { key: "biaya_kampanye", label: "Biaya Kampanye" },
  { key: "bea_masuk_ppn_pph", label: "Bea Masuk, PPN & PPh" },
  {
    key: "biaya_isi_saldo_otomatis",
    label: "Biaya Isi Saldo Otomatis (dari Penghasilan)",
  },
  { key: "total_penghasilan", label: "Total Penghasilan" },
];
