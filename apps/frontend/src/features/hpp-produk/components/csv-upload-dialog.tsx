import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetBrands } from "@/features/brand/hooks/use-brand";
import type { CreateHppProdukBulkRequest } from "@setlement-shopee/types";
import { UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import { useBulkCreateHppProduk } from "../hooks/use-hpp-produk";

export function CsvUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { data: brands } = useGetBrands();
  const bulkCreateMutation = useBulkCreateHppProduk();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    if (!selectedBrand) {
      toast.error("Silakan pilih brand terlebih dahulu.");
      return;
    }

    const id_brand = Number(selectedBrand);

    console.log("asdasd")
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data as Record<string, any>[];
          
          // Validate and parse columns strictly (nama_produk, hpp)
          const payload: CreateHppProdukBulkRequest = parsedData.map((row, index) => {
            if (!row["nama_produk"]) {
              throw new Error(`Baris ${index + 1}: 'nama_produk' tidak valid.`);
            }
            if (!row["hpp"]) {
              throw new Error(`Baris ${index + 1}: 'hpp' tidak valid.`);
            }
            
            return {
              id_brand,
              nama_produk: row["nama_produk"].trim(),
              hpp: String(row["hpp"]).trim(),
              variasi_1: row["variasi_1"] ? String(row["variasi_1"]).trim() : null,
              variasi_2: row["variasi_2"] ? String(row["variasi_2"]).trim() : null,
            };
          });

          if (payload.length === 0) {
            toast.error("File CSV kosong atau tidak memiliki baris data yang valid.");
            return;
          }

          bulkCreateMutation.mutate(payload, {
            onSuccess: (response) => {
              toast.success(`Berhasil menambahkan ${response.data?.insertedCount || payload.length} produk HPP!`);
              setOpen(false);
              setFile(null);
            },
            onError: (err: any) => {
              toast.error(err.message || "Gagal mengupload bulk CSV.");
            }
          });
        } catch (error: any) {
          console.log("ERROR",error.message)
          toast.error(error.message || "Gagal memproses file CSV. Pastikan format kolom sesuai.");
        }
      },
      error: (error) => {
        toast.error(`Gagal membaca CSV: ${error.message}`);
      }
    });
  };

  const isPending = bulkCreateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
          <UploadCloud className="mr-2 h-4 w-4" /> Import CSV
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Import HPP Produk CSV</SheetTitle>
          <SheetDescription>
            Pilih Brand dan upload file CSV dengan header wajib: <br/> 
            <strong className="text-gray-900 font-mono text-xs">nama_produk, hpp</strong><br/>
            Dan header opsional (boleh kosong): <br/>
            <strong className="text-gray-900 font-mono text-xs">variasi_1, variasi_2</strong>
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 px-4 flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih Brand</label>
              <Select value={selectedBrand || ""} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Brand Terkait" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.nama_brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <input
                    type="file"
                    accept=".csv"
                    className="mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleFileChange}
                />
                {file && (
                    <p className="text-sm font-medium text-gray-900 mt-2">
                        Terpilih: {file.name}
                    </p>
                )}
            </div>
            
            <div className="flex bg-blue-50 text-blue-800 p-3 rounded-md text-xs">
                Contoh format CSV:
                <pre className="ml-2 font-mono">
{`nama_produk,hpp,variasi_1,variasi_2
Sabun Cuci Muka,15000,,
Sampo Anti Ketombe,22000,Hitam,100ml`}
                </pre>
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={isPending || !file || !selectedBrand} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? "Sedang Mengimport..." : "Proses Import"}
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
