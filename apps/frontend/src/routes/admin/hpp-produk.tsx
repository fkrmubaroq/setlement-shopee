import { HppProdukTable } from "@/features/hpp-produk/components/hpp-produk-table";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/hpp-produk')({
  component: HppProdukPage,
})

function HppProdukPage() {
  return (
    <div className="flex flex-col gap-6">
      <HppProdukTable />
    </div>
  );
}
