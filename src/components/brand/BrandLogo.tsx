"use client";
import Link from "next/link";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "color";
  showText?: boolean;
}

// شعار MatchaWdob الرسمي (يحتوي على الاسم مكتوباً بالتصميم المعتمد)
const DEFAULT_LOGO = "/images/brand/logo.png";

export function BrandLogo({ size = "md", variant = "color", showText = true }: BrandLogoProps) {
  const brand = useStoreSettings();

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
