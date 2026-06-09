import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "color";
  showText?: boolean;
}

export function BrandLogo({ size = "md", variant = "color", showText = true }: BrandLogoProps) {
  const sizes = {
    sm: { icon: 36, text: "text-lg", sub: "text-[10px]" },
    md: { icon: 44, text: "text-2xl", sub: "text-xs" },
    lg: { icon: 60, text: "text-4xl", sub: "text-sm" },
  };

  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : variant === "dark" ? "text-[#261B6D]" : "text-[#261B6D]";
  const subColor = variant === "light" ? "text-[#B2DE81]" : "text-[#B2DE81]";

  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
      {/* أيقونة الشعار - دب ماتشا */}
      <div
        style={{ width: s.icon, height: s.icon }}
        className="relative flex-shrink-0"
      >
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
      </div>

      {/* النص */}
      {showText && (
        <div>
          <p className={`font-brand font-bold leading-none ${s.text} ${textColor} tracking-wide`}>
            MatchaWdob
          </p>
          <p className={`${s.sub} ${subColor} font-medium mt-0.5 leading-none`}>
            عالم الماتشا الياباني ✦
          </p>
        </div>
      )}
    </Link>
  );
}
