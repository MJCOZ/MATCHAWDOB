interface BearMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function BearMascot({ size = 160, className = "", animate = true }: BearMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-float" : ""} ${className}`}
      style={{ filter: "drop-shadow(0 10px 20px rgba(38, 27, 109, 0.25))" }}
    >
      {/* ظل */}
      <ellipse cx="100" cy="232" rx="50" ry="8" fill="rgba(38,27,109,0.12)" />

      {/* الجسم */}
      <ellipse cx="100" cy="170" rx="52" ry="58" fill="#261B6D" />

      {/* بطن أبيض */}
      <ellipse cx="100" cy="180" rx="32" ry="38" fill="#eeedf8" />

      {/* ذراع يسار */}
      <ellipse cx="55" cy="160" rx="18" ry="28" fill="#261B6D" transform="rotate(-15 55 160)" />
      <circle cx="47" cy="180" r="12" fill="#352a8a" />

      {/* ذراع يمين - يحمل كوب ماتشا */}
      <ellipse cx="145" cy="160" rx="18" ry="28" fill="#261B6D" transform="rotate(15 145 160)" />
      <circle cx="153" cy="180" r="12" fill="#352a8a" />

      {/* كوب ماتشا في اليد */}
      <rect x="148" y="170" width="22" height="20" rx="5" fill="#B2DE81" />
      <rect x="148" y="170" width="22" height="8" rx="4" fill="#8fc455" />
      <ellipse cx="159" cy="170" rx="11" ry="4" fill="#a0d070" />
      {/* بخار الشاي */}
      <path d="M 155 165 Q 157 160 155 155" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 160 163 Q 162 157 160 152" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M 165 165 Q 167 160 165 155" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* الرأس */}
      <circle cx="100" cy="95" r="58" fill="#261B6D" />

      {/* أذنان */}
      <circle cx="52" cy="50" r="22" fill="#261B6D" />
      <circle cx="148" cy="50" r="22" fill="#261B6D" />
      <circle cx="52" cy="50" r="14" fill="#B2DE81" />
      <circle cx="148" cy="50" r="14" fill="#B2DE81" />
      <circle cx="52" cy="50" r="8" fill="#8fc455" />
      <circle cx="148" cy="50" r="8" fill="#8fc455" />

      {/* وجه */}
      <circle cx="100" cy="100" r="46" fill="#B2DE81" />
      <circle cx="100" cy="100" r="40" fill="#c8e9a0" />

      {/* عينان كبيرتان كيوت */}
      <circle cx="84" cy="92" r="10" fill="#261B6D" />
      <circle cx="116" cy="92" r="10" fill="#261B6D" />
      {/* لمعة العين */}
      <circle cx="87" cy="88" r="3.5" fill="white" />
      <circle cx="119" cy="88" r="3.5" fill="white" />
      <circle cx="82" cy="94" r="1.5" fill="white" opacity="0.6" />
      <circle cx="114" cy="94" r="1.5" fill="white" opacity="0.6" />

      {/* أنف */}
      <ellipse cx="100" cy="105" rx="7" ry="5" fill="#261B6D" />

      {/* ابتسامة */}
      <path d="M 88 113 Q 100 122 112 113" stroke="#261B6D" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* وجنتان وردية */}
      <circle cx="72" cy="107" r="9" fill="#ff9eb5" opacity="0.4" />
      <circle cx="128" cy="107" r="9" fill="#ff9eb5" opacity="0.4" />

      {/* نجوم زينة */}
      <text x="25" y="75" fontSize="14" fill="#B2DE81" opacity="0.9">✦</text>
      <text x="163" y="72" fontSize="11" fill="#B2DE81" opacity="0.8">✦</text>
      <text x="155" y="115" fontSize="9" fill="#B2DE81" opacity="0.6">✦</text>

      {/* ساقان */}
      <ellipse cx="78" cy="220" rx="20" ry="14" fill="#261B6D" />
      <ellipse cx="122" cy="220" rx="20" ry="14" fill="#261B6D" />
      <ellipse cx="78" cy="226" rx="24" ry="10" fill="#352a8a" />
      <ellipse cx="122" cy="226" rx="24" ry="10" fill="#352a8a" />
    </svg>
  );
}
