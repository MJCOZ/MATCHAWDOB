"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart, User, Search, Menu, X,
  Package, LogOut, Settings
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { BrandLogo } from "@/components/brand/BrandLogo";

const categories = [
  { nameAr: "كل المنتجات", slug: "" },
  { nameAr: "ماتشا بودر", slug: "matcha-powder" },
  { nameAr: "أدوات الماتشا", slug: "matcha-tools" },
  { nameAr: "مشروبات", slug: "drinks" },
  { nameAr: "إكسسوارات", slug: "accessories" },
  { nameAr: "هدايا", slug: "gifts" },
];

export function Header() {
  const { data: session } = useSession();
  const { getItemCount, openCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = getItemCount();

  const isAdmin = (session?.user as any)?.role === "ADMIN" ||
                  (session?.user as any)?.role === "SUPER_ADMIN";

  return (
    <>
      {/* شريط علوي */}
      <div className="bg-[#B2DE81] text-[#261B6D] text-sm py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <p className="font-semibold text-xs">✦ شحن مجاني للطلبات فوق 200 ريال ✦</p>
          <div className="flex items-center gap-4 font-medium text-xs">
            <span>📞 920000000</span>
            <span className="opacity-50">|</span>
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b-2 border-[#B2DE81]/30">
        <div className="container-custom py-3.5">
          <div className="flex items-center gap-4">
            {/* لوجو MatchaWoob */}
            <BrandLogo size="md" variant="color" />

            {/* البحث */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <form action="/products" method="GET">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    placeholder="ابحث في عالم الماتشا..."
                    className="w-full border-2 border-[#B2DE81] rounded-2xl pr-12 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#261B6D] focus:ring-2 focus:ring-[#261B6D]/20 bg-[#F8F7FF] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#261B6D]">
                    <Search size={20} />
                  </button>
                </div>
              </form>
            </div>

            {/* أدوات التنقل */}
            <div className="flex items-center gap-2 mr-auto">
              {/* المستخدم */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl hover:bg-[#eeedf8] transition-colors"
                >
                  <User size={22} className="text-[#261B6D]" />
                  {session?.user ? (
                    <span className="hidden sm:block text-sm font-medium text-[#261B6D] max-w-[80px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  ) : (
                    <span className="hidden sm:block text-sm text-[#261B6D]">دخول</span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-xl border-2 border-[#eeedf8] py-2 z-50">
                    {session?.user ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#eeedf8]">
                          <p className="font-bold text-sm text-[#261B6D]">{session.user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{session.user.email}</p>
                        </div>
                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#eeedf8] text-sm text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <User size={16} className="text-[#261B6D]" />
                          حسابي
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#eeedf8] text-sm text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <Package size={16} className="text-[#261B6D]" />
                          طلباتي
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#B2DE81]/20 text-sm text-[#261B6D] font-bold transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                            <Settings size={16} />
                            لوحة التحكم
                          </Link>
                        )}
                        <hr className="my-1 border-[#eeedf8]" />
                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 w-full text-right transition-colors"
                        >
                          <LogOut size={16} />
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#eeedf8] text-sm font-medium text-[#261B6D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          تسجيل الدخول
                        </Link>
                        <Link href="/register" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#B2DE81]/20 text-sm text-[#261B6D] font-bold transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          إنشاء حساب جديد ✦
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* السلة */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-2xl hover:bg-[#eeedf8] transition-colors"
              >
                <ShoppingCart size={22} className="text-[#261B6D]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-[#B2DE81] text-[#261B6D] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* قائمة الجوال */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-2xl hover:bg-[#eeedf8] transition-colors md:hidden"
              >
                {isMenuOpen ? <X size={22} className="text-[#261B6D]" /> : <Menu size={22} className="text-[#261B6D]" />}
              </button>
            </div>
          </div>

          {/* بحث الجوال */}
          <div className="mt-3 md:hidden">
            <form action="/products" method="GET">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="ابحث في عالم الماتشا..."
                  className="w-full border-2 border-[#B2DE81] rounded-2xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[#261B6D] bg-[#F8F7FF]"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#261B6D]">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* شريط التصنيفات */}
        <nav className="border-t border-[#eeedf8] hidden md:block bg-[#F8F7FF]/50">
          <div className="container-custom">
            <ul className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#261B6D] hover:bg-[#B2DE81]/20 rounded-xl transition-colors whitespace-nowrap"
                  >
                    {cat.nameAr}
                  </Link>
                </li>
              ))}
              <li className="mr-auto">
                <Link href="/products?sale=true" className="px-4 py-2 text-sm font-bold text-[#261B6D] hover:bg-[#B2DE81]/30 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1">
                  ✦ العروض الحصرية
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* قائمة الجوال */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#eeedf8] bg-white">
            <nav className="container-custom py-4">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                      className="block px-4 py-3 text-sm font-medium text-[#261B6D] hover:bg-[#B2DE81]/20 rounded-2xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.nameAr}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products?sale=true" className="block px-4 py-3 text-sm font-bold text-[#261B6D] hover:bg-[#B2DE81]/20 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                    ✦ العروض الحصرية
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
