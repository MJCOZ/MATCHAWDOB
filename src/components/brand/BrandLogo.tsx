"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "color";
  showText?: boolean;
}

interface BrandData {
  store_logo?: string;
  store_tagline?: string;
  store_name?: string;
}

// شعار MatchaWdob الرسمي (يحتوي على الاسم مكتوباً بالتصميم المعتمد)
const DEFAULT_LOGO = "/images/brand/logo.png";

// ذاكرة مؤقتة على مستوى الوحدة لتفادي إعادة الجلب في كل مرة يظهر فيها الشعار
let brandCache: BrandData | null = null;

export function BrandLogo({ size = "md", variant = "color", showText = true }: BrandLogoProps) {
  const [brand, setBrand] = useState<BrandData>(brandCache || {});

  useEffect(() => {
    function fetchBrand() {
      fetch("/api/store-settings")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d) {
            brandCache = {
              store_logo: d.store_logo,
              store_tagline: d.store_tagline,
              store_name: d.store_name,
            };
            setBrand(brandCache);
          }
        })
        .catch(() => {});
    }

    if (!brandCache) fetchBrand();

    // إعادة الجلب فور حفظ إعدادات الهوية من لوحة التحكم لتفادي ظهور بيانات قديمة من الذاكرة المؤقتة
    function onBrandUpdated() {
      brandCache = null;
      fetchBrand();
    }
    window.addEventListener("brand-updated", onBrandUpdated);
    return () => window.removeEventListener("brand-updated", onBrandUpdated);
  }, []);

  const sizes = {
    sm: { logo: "h-7", sub: "text-[10px]" },
    md: { logo: "h-7 sm:h-10", sub: "text-xs" },
    lg: { logo: "h-11 sm:h-14", sub: "text-sm" },
  };

  const s = sizes[size];

  const brandName = brand.store_name || "MatchaWdob";
  const tagline = brand.store_tagline ?? "عالم الماتشا الياباني ✦";
  const logoSrc = brand.store_logo || DEFAULT_LOGO;

  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
      {/* شعار MatchaWdob — يتضمن الاسم مكتوباً بالتصميم المعتمد */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt={brandName}
        className={`w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform flex-shrink-0 ${s.logo}`}
      />

      {/* الوصف الفرعي */}
      {showText && tagline && (
        <p className={`${s.sub} text-[#B2DE81] font-medium leading-none whitespace-nowrap hidden sm:block`}>
          {tagline}
        </p>
      )}
    </Link>
  );
}
