"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart, User, Search, Menu, X,
  ChevronDown, Heart, Package, LogOut, Settings
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";

const categories = [
  { nameAr: "إلكترونيات", slug: "electronics" },
  { nameAr: "ملابس رجالية", slug: "mens-clothing" },
  { nameAr: "ملابس نسائية", slug: "womens-clothing" },
  { nameAr: "المنزل والمطبخ", slug: "home-kitchen" },
  { nameAr: "العناية الشخصية", slug: "personal-care" },
  { nameAr: "الرياضة", slug: "sports" },
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
      <div className="bg-gray-900 text-white text-sm py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <p className="text-gray-300">شحن مجاني للطلبات فوق 200 ريال 🚚</p>
          <div className="flex items-center gap-4 text-gray-300">
            <span>📞 920000000</span>
            <span>|</span>
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            {/* لوجو */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">م</span>
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-xl text-gray-900 leading-none">متجر الخير</p>
                  <p className="text-xs text-orange-500">تسوق بثقة</p>
                </div>
              </div>
            </Link>

            {/* البحث */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <form action="/products" method="GET">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    placeholder="ابحث عن منتجاتك..."
                    className="w-full border-2 border-orange-400 rounded-xl pr-12 pl-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-orange-50/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
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
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <User size={22} className="text-gray-700" />
                  {session?.user ? (
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  ) : (
                    <span className="hidden sm:block text-sm text-gray-600">دخول</span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {session?.user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-sm text-gray-900">{session.user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{session.user.email}</p>
                        </div>
                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <User size={16} />
                          حسابي
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <Package size={16} />
                          طلباتي
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-sm text-orange-600 font-medium transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                            <Settings size={16} />
                            لوحة التحكم
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
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
                        <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          تسجيل الدخول
                        </Link>
                        <Link href="/register" className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-sm text-orange-600 font-medium transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          إنشاء حساب جديد
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* السلة */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* قائمة الجوال */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors md:hidden"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                  placeholder="ابحث عن منتجاتك..."
                  className="w-full border-2 border-orange-300 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-orange-50/30"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* شريط التصنيفات */}
        <nav className="border-t border-gray-100 hidden md:block">
          <div className="container-custom">
            <ul className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              <li>
                <Link href="/products" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap">
                  جميع المنتجات
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {cat.nameAr}
                  </Link>
                </li>
              ))}
              <li className="mr-auto">
                <Link href="/products?sale=true" className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap">
                  🔥 العروض
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* قائمة الجوال */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="container-custom py-4">
              <ul className="space-y-1">
                <li><Link href="/products" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>جميع المنتجات</Link></li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/products?category=${cat.slug}`} className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                      {cat.nameAr}
                    </Link>
                  </li>
                ))}
                <li><Link href="/products?sale=true" className="block px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>🔥 العروض</Link></li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
