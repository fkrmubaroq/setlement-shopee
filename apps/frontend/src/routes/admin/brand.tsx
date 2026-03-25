import { BrandTable } from "@/features/brand/components/brand-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/brand")({
  component: BrandPage,
});

function BrandPage() {
  return (
    <div className="flex flex-col gap-6">
      <BrandTable />
    </div>
  );
}
