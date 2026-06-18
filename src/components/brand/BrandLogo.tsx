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
    sm: { icon: 36, text: "text-lg", sub: "text-[10px]" },
    md: { icon: 44, text: "text-2xl", sub: "text-xs" },
    lg: { icon: 60, text: "text-4xl", sub: "text-sm" },
  };

  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-[#261B6D]";
  const subColor = variant === "light" ? "text-[#B2DE81]" : "text-[#B2DE81]";

  const brandName = brand.store_name || "MatchaWdob";
  const tagline = brand.store_tagline ?? "عالم الماتشا الياباني ✦";

  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
      {/* أيقونة الشعار — صورة مخصصة أو دب ماتشا الافتراضي */}
      <div style={{ width: s.icon, height: s.icon }} className="relative flex-shrink-0">
        {brand.store_logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.store_logo}
            alt={brandName}
            className="w-full h-full object-cover rounded-full drop-shadow-md group-hover:scale-105 transition-transform"
          />
        ) : (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
            {/* خلفية دائرية */}
            <circle cx="50" cy="50" r="48" fill="#261B6D" />
            {/* أذنا الدب */}
            <circle cx="28" cy="26" r="13" fill="#B2DE81" />
            <circle cx="72" cy="26" r="13" fill="#B2DE81" />
            <circle cx="28" cy="26" r="8" fill="#8fc455" />
            <circle cx="72" cy="26" r="8" fill="#8fc455" />
            {/* وجه الدب */}
            <circle cx="50" cy="56" r="28" fill="#B2DE81" />
            <circle cx="50" cy="56" r="24" fill="#c8e9a0" />
            {/* عينان */}
            <circle cx="41" cy="50" r="5" fill="#261B6D" />
            <circle cx="59" cy="50" r="5" fill="#261B6D" />
            <circle cx="42.5" cy="48.5" r="1.8" fill="white" />
            <circle cx="60.5" cy="48.5" r="1.8" fill="white" />
            {/* أنف وفم */}
            <ellipse cx="50" cy="58" rx="4" ry="3" fill="#261B6D" />
            <path d="M 46 62 Q 50 66 54 62" stroke="#261B6D" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* وجنتان */}
            <circle cx="36" cy="59" r="5" fill="#ff9eb5" opacity="0.5" />
            <circle cx="64" cy="59" r="5" fill="#ff9eb5" opacity="0.5" />
            {/* نجمة صغيرة */}
            <text x="72" y="30" fontSize="10" fill="#B2DE81" textAnchor="middle">✦</text>
          </svg>
        )}
      </div>

      {/* النص */}
      {showText && (
        <div>
          <p className={`font-brand font-bold leading-none ${s.text} ${textColor} tracking-wide`}>
            {brandName}
          </p>
          {tagline && (
            <p className={`${s.sub} ${subColor} font-medium mt-0.5 leading-none`}>
              {tagline}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
