import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetBrands } from "@/features/brand/hooks/use-brand";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useClearHppProdukByBrand } from "../hooks/use-hpp-produk";

export function ClearHppProdukDialog() {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  const { data: brands, isLoading: loadingBrands } = useGetBrands();
  const clearMutation = useClearHppProdukByBrand();

  const handleClear = () => {
    if (!selectedBrand) {
      toast.error("Silakan pilih brand terlebih dahulu.");
      return;
    }

    if (confirm("🚨 PERINGATAN: Aksi ini akan menghapus KESELURUHAN data HPP Produk untuk brand ini. Anda tidak bisa mengembalikannya. Tetap lanjutkan?")) {
      clearMutation.mutate(selectedBrand, {
        onSuccess: (res) => {
          toast.success(res.message || "Berhasil membersihkan data HPP Produk!");
          setOpen(false);
          setSelectedBrand(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal membersihkan data.");
        }
      });
    }
  };

  const isPending = clearMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-800">
          <Trash2 className="mr-2 h-4 w-4" /> Bersihkan Data
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-red-600">Bersihkan Data HPP Produk</SheetTitle>
          <SheetDescription>
            Pilih Brand yang ingin Anda KOSONGKAN seluruh data rekam HPP Produknya.
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 px-4 flex flex-col gap-6">
            <div className="space-y-4">
               <div>
                  <label className="text-sm font-medium mb-1 block">Pilih Brand</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedBrand || ""}
                    onChange={(e) => setSelectedBrand(Number(e.target.value))}
                    disabled={loadingBrands || isPending}
                  >
                    <option value="" disabled>-- Pilih Brand --</option>
                    {brands?.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.nama_brand}
                      </option>
                    ))}
                  </select>
               </div>
               
               <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    <strong>Perhatian!</strong> Menekan tombol proses di bawah akan menghapus tabel HPP Produk secara permanen khusus untuk Brand ini.
               </div>
            </div>

            <Button 
              onClick={handleClear} 
              disabled={isPending || !selectedBrand} 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Sedang Memproses..." : "Hapus Permanen"}
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
