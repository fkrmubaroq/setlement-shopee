/* eslint-disable react-refresh/only-export-components -- TanStack Router file: exports Route + co-located helpers */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PENGHASILAN_DETAIL_ROWS } from '@/features/data-shopee/constants/penghasilan-detail-rows';
import { useGetDataShopeeById } from '@/features/data-shopee/hooks/use-data-shopee';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, ChevronRight, ListOrdered } from 'lucide-react';
import { Fragment, useCallback, useState } from 'react';

export const Route = createFileRoute('/admin/data-shopee/$id')({
  component: DataShopeeDetailRoute,
});

function formatRupiah(number: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function DataShopeeDetailRoute() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useGetDataShopeeById(Number(id));
  const [expandedRincianKeys, setExpandedRincianKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleRincianRow = useCallback((key: string) => {
    setExpandedRincianKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Memuat data rekonsiliasi...</div>;
  }

  if (isError || !data) {
    return <div className="p-6 text-red-500">Gagal mengambil detail Data Shopee.</div>;
  }

  const rincianPesanan = data.rincian_pesanan ?? [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/data-shopee">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Detail Rekonsiliasi Shopee</h1>
          <p className="text-sm text-gray-500">Analisis pencocokan pesanan Shopee dengan master HPP Produk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatRupiah(data.total_revenue)}</div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Biaya Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatRupiah(data.total_biaya_campaign)}</div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pendapatan Bersih (Dilepas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatRupiah(data.total_yg_dilepas)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Beban HPP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">-{formatRupiah(data.total_hpp)}</div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Biaya Iklan (+PPN)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">-{formatRupiah(data.total_biaya_iklan + data.ppn_biaya_iklan)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(data.net_profit)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-700 dark:text-blue-400">Sharing Brand (70%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatRupiah(data.sharing.brand)}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-100 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-purple-700 dark:text-purple-400">Sharing Platform (30%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatRupiah(data.sharing.platform)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Produk Terjual (Cocok)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.total_produk_yg_sudah_masuk} pcs</div>
            <p className="text-xs text-gray-500 mt-1">Ditemukan dalam master HPP</p>
          </CardContent>
        </Card>

        <Card className={data.total_produk_yg_belum_masuk > 0 ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Produk Terjual (Belum Masuk HPP)</CardTitle>
            <AlertCircle className={data.total_produk_yg_belum_masuk > 0 ? "h-4 w-4 text-red-500" : "h-4 w-4 text-gray-300"} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.total_produk_yg_belum_masuk > 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`}>
              {data.total_produk_yg_belum_masuk} pcs
            </div>
            <p className="text-xs text-gray-500 mt-1">Tidak ditemukan di master data HPP & mengurangi potensi Net Profit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cocok" className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="cocok" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Produk Cocok ({data.detail.length})
          </TabsTrigger>
          <TabsTrigger value="belum-cocok" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            <AlertCircle className="h-4 w-4 mr-2" /> Belum Cocok ({data.detail_yg_belum_masuk.length})
          </TabsTrigger>
          <TabsTrigger value="rincian-pesanan" className="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-800 dark:data-[state=active]:bg-sky-950/40 dark:data-[state=active]:text-sky-200">
            <ListOrdered className="h-4 w-4 mr-2" /> Rincian Pesanan ({rincianPesanan.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cocok">
          <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50">
            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b">
              <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5" /> Sudah Masuk HPP
              </CardTitle>
              <CardDescription className="text-emerald-600/70 dark:text-emerald-400/70">
                Daftar pesanan yang berhasil dicocokkan dengan data HPP berdasarkan SKU / Nama Produk dan Variasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead className="w-[30%]">Nama Produk / Ref SKU</TableHead>
                      <TableHead>Variasi 1</TableHead>
                      <TableHead>Variasi 2</TableHead>
                      <TableHead className="text-center w-[100px]">Terjual</TableHead>
                      <TableHead className="text-right w-[150px]">HPP Satuan</TableHead>
                      <TableHead className="text-right w-[150px]">Total HPP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.detail.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-gray-500">Tidak ada data produk yang cocok.</TableCell>
                      </TableRow>
                    ) : (
                      data.detail.map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium">{item.nama_produk}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{item.variasi_1 || "-"}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{item.variasi_2 || "-"}</TableCell>
                          <TableCell className="text-center font-bold text-gray-700 dark:text-gray-300">{item.terjual}</TableCell>
                          <TableCell className="text-right text-gray-600 dark:text-gray-400">{formatRupiah(item.hpp)}</TableCell>
                          <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(item.total)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  {data.detail.length > 0 && (
                    <TableFooter>
                      <TableRow className="bg-emerald-50/50 font-bold hover:bg-emerald-50/50">
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-center">{data.total_produk_yg_sudah_masuk}</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right text-emerald-700">{formatRupiah(data.total_hpp)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="belum-cocok">
          <Card className="shadow-sm border-red-100 dark:border-red-900/50">
            <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b">
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5" /> Produk Belum Masuk HPP
              </CardTitle>
              <CardDescription className="text-red-600/70 dark:text-red-400/70">
                Pesanan berikut gagal dicocokkan. Silakan tambahkan produk dan variasi ini ke master data HPP dengan penulisan yang persis sama.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead>Identitas Pesanan Shopee (Ref SKU / Nama Variasi)</TableHead>
                      <TableHead className="text-center w-[150px]">Total Terjual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.detail_yg_belum_masuk.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center h-24 text-gray-500">Hebat! Semua referensi pesanan berhasil dicocokkan dengan HPP.</TableCell>
                      </TableRow>
                    ) : (
                      data.detail_yg_belum_masuk.map((item, index) => (
                        <TableRow key={index} className="hover:bg-red-50/30 dark:hover:bg-red-900/20">
                          <TableCell className="font-medium text-red-600 dark:text-red-400 font-mono text-sm">{item.nama_produk}</TableCell>
                          <TableCell className="text-center font-bold text-red-700 dark:text-red-400">{item.terjual}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  {data.detail_yg_belum_masuk.length > 0 && (
                    <TableFooter>
                      <TableRow className="bg-red-50/50 font-bold hover:bg-red-50/50">
                        <TableCell>Total Produk Belum Masuk</TableCell>
                        <TableCell className="text-center text-red-700">{data.total_produk_yg_belum_masuk}</TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rincian-pesanan">
          <Card className="shadow-sm border-sky-100 dark:border-sky-900/50">
            <CardHeader className="bg-sky-50/50 dark:bg-sky-950/20 border-b">
              <CardTitle className="text-sky-800 dark:text-sky-300 flex items-center gap-2 text-lg">
                <ListOrdered className="h-5 w-5" /> Rincian per baris pesanan
              </CardTitle>
              <CardDescription className="text-sky-700/80 dark:text-sky-400/80">
                Data gabungan Pesanan Saya + Penghasilan Saya (per <span className="font-medium">No. Pesanan</span>).
                Klik panah untuk rincian keuangan dari laporan Penghasilan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead className="min-w-[140px]">No. Pesanan</TableHead>
                      <TableHead className="min-w-[100px]">Username</TableHead>
                      <TableHead className="min-w-[160px]">Nama Produk</TableHead>
                      <TableHead className="min-w-[100px]">Variasi</TableHead>
                      <TableHead className="text-center w-[72px]">Jumlah</TableHead>
                      <TableHead className="min-w-[100px]">Harga Awal</TableHead>
                      <TableHead className="min-w-[110px]">Harga Setelah Diskon</TableHead>
                      <TableHead className="min-w-[110px]">Total</TableHead>
                      <TableHead className="min-w-[120px]">Metode Pembayaran</TableHead>
                      <TableHead className="min-w-[140px]">Waktu Pesanan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rincianPesanan.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center h-24 text-gray-500">
                          Tidak ada baris pesanan yang cocok dengan filter Penghasilan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rincianPesanan.map((row, index) => {
                        const rowKey = `${row.no_pesanan}-${index}`;
                        const isOpen = expandedRincianKeys.has(rowKey);
                        return (
                          <Fragment key={rowKey}>
                            <TableRow className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                              <TableCell className="p-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={() => toggleRincianRow(rowKey)}
                                  aria-expanded={isOpen}
                                  aria-label={isOpen ? 'Sembunyikan rincian' : 'Tampilkan rincian penghasilan'}
                                >
                                  {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell className="font-mono text-xs align-middle">
                                {row.no_pesanan || '—'}
                              </TableCell>
                              <TableCell className="text-sm align-middle">
                                {row.username || '—'}
                              </TableCell>
                              <TableCell className="font-medium text-sm align-middle max-w-[220px] truncate">
                                {row.nama_produk || '—'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground align-middle">
                                {row.nama_variasi || '—'}
                              </TableCell>
                              <TableCell className="text-center text-sm font-medium align-middle">
                                {row.jumlah || '—'}
                              </TableCell>
                              <TableCell className="text-sm align-middle whitespace-nowrap">
                                {row.harga_awal || '—'}
                              </TableCell>
                              <TableCell className="text-sm align-middle whitespace-nowrap">
                                {row.harga_setelah_diskon || '—'}
                              </TableCell>
                              <TableCell className="text-sm align-middle whitespace-nowrap">
                                {row.harga_setelah_diskon ? formatRupiah(Number(row.harga_setelah_diskon) * Number(row.jumlah)) : '—'}
                              </TableCell>
                              <TableCell className="text-sm align-middle">
                                {row.metode_pembayaran || '—'}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground align-middle whitespace-nowrap">
                                {row.waktu_pesanan_dibuat || '—'}
                              </TableCell>
                            </TableRow>
                            {isOpen ? (
                              <TableRow className="bg-muted/40 hover:bg-muted/40 border-l-4 border-l-sky-400">
                                <TableCell colSpan={10} className="p-0">
                                  <div className="p-4 space-y-4 border-t border-border/60">
                                    <div className="text-sm">
                                      <span className="font-medium text-foreground">
                                        Waktu pembayaran:{' '}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {row.waktu_pembayaran || '—'}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                      Rincian Penghasilan (Income)
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 text-sm">
                                      {PENGHASILAN_DETAIL_ROWS.map(({ key, label }) => (
                                        <div
                                          key={key}
                                          className="flex flex-col sm:flex-row sm:gap-3 sm:items-baseline border-b border-border/40 py-2"
                                        >
                                          <span className="text-muted-foreground shrink-0 sm:w-[min(48%,260px)]">
                                            {label}
                                          </span>
                                          <span className="font-medium sm:text-right sm:flex-1 break-all">
                                            {(row[key] as string) || '—'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : null}
                          </Fragment>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  );
}
