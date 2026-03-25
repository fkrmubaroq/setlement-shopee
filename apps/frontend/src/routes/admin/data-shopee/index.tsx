import { DataShopeeTable } from "@/features/data-shopee/components/data-shopee-table";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/data-shopee/')({
  component: DataShopeePage,
})

function DataShopeePage() {
  return (
    <div className="flex flex-col gap-6">
      <DataShopeeTable />
    </div>
  );
}
