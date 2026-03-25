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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetBrands } from "@/features/brand/hooks/use-brand";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HppProduk } from "@setlement-shopee/types";
import { CreateHppProdukRequestSchema } from "@setlement-shopee/types";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCreateHppProduk, useUpdateHppProduk } from "../hooks/use-hpp-produk";

interface HppProdukFormSheetProps {
  initialData?: HppProduk;
}

export function HppProdukFormSheet({ initialData }: HppProdukFormSheetProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!initialData;

  const { data: brands, isLoading: loadingBrands } = useGetBrands();
  const createMutation = useCreateHppProduk();
  const updateMutation = useUpdateHppProduk();

  const form = useForm<z.infer<typeof CreateHppProdukRequestSchema>>({
    resolver: zodResolver(CreateHppProdukRequestSchema),
    defaultValues: {
      id_brand: initialData?.id_brand || undefined,
      nama_produk: initialData?.nama_produk || "",
      hpp: initialData?.hpp || "",
      variasi_1: initialData?.variasi_1 || null,
      variasi_2: initialData?.variasi_2 || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id_brand: initialData.id_brand,
        nama_produk: initialData.nama_produk,
        hpp: initialData.hpp,
        variasi_1: initialData.variasi_1 || null,
        variasi_2: initialData.variasi_2 || null,
      });
    }
  }, [initialData, form]);

  const onSubmit = (values: z.infer<typeof CreateHppProdukRequestSchema>) => {
    const payload = {
      ...values,
      id_brand: Number(values.id_brand),
    };

    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success("HPP Produk berhasil diubah!");
            setOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Gagal mengubah HPP Produk");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("HPP Produk berhasil ditambahkan!");
          setOpen(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error.message || "Gagal menambahkan HPP Produk");
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah HPP Produk
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit HPP Produk" : "Tambah HPP Produk"}</SheetTitle>
          <SheetDescription>
            Masukkan detail produk dan pilih brand terkait.
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={loadingBrands}
                      >
                        <option value="" disabled>Pilih Brand</option>
                        {brands?.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.nama_brand}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nama_produk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Sabun Cuci Muka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hpp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Pokok Penjualan (HPP)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 15000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variasi_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variasi 1 (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Merah" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variasi_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variasi 2 (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: XL" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
