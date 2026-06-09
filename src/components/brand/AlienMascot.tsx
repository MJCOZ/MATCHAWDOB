interface AlienMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function AlienMascot({ size = 180, className = "", animate = true }: AlienMascotProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 180 210"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-float" : ""} ${className}`}
      style={{
        animationDelay: "0.8s",
        filter: "drop-shadow(0 10px 20px rgba(38,27,109,0.3))",
      }}
    >
      {/* ظل */}
      <ellipse cx="90" cy="205" rx="40" ry="5" fill="rgba(38,27,109,0.15)" />

      {/* الجسم - بدلة فضائية بيضاء */}
      <ellipse cx="90" cy="158" rx="42" ry="50" fill="#f5f5f5" />
      <ellipse cx="90" cy="168" rx="26" ry="32" fill="#ffffff" />

      {/* حزام البدلة */}
      <rect x="66" y="162" width="48" height="10" rx="5" fill="#d1d5db" />
      {/* كاميرا على الحزام */}
      <rect x="82" y="164" width="16" height="10" rx="3" fill="#6b7280" />
      <circle cx="90" cy="169" r="4" fill="#374151" />
      <circle cx="90" cy="169" r="2" fill="#1a1a2e" />

      {/* الساقان */}
      <ellipse cx="70" cy="198" rx="15" ry="10" fill="#e5e7eb" />
      <ellipse cx="110" cy="198" rx="15" ry="10" fill="#e5e7eb" />
      {/* قدم خضراء */}
      <ellipse cx="70" cy="204" rx="18" ry="7" fill="#B2DE81" />
      <ellipse cx="110" cy="204" rx="18" ry="7" fill="#B2DE81" />

      {/* ذراع يسار مرفوع للتلويح */}
      <ellipse cx="46" cy="133" rx="12" ry="26" fill="#e5e7eb" transform="rotate(-38 46 133)" />
      {/* كف خضراء */}
      <circle cx="28" cy="114" r="14" fill="#B2DE81" />
      <ellipse cx="20" cy="103" rx="5" ry="8" fill="#8fc455" transform="rotate(-20 20 103)" />
      <ellipse cx="28" cy="100" rx="5" ry="9" fill="#8fc455" />
      <ellipse cx="36" cy="103" rx="5" ry="8" fill="#8fc455" transform="rotate(20 36 103)" />

      {/* ذراع يمين */}
      <ellipse cx="134" cy="148" rx="12" ry="26" fill="#e5e7eb" transform="rotate(12 134 148)" />
      <circle cx="144" cy="170" r="12" fill="#B2DE81" />

      {/* الرأس الأخضر */}
      <ellipse cx="90" cy="80" rx="52" ry="58" fill="#B2DE81" />
      <ellipse cx="90" cy="72" rx="46" ry="50" fill="#c8e9a0" />

      {/* قرنان صغيران */}
      <ellipse cx="68" cy="28" rx="7" ry="14" fill="#8fc455" transform="rotate(-15 68 28)" />
      <ellipse cx="112" cy="28" rx="7" ry="14" fill="#8fc455" transform="rotate(15 112 28)" />

      {/* العيون الكبيرة السوداء البيضاوية */}
      <ellipse cx="72" cy="78" rx="18" ry="22" fill="#1a1a2e" />
      <ellipse cx="108" cy="78" rx="18" ry="22" fill="#1a1a2e" />

      {/* لمعة العيون */}
      <ellipse cx="66" cy="68" rx="6" ry="8" fill="white" opacity="0.5" />
      <ellipse cx="102" cy="68" rx="6" ry="8" fill="white" opacity="0.5" />
      <circle cx="64" cy="65" r="3" fill="white" opacity="0.9" />
      <circle cx="100" cy="65" r="3" fill="white" opacity="0.9" />

      {/* الأنف */}
      <ellipse cx="90" cy="98" rx="4" ry="3" fill="#8fc455" />

      {/* الابتسامة */}
      <path d="M 78 108 Q 90 116 102 108" stroke="#5a8a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* وجنتان */}
      <circle cx="58" cy="88" r="9" fill="#ffb347" opacity="0.25" />
      <circle cx="122" cy="88" r="9" fill="#ffb347" opacity="0.25" />
    </svg>
  );
}
