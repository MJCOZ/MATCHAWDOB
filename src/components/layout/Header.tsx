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
  { nameAr: "ماتشا بودر",  slug: "matcha-powder" },
  { nameAr: "أدوات الماتشا", slug: "matcha-tools" },
  { nameAr: "مشروبات",    slug: "drinks" },
  { nameAr: "إكسسوارات",  slug: "accessories" },
  { nameAr: "هدايا",      slug: "gifts" },
];

/* شريط الإعلانات المتحرك */
function AnnouncementBar() {
  const items = [
    "✦ شحن مجاني للطلبات فوق 200 ريال ✦",
    "MATCHA FROM SPACE",
    "✦ ضمان الجودة 100% ✦",
    "抹茶 FROM JAPAN",
    "✦ توصيل خلال 24 ساعة ✦",
  ];
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ background: "#B2DE81", borderBottom: "2px solid #1a1a1a" }}>
      <div className="flex items-center animate-marquee whitespace-nowrap py-2 gap-10">
        {repeated.map((item, i) => (
          <span key={i} className="text-xs font-black text-[#261B6D] shrink-0 px-4">
            <span className={item.match(/[A-Z]/) ? "font-en" : ""}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { data: session } = useSession();
  const { getItemCount, openCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const itemCount = getItemCount();

  const isAdmin = (session?.user as any)?.role === "ADMIN" ||
                  (session?.user as any)?.role === "SUPER_ADMIN";

  return (
    <>
      {/* شريط الإعلانات */}
      <AnnouncementBar />

      {/* الهيدر الرئيسي */}
      <header className="sticky top-0 z-50 bg-white" style={{ borderBottom: "3px solid #1a1a1a", boxShadow: "0 3px 0 #1a1a1a" }}>
        <div className="container-custom py-3">
          <div className="flex items-center gap-4">
            {/* اللوجو */}
            <BrandLogo size="md" variant="color" />

            {/* البحث */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <form action="/products" method="GET">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    placeholder="ابحث في عالم الماتشا..."
                    className="w-full pr-12 pl-4 py-2.5 text-sm focus:outline-none"
                    style={{ border: "2px solid #1a1a1a", borderRadius: "4px", background: "#FAFAF5", transition: "box-shadow .1s" }}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={e => { (e.target as HTMLElement).style.boxShadow = "3px 3px 0 #261B6D"; }}
                    onBlur={e =>  { (e.target as HTMLElement).style.boxShadow = "none"; }}
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
                  className="flex items-center gap-2 px-3 py-2 font-bold text-sm text-[#261B6D] transition-all"
                  style={{ border: "2px solid #1a1a1a", borderRadius: "4px", boxShadow: "2px 2px 0 #1a1a1a" }}
                >
                  <User size={18} className="text-[#261B6D]" />
                  {session?.user
                    ? <span className="hidden sm:block max-w-[70px] truncate">{session.user.name?.split(" ")[0]}</span>
                    : <span className="hidden sm:block">دخول</span>
                  }
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white py-2 z-50"
                    style={{ border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", borderRadius: "4px" }}>
                    {session?.user ? (
                      <>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <p className="font-black text-sm text-[#261B6D]">{session.user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{session.user.email}</p>
                        </div>
                        <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAFAF5] text-sm font-medium text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <User size={16} className="text-[#261B6D]" /> حسابي
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAFAF5] text-sm font-medium text-gray-700 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <Package size={16} className="text-[#261B6D]" /> طلباتي
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#B2DE81]/20 text-sm font-black text-[#261B6D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                            <Settings size={16} /> لوحة التحكم
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 w-full text-right transition-colors">
                          <LogOut size={16} /> تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAFAF5] text-sm font-bold text-[#261B6D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          تسجيل الدخول
                        </Link>
                        <Link href="/register" className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#B2DE81]/20 text-sm font-black text-[#261B6D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          إنشاء حساب جديد ✦
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* السلة */}
              <button onClick={openCart}
                className="relative flex items-center gap-2 px-3 py-2 font-bold text-sm text-[#261B6D] transition-all"
                style={{ border: "2px solid #1a1a1a", borderRadius: "4px", boxShadow: "2px 2px 0 #1a1a1a" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-1px,-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 #1a1a1a"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0 #1a1a1a"; }}
              >
                <ShoppingCart size={20} className="text-[#261B6D]" />
                {itemCount > 0 && (
                  <span className="font-black text-xs" style={{ background: "#B2DE81", color: "#261B6D", padding: "1px 7px", border: "1.5px solid #1a1a1a", borderRadius: "2px" }}>
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* قائمة الجوال */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 md:hidden transition-all"
                style={{ border: "2px solid #1a1a1a", borderRadius: "4px", boxShadow: "2px 2px 0 #1a1a1a" }}>
                {isMenuOpen ? <X size={20} className="text-[#261B6D]" /> : <Menu size={20} className="text-[#261B6D]" />}
              </button>
            </div>
          </div>

          {/* بحث الجوال */}
          <div className="mt-3 md:hidden">
            <form action="/products" method="GET">
              <div className="relative">
                <input type="text" name="q" placeholder="ابحث في عالم الماتشا..."
                  className="w-full pr-10 pl-4 py-2.5 text-sm focus:outline-none"
                  style={{ border: "2px solid #1a1a1a", borderRadius: "4px", background: "#FAFAF5" }} />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#261B6D]">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* شريط التصنيفات */}
        <nav className="hidden md:block" style={{ borderTop: "2px solid #1a1a1a", background: "#FAFAF5" }}>
          <div className="container-custom">
            <ul className="flex items-center gap-0 py-0 overflow-x-auto scrollbar-hide">
              {categories.map((cat, idx) => (
                <li key={cat.slug} style={{ borderLeft: idx > 0 ? "1px solid #e5e7eb" : "none" }}>
                  <Link
                    href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                    className="block px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-[#261B6D] hover:bg-[#B2DE81]/20 transition-colors whitespace-nowrap"
                  >
                    {cat.nameAr}
                  </Link>
                </li>
              ))}
              <li className="mr-auto" style={{ borderLeft: "1px solid #e5e7eb" }}>
                <Link href="/products?sale=true"
                  className="block px-5 py-2.5 text-sm font-black text-white whitespace-nowrap"
                  style={{ background: "#261B6D" }}>
                  ✦ العروض الحصرية
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* قائمة الجوال */}
        {isMenuOpen && (
          <div className="md:hidden" style={{ borderTop: "2px solid #1a1a1a", background: "white" }}>
            <nav className="container-custom py-4">
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat.slug}>
                    <Link href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                      className="block px-4 py-3 text-sm font-bold text-[#261B6D] hover:bg-[#B2DE81]/20 transition-colors"
                      style={{ borderRadius: "4px" }}
                      onClick={() => setIsMenuOpen(false)}>
                      {cat.nameAr}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products?sale=true"
                    className="block px-4 py-3 text-sm font-black text-white"
                    style={{ background: "#261B6D", borderRadius: "4px" }}
                    onClick={() => setIsMenuOpen(false)}>
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
