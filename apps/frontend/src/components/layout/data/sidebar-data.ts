import {
  BanknoteArrowDownIcon,
  BoxIcon,
  Command,
  FileSpreadsheetIcon,
  KeyIcon
} from "lucide-react";

export const sidebarData = {
  sidebarLogo: {
    name: "Inventory Management",
    logo: Command,
    plan: "Admin Panel",
  },
  sidebarMenu: [
    {
      section: "Master",
      menus: [
        {
          title: "Brand",
          url: "/admin/brand",
          icon: KeyIcon,
        },       
        {
          title: "HPP Produk",
          url: "/admin/hpp-produk",
          icon: BoxIcon,
        },       
      ],
    },
    {
      section: "Transaction",
      menus: [
        {
          title: "Hitung Net Profit",
          url: "/admin/transaction/net-profit",
          icon: BanknoteArrowDownIcon,
        },
        {
          title: "Data Shopee",
          url: "/admin/data-shopee",
          icon: FileSpreadsheetIcon,
        },
      ],
    },
  ],
};
