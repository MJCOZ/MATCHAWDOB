interface Props {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: "wave" | "surprised" | "sad" | "back";
}

export function PandaAstronaut({ size = 200, className = "", animate = true, variant = "wave" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 230"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-float" : ""} ${className}`}
      style={{ filter: "drop-shadow(0 12px 24px rgba(38,27,109,0.3))" }}
    >
      {/* ظل */}
      <ellipse cx="100" cy="225" rx="45" ry="6" fill="rgba(38,27,109,0.15)" />

      {/* الجسم - أبيض/رمادي كالباندا */}
      <ellipse cx="100" cy="175" rx="46" ry="52" fill="#f0f0f0" />
      <ellipse cx="100" cy="188" rx="28" ry="32" fill="#ffffff" />

      {/* الأرجل */}
      <ellipse cx="76" cy="213" rx="18" ry="13" fill="#6b7280" />
      <ellipse cx="124" cy="213" rx="18" ry="13" fill="#6b7280" />

      {/* ذراع يسار (مرفوع للتلويح) */}
      {variant === "wave" ? (
        <>
          <ellipse cx="52" cy="148" rx="14" ry="28" fill="#6b7280" transform="rotate(-40 52 148)" />
          <ellipse cx="34" cy="128" rx="12" ry="12" fill="#6b7280" />
          {/* أصابع */}
          <circle cx="28" cy="120" r="6" fill="#6b7280" />
          <circle cx="36" cy="115" r="6" fill="#6b7280" />
          <circle cx="44" cy="118" r="6" fill="#6b7280" />
        </>
      ) : (
        <ellipse cx="55" cy="168" rx="14" ry="26" fill="#6b7280" transform="rotate(-15 55 168)" />
      )}

      {/* ذراع يمين */}
      <ellipse cx="148" cy="168" rx="14" ry="26" fill="#6b7280" transform="rotate(15 148 168)" />

      {/* الخوذة - اللون الكحلي */}
      <circle cx="100" cy="95" r="66" fill="#261B6D" />

      {/* الأذنان الخضراء (تطل من فوق الخوذة) */}
      <circle cx="54" cy="44" r="16" fill="#261B6D" />
      <circle cx="54" cy="44" r="11" fill="#B2DE81" />
      <circle cx="54" cy="44" r="6" fill="#8fc455" />
      <circle cx="146" cy="44" r="16" fill="#261B6D" />
      <circle cx="146" cy="44" r="11" fill="#B2DE81" />
      <circle cx="146" cy="44" r="6" fill="#8fc455" />

      {/* سماعات الخوذة الجانبية */}
      <circle cx="34" cy="95" r="12" fill="#B2DE81" />
      <circle cx="34" cy="95" r="8" fill="#8fc455" />
      <circle cx="166" cy="95" r="12" fill="#B2DE81" />
      <circle cx="166" cy="95" r="8" fill="#8fc455" />

      {/* شريط الخوذة الأخضر - العلوي */}
      <path d="M 38 70 Q 100 50 162 70" stroke="#B2DE81" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* شريط الخوذة الأخضر - السفلي */}
      <path d="M 36 118 Q 100 130 164 118" stroke="#B2DE81" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* وجه الباندا داخل الخوذة - بيضاوي فاتح */}
      <ellipse cx="100" cy="97" rx="44" ry="46" fill="#ffffff" />

      {/* بقع العيون السوداء (ميزة الباندا) */}
      <ellipse cx="82" cy="88" rx="14" ry="12" fill="#1a1a2e" />
      <ellipse cx="118" cy="88" rx="14" ry="12" fill="#1a1a2e" />

      {/* العيون البيضاء */}
      <circle cx="82" cy="88" r="8" fill="white" />
      <circle cx="118" cy="88" r="8" fill="white" />

      {/* حدقة العين */}
      <circle cx="83" cy="89" r="5" fill="#1a1a2e" />
      <circle cx="119" cy="89" r="5" fill="#1a1a2e" />

      {/* لمعة العين */}
      <circle cx="85" cy="86" r="2" fill="white" />
      <circle cx="121" cy="86" r="2" fill="white" />

      {/* الأنف */}
      <ellipse cx="100" cy="103" rx="5" ry="4" fill="#1a1a2e" />

      {/* الفم */}
      {variant === "wave" && (
        <path d="M 92 110 Q 100 117 108 110" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {variant === "surprised" && (
        <ellipse cx="100" cy="113" rx="7" ry="8" fill="#1a1a2e" />
      )}
      {variant === "sad" && (
        <path d="M 92 115 Q 100 108 108 115" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* وجنتان وردية */}
      <circle cx="70" cy="106" r="9" fill="#ff9eb5" opacity="0.4" />
      <circle cx="130" cy="106" r="9" fill="#ff9eb5" opacity="0.4" />
    </svg>
  );
}
