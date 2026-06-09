import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Twitter } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { WavyDivider } from "@/components/brand/WavyDivider";

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";

  return (
    <>
      {/* موجة علوية */}
      <WavyDivider color="#261B6D" flip={false} height={60} />

      <footer className="bg-[#261B6D] text-white">
        {/* الجزء الرئيسي */}
        <div className="container-custom pt-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* عن المتجر */}
            <div>
              <div className="mb-5">
                <BrandLogo size="md" variant="light" />
              </div>
              <p className="text-[#B2DE81] text-sm font-bold mb-1">ماتشا من الفضاء ✦</p>
              <p className="text-[#B2DE81]/80 text-sm leading-relaxed">
                متجرك الياباني المميز في المملكة العربية السعودية. ماتشا أصيل، شخصيات كيوت، وتجربة تسوق مختلفة تماماً
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  className="w-10 h-10 bg-green-600 hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="واتساب"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:opacity-80 rounded-xl flex items-center justify-center transition-opacity">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-sky-500 hover:bg-sky-400 rounded-xl flex items-center justify-center transition-colors">
                  <Twitter size={18} />
                </a>
                {/* تيك توك */}
                <a href="#" className="w-10 h-10 bg-[#1a1a2e] hover:bg-black rounded-xl flex items-center justify-center transition-colors border border-[#B2DE81]/20">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.13a8.16 8.16 0 004.77 1.52V7.21a4.85 4.85 0 01-1-.52z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* روابط سريعة */}
            <div>
              <h3 className="font-bold text-lg mb-5 text-[#B2DE81]">روابط سريعة ✦</h3>
              <ul className="space-y-3">
                {[
                  { label: "كل المنتجات", href: "/products" },
                  { label: "ماتشا بودر", href: "/products?category=matcha-powder" },
                  { label: "أدوات الماتشا", href: "/products?category=matcha-tools" },
                  { label: "العروض والخصومات", href: "/products?sale=true" },
                  { label: "تتبع طلبي", href: "/orders" },
                  { label: "من نحن", href: "/about" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#B2DE81]/70 hover:text-[#B2DE81] text-sm transition-colors flex items-center gap-2">
                      <span className="text-[#B2DE81]/40">✦</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* سياسات */}
            <div>
              <h3 className="font-bold text-lg mb-5 text-[#B2DE81]">المساعدة</h3>
              <ul className="space-y-3">
                {[
                  { label: "سياسة الشحن", href: "/shipping-policy" },
                  { label: "سياسة الإرجاع", href: "/return-policy" },
                  { label: "الأسئلة الشائعة", href: "/faq" },
                  { label: "سياسة الخصوصية", href: "/privacy-policy" },
                  { label: "الشروط والأحكام", href: "/terms" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#B2DE81]/70 hover:text-[#B2DE81] text-sm transition-colors flex items-center gap-2">
                      <span className="text-[#B2DE81]/40">✦</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* التواصل */}
            <div>
              <h3 className="font-bold text-lg mb-5 text-[#B2DE81]">تواصل معنا</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#B2DE81]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#B2DE81]/20">
                    <Phone size={16} className="text-[#B2DE81]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#B2DE81]/50 mb-1">اتصل بنا</p>
                    <p className="text-sm text-white">920-000-000</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#B2DE81]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#B2DE81]/20">
                    <Mail size={16} className="text-[#B2DE81]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#B2DE81]/50 mb-1">البريد الإلكتروني</p>
                    <p className="text-sm text-white">hello@matchwdob.sa</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#B2DE81]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#B2DE81]/20">
                    <MapPin size={16} className="text-[#B2DE81]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#B2DE81]/50 mb-1">العنوان</p>
                    <p className="text-sm text-white">الرياض، المملكة العربية السعودية</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* طرق الدفع والشحن */}
        <div className="border-t border-[#B2DE81]/15">
          <div className="container-custom py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <p className="text-xs text-[#B2DE81]/50 ml-2">طرق الدفع:</p>
                {["Mada", "Visa", "Mastercard", "Apple Pay", "STC Pay"].map((method) => (
                  <span key={method} className="bg-[#352a8a] text-[#B2DE81]/80 text-xs px-3 py-1.5 rounded-xl border border-[#B2DE81]/15">
                    {method}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <p className="text-xs text-[#B2DE81]/50 ml-2">شركات الشحن:</p>
                {["أرامكس", "SMSA", "البريد السعودي"].map((carrier) => (
                  <span key={carrier} className="bg-[#352a8a] text-[#B2DE81]/80 text-xs px-3 py-1.5 rounded-xl border border-[#B2DE81]/15">
                    {carrier}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-[#B2DE81]/15">
          <div className="container-custom py-4">
            <p className="text-center text-[#B2DE81]/50 text-sm">
              © {new Date().getFullYear()} MatchaWdob. جميع الحقوق محفوظة ✦ صُنع بحب 🍵
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
