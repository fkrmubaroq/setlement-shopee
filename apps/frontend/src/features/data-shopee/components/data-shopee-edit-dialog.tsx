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
} from "@/components/ui/sheet";
import { useGetBrands } from "@/features/brand/hooks/use-brand";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DataShopee } from "@setlement-shopee/types";
import { UploadCloud } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useUpdateDataShopee } from "../hooks/use-data-shopee";

const formSchema = z.object({
  id_brand: z.string().min(1, "Brand harus dipilih"),
  dari_tanggal: z.string().min(1, "Tanggal mulai harus diisi"),
  sampai_tanggal: z.string().min(1, "Tanggal selesai harus diisi"),
});

interface DataShopeeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DataShopee;
}

const toDateInputValue = (dateStr: string | Date) => {
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

export function DataShopeeEditDialog({
  open,
  onOpenChange,
  data,
}: DataShopeeEditDialogProps) {
  const { data: brands } = useGetBrands();
  const updateMutation = useUpdateDataShopee();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_brand: data.id_brand.toString(),
      dari_tanggal: toDateInputValue(data.dari_tanggal),
      sampai_tanggal: toDateInputValue(data.sampai_tanggal),
    },
  });

  useEffect(() => {
    form.reset({
      id_brand: data.id_brand.toString(),
      dari_tanggal: toDateInputValue(data.dari_tanggal),
      sampai_tanggal: toDateInputValue(data.sampai_tanggal),
    });
  }, [data]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("id_brand", values.id_brand);
    formData.append("dari_tanggal", values.dari_tanggal);
    formData.append("sampai_tanggal", values.sampai_tanggal);

    const penghasilanFile = (
      document.getElementById("edit-penghasilan") as HTMLInputElement
    )?.files?.[0];
    const pesananFile = (
      document.getElementById("edit-pesanan") as HTMLInputElement
    )?.files?.[0];
    const iklanFile = (
      document.getElementById("edit-iklan") as HTMLInputElement
    )?.files?.[0];

    if (penghasilanFile)
      formData.append("shopee_penghasilan_saya", penghasilanFile);
    if (pesananFile) formData.append("shopee_pesanan_saya", pesananFile);
    if (iklanFile) formData.append("shopee_biaya_iklan", iklanFile);

    updateMutation.mutate(
      { id: data.id!, formData },
      {
        onSuccess: () => {
          toast.success("Data Shopee berhasil diperbarui!");
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal memperbarui data Shopee");
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Data Shopee</SheetTitle>
          <SheetDescription>
            Perbarui informasi data Shopee. File yang tidak diubah akan tetap
            digunakan.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pb-10"
            >
              <FormField
                control={form.control}
                name="id_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map((brand) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.id.toString()}
                          >
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
                <p className="text-xs text-gray-500">
                  Upload file baru untuk mengganti file lama. Kosongkan jika
                  tidak ingin mengubah.
                </p>
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-blue-500" /> Shopee
                    Penghasilan Saya
                  </FormLabel>
                  <Input
                    id="edit-penghasilan"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-orange-500" /> Shopee
                    Pesanan Saya
                  </FormLabel>
                  <Input
                    id="edit-pesanan"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-red-500" /> Shopee
                    Biaya Iklan
                  </FormLabel>
                  <Input
                    id="edit-iklan"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {updateMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
