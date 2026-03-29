import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBrands } from "@/features/brand/hooks/use-brand";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteHppProduk,
  useGetHppProdukList,
} from "../hooks/use-hpp-produk";
import { ClearHppProdukDialog } from "./clear-hpp-produk-dialog";
import { CsvUploadDialog } from "./csv-upload-dialog";
import { HppProdukFormSheet } from "./hpp-produk-form-dialog";

import { useAuthStore } from "@/store/auth.store";

export function HppProdukTable() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";
  const isUserBrand = user?.role === "user_brand";

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Determine initial brand if user_brand
  const [idBrand, setIdBrand] = useState<number | undefined>(
    isUserBrand ? user?.id_brand || undefined : undefined,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetHppProdukList({
    page,
    limit,
    search: debouncedSearch || undefined,
    id_brand: idBrand,
  });

  const hppProdukList = response?.data || [];
  const meta = response?.meta;

  const { data: brands, isLoading: loadingBrands } = useGetBrands();
  const deleteMutation = useDeleteHppProduk();

  const handleBrandChange = (value: string) => {
    setIdBrand(value === "all" ? undefined : Number(value));
    setPage(1); // Reset page on brand filter change
  };

  const handleDelete = (selectedIdBrand: number, id: number) => {
    if (confirm("Apakah anda yakin ingin menghapus HPP produk ini?")) {
      deleteMutation.mutate(
        { idBrand: selectedIdBrand, id },
        {
          onSuccess: () => {
            toast.success("HPP Produk berhasil dihapus!");
          },
          onError: (err: any) => {
            toast.error(err.message || "Gagal menghapus HPP Produk");
          },
        },
      );
    }
  };

  const formatRupiah = (angka: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(angka));
  };

  const getBrandName = (brandId: number) => {
    if (!brands) return "Unknown";
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.nama_brand : "Unknown";
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-col gap-4 pb-4 border-b md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Daftar HPP Produk
          </CardTitle>
          <p className="text-sm text-gray-500">
            Kelola master data harga pokok penjualan secara massal.
          </p>
        </div>
        {isSuperAdmin && (
          <div className="flex flex-wrap gap-2 items-center">
            <ClearHppProdukDialog />
            <CsvUploadDialog />
            <HppProdukFormSheet />
          </div>
        )}
      </CardHeader>

      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Cari nama produk..."
            className="pl-9 bg-white dark:bg-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!isUserBrand && (
          <div className="w-full sm:w-56">
            <Select
              value={idBrand?.toString() || "all"}
              onValueChange={handleBrandChange}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue placeholder="Semua Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Brand</SelectItem>
                {brands?.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.nama_brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <CardContent className="p-0 border-t">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead className="w-[80px] text-center">ID</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Variasi 1</TableHead>
                <TableHead>Variasi 2</TableHead>
                <TableHead className="text-right">HPP (Rp)</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Ditambahkan
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || loadingBrands ? (
                Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px] ml-auto" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[100px] ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded shrink-0" />
                        <Skeleton className="h-8 w-8 rounded shrink-0" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-red-500"
                  >
                    Gagal mengambil data HPP Produk.
                  </TableCell>
                </TableRow>
              ) : hppProdukList.length > 0 ? (
                hppProdukList.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="text-center font-medium">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-blue-600 font-semibold">
                      {getBrandName(item.id_brand)}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700 dark:text-gray-200">
                      {item.nama_produk}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {item.variasi_1 || "-"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {item.variasi_2 || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      {formatRupiah(item.hpp)}
                    </TableCell>
                    <TableCell className="text-gray-500 hidden md:table-cell text-right">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        {isSuperAdmin && (
                          <>
                            <HppProdukFormSheet initialData={item} />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(item.id_brand, item.id)
                              }
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-gray-500"
                  >
                    {search || idBrand
                      ? "Tidak ada produk yang cocok dengan pencarian."
                      : "Tidak ada data HPP Produk."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {meta && meta.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-gray-50 dark:bg-gray-900/50 rounded-b-lg gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Halaman {meta.page} dari {meta.totalPages} (Total: {meta.total}{" "}
            produk)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="bg-white dark:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-white dark:bg-gray-800"
            >
              Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
