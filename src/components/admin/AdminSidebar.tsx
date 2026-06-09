"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Users, Ticket, Settings, ChevronLeft, Store
} from "lucide-react";

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
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
      {/* الشعار */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">م</span>
          </div>
          <div>
            <p className="font-bold text-sm">متجر الخير</p>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* القائمة */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
        >
          <Store size={18} />
          زيارة المتجر
        </Link>
      </div>
    </aside>
  );
}
