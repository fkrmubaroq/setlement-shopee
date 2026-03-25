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
import { zodResolver } from "@hookform/resolvers/zod";
import type { Brand } from "@setlement-shopee/types";
import { CreateBrandRequestSchema } from "@setlement-shopee/types";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCreateBrand, useUpdateBrand } from "../hooks/use-brand";

interface BrandFormSheetProps {
  initialData?: Brand;
}

export function BrandFormSheet({ initialData }: BrandFormSheetProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!initialData;

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const form = useForm<z.infer<typeof CreateBrandRequestSchema>>({
    resolver: zodResolver(CreateBrandRequestSchema),
    defaultValues: {
      nama_brand: initialData?.nama_brand || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ nama_brand: initialData.nama_brand });
    }
  }, [initialData, form]);

  const onSubmit = (values: z.infer<typeof CreateBrandRequestSchema>) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: values },
        {
          onSuccess: () => {
            toast.success("Brand berhasil diubah!");
            setOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Gagal mengubah brand");
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Brand berhasil ditambahkan!");
          setOpen(false);
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error.message || "Gagal menambahkan brand");
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
            <Plus className="mr-2 h-4 w-4" /> Tambah Brand
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Brand" : "Tambah Brand"}</SheetTitle>
          <SheetDescription>
            Masukkan detail nama brand untuk digunakan pada sistem.
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nama_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Shopee Mall" {...field} />
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
