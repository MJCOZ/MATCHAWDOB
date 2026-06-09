"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Users, Ticket, Settings, ChevronLeft, Store
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: Tag },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/coupons", label: "كوبونات الخصم", icon: Ticket },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 admin-sidebar text-white flex flex-col h-full flex-shrink-0">
      {/* الشعار */}
      <div className="p-5 border-b border-[#B2DE81]/15">
        <BrandLogo size="sm" variant="light" />
        <p className="text-[#B2DE81]/60 text-xs mt-2 mr-1">لوحة التحكم</p>
      </div>

      {/* القائمة */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-[#B2DE81] text-[#261B6D] font-bold shadow-lg"
                  : "text-[#B2DE81]/60 hover:bg-[#352a8a] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
              {isActive && <ChevronLeft size={14} className="mr-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* رابط المتجر */}
      <div className="p-4 border-t border-[#B2DE81]/15">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#B2DE81]/60 hover:bg-[#352a8a] hover:text-white transition-colors text-sm font-medium"
        >
          <Store size={18} />
          زيارة المتجر ✦
        </Link>
      </div>
    </aside>
  );
}
