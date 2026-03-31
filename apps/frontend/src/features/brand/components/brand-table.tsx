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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteBrand, useGetBrands } from "../hooks/use-brand";
import { BrandFormSheet } from "./brand-form-dialog";

import { useAuthStore } from "@/store/auth.store";

export function BrandTable() {
  const { user } = useAuthStore();
  const x = useAuthStore();
  console.log("", x);
  const { data: brands, isLoading, isError } = useGetBrands();
  const deleteMutation = useDeleteBrand();

  const handleDelete = (id: number) => {
    if (confirm("Apakah anda yakin ingin menghapus brand ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Brand berhasil dihapus!");
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal menghapus brand");
        },
      });
    }
  };

  const isSuperAdmin = user?.role === "super_admin";

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Daftar Brand
          </CardTitle>
          <p className="text-sm text-gray-500">
            Kelola semua brand anda disini.
          </p>
        </div>
        {isSuperAdmin && <BrandFormSheet />}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead className="w-[80px] text-center">ID</TableHead>
                <TableHead>Nama Brand</TableHead>
                <TableHead className="hidden md:table-cell">
                  Mulai Dibuat
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[150px]" />
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
                    colSpan={4}
                    className="h-24 text-center text-red-500"
                  >
                    Gagal mengambil data brand.
                  </TableCell>
                </TableRow>
              ) : brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <TableRow
                    key={brand.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="text-center font-medium">
                      {brand.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700 dark:text-gray-200">
                      {brand.nama_brand}
                    </TableCell>
                    <TableCell className="text-gray-500 hidden md:table-cell">
                      {brand.created_at
                        ? new Date(brand.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        {isSuperAdmin && (
                          <>
                            <BrandFormSheet initialData={brand} />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(brand.id)}
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
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    Tidak ada data brand.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
