interface AlienMascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function AlienMascot({ size = 140, className = "", animate = true }: AlienMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 220"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-float" : ""} ${className}`}
      style={{
        filter: "drop-shadow(0 8px 16px rgba(178, 222, 129, 0.35))",
        animationDelay: "1s",
      }}
    >
      {/* ظل */}
      <ellipse cx="90" cy="215" rx="42" ry="7" fill="rgba(178,222,129,0.2)" />

      {/* هالة كونية */}
      <circle cx="90" cy="80" r="70" fill="rgba(178,222,129,0.06)" />

      {/* الجسم - قميص أبيض */}
      <ellipse cx="90" cy="158" rx="42" ry="50" fill="white" />
      <ellipse cx="90" cy="148" rx="36" ry="42" fill="#f0f0f0" />

      {/* زر القميص */}
      <circle cx="90" cy="138" r="3" fill="#d1d5db" />
      <circle cx="90" cy="150" r="3" fill="#d1d5db" />
      <circle cx="90" cy="162" r="3" fill="#d1d5db" />

      {/* ذراعان */}
      <ellipse cx="50" cy="148" rx="14" ry="24" fill="#B2DE81" transform="rotate(-10 50 148)" />
      <ellipse cx="130" cy="148" rx="14" ry="24" fill="#B2DE81" transform="rotate(10 130 148)" />
      {/* يدان */}
      <circle cx="43" cy="168" r="11" fill="#8fc455" />
      <circle cx="137" cy="168" r="11" fill="#8fc455" />

      {/* الرأس الكروي الأخضر */}
      <ellipse cx="90" cy="78" rx="52" ry="60" fill="#B2DE81" />
      <ellipse cx="90" cy="70" rx="46" ry="52" fill="#c8e9a0" />

      {/* قرون الهوائي */}
      <line x1="68" y1="22" x2="58" y2="5" stroke="#8fc455" strokeWidth="3" strokeLinecap="round" />
      <circle cx="57" cy="4" r="5" fill="#261B6D" />
      <line x1="112" y1="22" x2="122" y2="5" stroke="#8fc455" strokeWidth="3" strokeLinecap="round" />
      <circle cx="123" cy="4" r="5" fill="#261B6D" />

      {/* عينان كبيرتان - كيوت كونية */}
      <ellipse cx="73" cy="72" rx="17" ry="20" fill="#261B6D" />
      <ellipse cx="107" cy="72" rx="17" ry="20" fill="#261B6D" />
      {/* لمعة */}
      <circle cx="78" cy="64" r="5" fill="white" />
      <circle cx="112" cy="64" r="5" fill="white" />
      <circle cx="72" cy="76" r="2.5" fill="white" opacity="0.5" />
      <circle cx="106" cy="76" r="2.5" fill="white" opacity="0.5" />
      {/* قزحية */}
      <circle cx="76" cy="70" r="9" fill="rgba(38,27,109,0.5)" />
      <circle cx="110" cy="70" r="9" fill="rgba(38,27,109,0.5)" />

      {/* أنف صغير */}
      <ellipse cx="90" cy="87" rx="4" ry="3" fill="#8fc455" />

      {/* فم كيوت */}
      <path d="M 80 96 Q 90 104 100 96" stroke="#261B6D" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* وجنتان برتقالية */}
      <circle cx="63" cy="85" r="8" fill="#ffb347" opacity="0.3" />
      <circle cx="117" cy="85" r="8" fill="#ffb347" opacity="0.3" />

      {/* نجوم كونية زاهية */}
      <text x="18" y="55" fontSize="13" fill="#261B6D" opacity="0.7">✦</text>
      <text x="150" y="50" fontSize="10" fill="#261B6D" opacity="0.6">✦</text>
      <text x="145" y="95" fontSize="8" fill="#261B6D" opacity="0.5">★</text>
      <text x="22" y="90" fontSize="8" fill="#8fc455" opacity="0.7">✦</text>

      {/* ساقان */}
      <ellipse cx="72" cy="203" rx="17" ry="12" fill="#B2DE81" />
      <ellipse cx="108" cy="203" rx="17" ry="12" fill="#B2DE81" />
      <ellipse cx="72" cy="210" rx="20" ry="8" fill="#8fc455" />
      <ellipse cx="108" cy="210" rx="20" ry="8" fill="#8fc455" />
    </svg>
  );
}
