import {
  ActivityIcon,
  ArrowDownUpIcon,
  ArrowLeftRightIcon,
  BoxesIcon,
  CirclePileIcon,
  ClockAlertIcon,
  Command,
  Home,
  NewspaperIcon,
  PackageIcon,
  SquareActivityIcon,
  StoreIcon,
} from "lucide-react";

export const sidebarData = {
  sidebarLogo: {
    name: "Inventory Management",
    logo: Command,
    plan: "Admin Panel",
  },
  sidebarMenu: [
    {
      section: "Dashboard",
      menus: [
        {
          title: "Total Products",
          url: "/admin/dashboard/total-products",
          icon: PackageIcon,
        },
        {
          title: "Total Locations",
          url: "/admin/dashboard/total-locations",
          icon: StoreIcon,
        },
        {
          title: "Total Stock",
          url: "/admin/dashboard/total-stock",
          icon: CirclePileIcon,
        },
        {
          title: "Low Stock Alert",
          url: "/admin/dashboard/Low Stock Alert",
          icon: ClockAlertIcon,
        },
        {
          title: "Recent Stock Movements",
          url: "/admin/dashboard/recent-stock-movements",
          icon: SquareActivityIcon,
        },
      ],
    },
    {
      section: "Master Data",
      menus: [
        {
          title: "Products",
          url: "/admin/products",
          icon: BoxesIcon,
        },
        {
          title: "store",
          url: "/admin/locations",
          icon: StoreIcon,
        },
      ],
    },
    {
      section: "Inventory",
      menus: [
        {
          title: "Stock Overview",
          url: "/admin/inventory/stock-overview",
          icon: PackageIcon,
        },
        {
          title: "Stock Movement",
          url: "/admin/inventory/stock-movement",
          icon: ActivityIcon,
        },
        {
          title: "Stock Adjustment",
          url: "/admin/inventory/stock-adjustment",
          icon: ArrowDownUpIcon,
        },
        {
          title: "Transfer Stock",
          url: "/admin/inventory/transfer-stock",
          icon: ArrowLeftRightIcon,
        },
      ],
    },
  ],
};
