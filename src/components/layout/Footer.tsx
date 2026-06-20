"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Twitter } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export function Footer() {
  const settings = useStoreSettings();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";

  return (
    <footer style={{ background: "#261B6D", color: "white", borderTop: "3px solid #1a1a1a" }}>

      {/* شريط كانجي زخرفي */}
      <div style={{ borderBottom: "1px solid rgba(178,222,129,0.15)" }}>
        <div className="container-custom py-2.5 flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {["抹茶", "宇宙", "日本", "お茶", "✦", "MATCHA WDOB", "抹茶", "宇宙", "日本", "お茶", "✦", "MATCHA WDOB"].map((k, i) => (
            <span key={i}
              className={`text-sm font-black opacity-20 whitespace-nowrap flex-shrink-0 ${/[A-Z]/.test(k) ? "font-en tracking-widest" : ""}`}
              style={{ fontFamily: /[A-Z]/.test(k) ? "'CleoFolk','Syne',sans-serif" : "serif" }}>
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container-custom pt-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* عن المتجر */}
          <div>
            <div className="mb-5">
              <BrandLogo size="md" variant="light" />
            </div>
            <div className="inline-flex items-center gap-2 mb-3"
              style={{ background: "#B2DE81", color: "#261B6D", padding: "3px 12px", border: "2px solid rgba(255,255,255,0.3)", borderRadius: "2px" }}>
              <span className="font-en text-xs font-black tracking-wider">MATCHA FROM SPACE</span>
            </div>
            <p className="text-[#B2DE81]/80 text-sm leading-relaxed mb-5">
              متجرك الياباني المميز في المملكة العربية السعودية. ماتشا أصيل وتجربة تسوق مختلفة تماماً
            </p>

            {/* الشبكات الاجتماعية — CSS hover فقط */}
            <div className="flex items-center gap-2">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" aria-label="واتساب"
                className="social-btn" style={{ background: "#25D366" }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-btn"
                style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                <Instagram size={17} />
              </a>
              <a href="#" aria-label="X / Twitter" className="social-btn" style={{ background: "#000" }}>
                <Twitter size={17} />
              </a>
              <a href="#" aria-label="TikTok" className="social-btn" style={{ background: "#111" }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.13a8.16 8.16 0 004.77 1.52V7.21a4.85 4.85 0 01-1-.52z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-black text-base mb-4 flex items-center gap-2">
              <span className="font-en text-xs tracking-widest opacity-50">LINKS</span>
              <span className="text-[#B2DE81]">روابط سريعة</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "كل المنتجات",     href: "/products" },
                { label: "ماتشا بودر",       href: "/products?category=matcha-powder" },
                { label: "أدوات الماتشا",    href: "/products?category=matcha-tools" },
                { label: "العروض والخصومات", href: "/products?sale=true" },
                { label: "تتبع طلبي",        href: "/orders" },
                { label: "من نحن",           href: "/about" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[#B2DE81]/70 hover:text-[#B2DE81] text-sm font-medium transition-colors flex items-center gap-2">
                    <span className="text-[#B2DE81]/30 font-black">▸</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* مساعدة */}
          <div>
            <h3 className="font-black text-base mb-4 flex items-center gap-2">
              <span className="font-en text-xs tracking-widest opacity-50">HELP</span>
              <span className="text-[#B2DE81]">المساعدة</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "سياسة الشحن",     href: "/shipping-policy" },
                { label: "سياسة الإرجاع",   href: "/return-policy" },
                { label: "الأسئلة الشائعة", href: "/faq" },
                { label: "سياسة الخصوصية", href: "/privacy-policy" },
                { label: "الشروط والأحكام", href: "/terms" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[#B2DE81]/70 hover:text-[#B2DE81] text-sm font-medium transition-colors flex items-center gap-2">
                    <span className="text-[#B2DE81]/30 font-black">▸</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* التواصل */}
          <div>
            <h3 className="font-black text-base mb-4 flex items-center gap-2">
              <span className="font-en text-xs tracking-widest opacity-50">CONTACT</span>
              <span className="text-[#B2DE81]">تواصل معنا</span>
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Phone,  label: "اتصل بنا", value: settings.store_phone || "920-000-000" },
                { icon: Mail,   label: "البريد",   value: settings.store_email || "hello@matchwdob.sa" },
                { icon: MapPin, label: "العنوان",  value: settings.store_address || "الرياض، المملكة العربية السعودية" },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(178,222,129,0.12)", border: "1.5px solid rgba(178,222,129,0.25)", borderRadius: "4px" }}>
                    <Icon size={15} className="text-[#B2DE81]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#B2DE81]/50 uppercase tracking-wider font-en">{label}</p>
                    <p className="text-sm text-white mt-0.5">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* طرق الدفع والشحن */}
      <div style={{ borderTop: "2px solid rgba(178,222,129,0.15)" }}>
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <p className="text-xs font-black text-[#B2DE81]/50 ml-2 font-en">PAYMENT</p>
              {["Mada", "Visa", "Mastercard", "Apple Pay", "STC Pay"].map(m => (
                <span key={m} className="font-en text-xs font-black text-[#B2DE81]/80 px-3 py-1"
                  style={{ background: "rgba(53,42,138,0.6)", border: "1px solid rgba(178,222,129,0.2)", borderRadius: "3px" }}>
                  {m}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <p className="text-xs font-black text-[#B2DE81]/50 ml-2 font-en">SHIPPING</p>
              {["Aramex", "SMSA", "البريد السعودي"].map(c => (
                <span key={c} className="text-xs font-bold text-[#B2DE81]/80 px-3 py-1"
                  style={{ background: "rgba(53,42,138,0.6)", border: "1px solid rgba(178,222,129,0.2)", borderRadius: "3px" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* حقوق النشر */}
      <div style={{ borderTop: "2px solid rgba(178,222,129,0.15)" }}>
        <div className="container-custom py-4">
          <p className="text-center text-[#B2DE81]/40 text-xs font-black">
            <span className="font-en">© {new Date().getFullYear()} MATCHAWDOB</span>
            {" — "} جميع الحقوق محفوظة ✦ صُنع بحب 🍵
          </p>
        </div>
      </div>
    </footer>
  );
}
