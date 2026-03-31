import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { DataShopee } from "@setlement-shopee/types";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteDataShopee,
  useGetDataShopeeList,
} from "../hooks/use-data-shopee";
import { DataShopeeEditDialog } from "./data-shopee-edit-dialog";
import { DataShopeeFormDialog } from "./data-shopee-form-dialog";

import { useAuthStore } from "@/store/auth.store";

export function DataShopeeTable() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: dataShopeeList, isLoading, isError } = useGetDataShopeeList();
  const { data: brands, isLoading: loadingBrands } = useGetBrands();
  const deleteMutation = useDeleteDataShopee();

  const [editItem, setEditItem] = useState<DataShopee | null>(null);

  const getBrandName = (brandId: number) => {
    if (!brands) return "Unknown";
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.nama_brand : "Unknown";
  };

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = (id: number) => {
    if (
      !confirm(
        "Apakah anda yakin ingin menghapus data shopee ini? File yang diunggah juga akan dihapus.",
      )
    )
      return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Data Shopee berhasil dihapus!"),
      onError: (err: any) =>
        toast.error(err.message || "Gagal menghapus data Shopee"),
    });
  };

  const API_UPLOAD_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace("/api", "/uploads");

  const isSuperAdmin = user?.role === "super_admin";

  return (
    <>
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Data Shopee
            </CardTitle>
            <p className="text-sm text-gray-500">
              Daftar unggahan data Excel dari Shopee Seller Centre.
            </p>
          </div>
          {isSuperAdmin && <DataShopeeFormDialog />}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                <TableRow>
                  <TableHead className="w-[80px] text-center">ID</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>File Penghasilan</TableHead>
                  <TableHead>File Pesanan</TableHead>
                  <TableHead>File Iklan</TableHead>
                  <TableHead className="text-right">Tgl Unggah</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || loadingBrands ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[100px] ml-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-red-500"
                    >
                      Gagal mengambil data shopee.
                    </TableCell>
                  </TableRow>
                ) : dataShopeeList?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-gray-500"
                    >
                      Belum ada data shopee yang diunggah.
                    </TableCell>
                  </TableRow>
                ) : (
                  dataShopeeList?.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="text-center font-medium">
                        {item.id}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {getBrandName(item.id_brand)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(item.dari_tanggal)} -{" "}
                        {formatDate(item.sampai_tanggal)}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${item.shopee_penghasilan_saya}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                          <FileText className="h-3 w-3" /> View
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${item.shopee_pesanan_saya}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-orange-500 hover:underline"
                        >
                          <FileText className="h-3 w-3" /> View
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${item.shopee_biaya_iklan}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
                        >
                          <FileText className="h-3 w-3" /> View
                        </a>
                      </TableCell>
                      <TableCell className="text-right text-gray-500 text-xs">
                        {item.created_at ? formatDate(item.created_at) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isSuperAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditItem(item)}
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:border-red-300"
                                onClick={() => handleDelete(item.id!)}
                                disabled={deleteMutation.isPending}
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            onClick={() => {
                              navigate({
                                to: "/admin/data-shopee/$id",
                                params: { id: item.id!.toString() },
                              });
                            }}
                            className="bg-[#F53D2D] hover:bg-[#F53D2D]/80 text-xs px-2 h-8"
                          >
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editItem && (
        <DataShopeeEditDialog
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) setEditItem(null);
          }}
          data={editItem}
        />
      )}
    </>
  );
}
