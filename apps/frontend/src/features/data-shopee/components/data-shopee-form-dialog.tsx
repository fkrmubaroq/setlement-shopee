import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import * as z from "zod";
import { useCreateDataShopee } from "../hooks/use-data-shopee";

const formSchema = z.object({
  id_brand: z.string().min(1, "Brand harus dipilih"),
  dari_tanggal: z.string().min(1, "Tanggal mulai harus diisi"),
  sampai_tanggal: z.string().min(1, "Tanggal selesai harus diisi"),
  orders_reference_column: z.string().min(1, "Kolom referensi pesanan harus dipilih"),
});

export function DataShopeeFormDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<{
    shopee_penghasilan_saya: File | null;
    shopee_pesanan_saya: File | null;
    shopee_biaya_iklan: File | null;
  }>({
    shopee_penghasilan_saya: null,
    shopee_pesanan_saya: null,
    shopee_biaya_iklan: null,
  });
  const [pesananSayaColumns, setPesananSayaColumns] = useState<string[]>([]);

  const { data: brands } = useGetBrands();
  const createMutation = useCreateDataShopee();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_brand: "",
      dari_tanggal: "",
      sampai_tanggal: "",
      orders_reference_column: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev) => ({ ...prev, [field]: file }));

      if (field === "shopee_pesanan_saya") {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (jsonData.length > 0) {
              const headers = jsonData[0] as string[];
              setPesananSayaColumns(headers.filter(Boolean));
              
              if (headers.includes("Nama Produk")) {
                form.setValue("orders_reference_column", "Nama Produk");
              } else if (headers.includes("Nomor Referensi SKU")) {
                form.setValue("orders_reference_column", "Nomor Referensi SKU");
              }
            }
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          toast.error("Gagal membaca kolom dari file Pesanan Saya");
        }
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!files.shopee_penghasilan_saya || !files.shopee_pesanan_saya || !files.shopee_biaya_iklan) {
      toast.error("Ketiga file Shopee wajib diunggah");
      return;
    }

    const formData = new FormData();
    formData.append("id_brand", values.id_brand);
    formData.append("dari_tanggal", values.dari_tanggal);
    formData.append("sampai_tanggal", values.sampai_tanggal);
    formData.append("orders_reference_column", values.orders_reference_column);
    formData.append("shopee_penghasilan_saya", files.shopee_penghasilan_saya);
    formData.append("shopee_pesanan_saya", files.shopee_pesanan_saya);
    formData.append("shopee_biaya_iklan", files.shopee_biaya_iklan);

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Data Shopee berhasil diunggah!");
        setOpen(false);
        form.reset();
        setFiles({
          shopee_penghasilan_saya: null,
          shopee_pesanan_saya: null,
          shopee_biaya_iklan: null,
        });
        setPesananSayaColumns([]);
      },
      onError: (err: any) => {
        toast.error(err.message || "Gagal mengunggah data Shopee");
      },
    });
  };

  const isPending = createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Data Shopee
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Unggah Data Shopee</SheetTitle>
          <SheetDescription>
            Pilih brand, rentang tanggal, dan unggah file Excel dari Seller Centre Shopee.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-10">
              <FormField
                control={form.control}
                name="id_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.nama_brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dari_tanggal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dari Tanggal</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sampai_tanggal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sampai Tanggal</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 border-t pt-4 mt-4">
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-blue-500" /> Shopee Penghasilan Saya
                  </FormLabel>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileChange(e, "shopee_penghasilan_saya")}
                    className="cursor-pointer"
                  />
                  {files.shopee_penghasilan_saya && (
                    <p className="text-[10px] text-green-600 truncate">{files.shopee_penghasilan_saya.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-orange-500" /> Shopee Pesanan Saya
                  </FormLabel>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileChange(e, "shopee_pesanan_saya")}
                    className="cursor-pointer"
                  />
                  {files.shopee_pesanan_saya && (
                    <p className="text-[10px] text-green-600 truncate">{files.shopee_pesanan_saya.name}</p>
                  )}
                </div>
                
                {pesananSayaColumns.length > 0 && (
                  <FormField
                    control={form.control}
                    name="orders_reference_column"
                    render={({ field }) => (
                      <FormItem className="bg-orange-50/50 p-3 rounded-md border border-orange-100">
                        <FormLabel>Kolom Referensi Pesanan (Dari File Excel)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Pilih Kolom..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pesananSayaColumns.map((col, idx) => (
                              <SelectItem key={idx} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-2 border-t pt-4 mt-4">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-red-500" /> Shopee Biaya Iklan
                  </FormLabel>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileChange(e, "shopee_biaya_iklan")}
                    className="cursor-pointer"
                  />
                  {files.shopee_biaya_iklan && (
                    <p className="text-[10px] text-green-600 truncate">{files.shopee_biaya_iklan.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t mt-4">
                <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isPending ? "Mengunggah..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
