"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ShoppingBag, Sparkles } from "lucide-react";

interface Slide {
  title: string; subtitle: string; description: string;
  cta: string; ctaLink: string; badge: string; mascot: string;
  image?: string;
}
interface Stat { num: string; label: string; }
interface BannerSettings { slides?: Slide[]; stats?: Stat[]; }

const DEFAULT_SLIDES: Slide[] = [
  { title: "ماتشا من الفضاء", subtitle: "الطعم الياباني الأصيل", description: "اكتشف مجموعتنا الفريدة من الماتشا الفاخر وأدوات التحضير الأصيلة", cta: "تسوق الآن", ctaLink: "/products", badge: "NEW ARRIVAL", mascot: "wave" },
  { title: "ماتشا من الفضاء", subtitle: "من اليابان مباشرةً إليك", description: "أفضل أنواع الماتشا من مزارع اليابان الشهيرة", cta: "اكتشف الآن", ctaLink: "/products?category=matcha-powder", badge: "PREMIUM MATCHA", mascot: "alien" },
  { title: "ماتشا من الفضاء", subtitle: "هدايا كيوت ومميزة", description: "أطقم هدايا فاخرة بتصميم ياباني راقٍ — لكل مناسبة خاصة", cta: "العروض الحصرية", ctaLink: "/products?sale=true", badge: "SPECIAL OFFER", mascot: "surprised" },
];
const DEFAULT_STATS: Stat[] = [
  { num: "+500", label: "عميل سعيد" },
  { num: "100%", label: "ماتشا أصيل" },
  { num: "24h",  label: "توصيل سريع" },
];

/* الكانجي الزخرفية */
const KANJI_DECORATIONS = [
  { text: "抹茶", x: "72%", y: "8%",  size: "7rem",  rotate: "12deg",  opacity: 0.07 },
  { text: "宇宙", x: "85%", y: "55%", size: "9rem",  rotate: "-8deg",  opacity: 0.06 },
  { text: "日本", x: "62%", y: "62%", size: "5.5rem", rotate: "18deg", opacity: 0.05 },
  { text: "茶",   x: "78%", y: "28%", size: "11rem", rotate: "-5deg",  opacity: 0.04 },
  { text: "お",   x: "56%", y: "15%", size: "4rem",  rotate: "25deg",  opacity: 0.07 },
];

/* نجمة صغيرة */
const STARS = [
  { x: "6%",  y: "14%", s: 20, d: 0 },
  { x: "14%", y: "68%", s: 13, d: .5 },
  { x: "4%",  y: "44%", s: 17, d: 1 },
  { x: "90%", y: "10%", s: 22, d: .3 },
  { x: "48%", y: "6%",  s: 11, d: .7 },
  { x: "32%", y: "80%", s: 13, d: .9 },
];

/* هانكو دائري (ختم ياباني) */
function Hanko({ text, size = 80, color = "#B2DE81" }: { text: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="1.5" />
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="22" fontWeight="900" fontFamily="sans-serif">
        {text}
      </text>
    </svg>
  );
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/store-settings")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.slides?.length === 3) setSlides(d.slides);
        if (d?.stats?.length === 3) setStats(d.stats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative bg-[#261B6D] text-white overflow-hidden min-h-[520px] md:min-h-[580px]"
      style={{ borderBottom: "3px solid #1a1a1a" }}>

      {/* طبقة النقاط الزخرفية */}
      <div className="absolute inset-0 stars-pattern opacity-20 pointer-events-none" />

      {/* الكانجي الزخرفية */}
      {KANJI_DECORATIONS.map((k, i) => (
        <div key={i} className="absolute pointer-events-none select-none"
          style={{
            left: k.x, top: k.y,
            fontSize: k.size,
            fontWeight: 900,
            color: "#B2DE81",
            opacity: k.opacity,
            transform: `rotate(${k.rotate})`,
            lineHeight: 1,
            fontFamily: "serif",
          }}>
          {k.text}
        </div>
      ))}

      {/* الهانكو */}
      <div className="absolute top-8 left-10 pointer-events-none hidden lg:block opacity-30">
        <Hanko text="茶" size={96} color="#B2DE81" />
      </div>
      <div className="absolute bottom-24 left-24 pointer-events-none hidden xl:block opacity-20">
        <Hanko text="✦" size={64} color="#ffffff" />
      </div>

      {/* النجوم */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute animate-sparkle pointer-events-none"
          style={{ left: s.x, top: s.y, animationDelay: `${s.d}s` }}>
          <svg width={s.s} height={s.s} viewBox="0 0 24 24" fill="#B2DE81">
            <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
          </svg>
        </div>
      ))}

      {/* ضباب كوني */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#352a8a]/40 blur-3xl pointer-events-none" />

      {/* صورة الشريحة إن وجدت */}
      {slide.image && (
        <div className="absolute bottom-16 left-6 md:left-16 hidden md:flex items-end justify-center z-10 w-60 h-60 lg:w-80 lg:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.image} alt={slide.title} className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      )}

      {/* المحتوى */}
      <div className="container-custom py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">

          {/* شارة البادج — بروتاليزم */}
          <div className="inline-flex items-center gap-2 mb-6"
            style={{
              background: "#B2DE81",
              color: "#261B6D",
              padding: "5px 16px",
              border: "2px solid #1a1a1a",
              boxShadow: "3px 3px 0 #1a1a1a",
              borderRadius: "3px",
              fontWeight: 900,
              fontSize: "11px",
              letterSpacing: "0.1em",
            }}>
            <span className="font-en">{slide.badge}</span>
            <span>✦</span>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-5xl md:text-6xl font-black mb-3 leading-tight text-white"
            style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}>
            {slide.title}
          </h1>

          {/* العنوان الفرعي */}
          <p className="text-[#B2DE81] text-xl font-bold mb-4">{slide.subtitle}</p>

          {/* الوصف */}
          <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed max-w-lg">
            {slide.description}
          </p>

          {/* الأزرار */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href={slide.ctaLink}
              className="inline-flex items-center gap-2 font-black text-[#261B6D] py-3.5 px-8 text-base transition-all active:translate-x-0.5 active:translate-y-0.5"
              style={{
                background: "#B2DE81",
                border: "2px solid #1a1a1a",
                boxShadow: "4px 4px 0 #1a1a1a",
                borderRadius: "4px",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 #1a1a1a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 #1a1a1a"; }}
            >
              <ShoppingBag size={20} />
              {slide.cta}
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2 font-bold text-white py-3.5 px-7 text-base transition-all"
              style={{
                background: "transparent",
                border: "2px solid rgba(178,222,129,0.6)",
                boxShadow: "4px 4px 0 rgba(178,222,129,0.3)",
                borderRadius: "4px",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#B2DE81"; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 rgba(178,222,129,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(178,222,129,0.6)"; (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 rgba(178,222,129,0.3)"; }}
            >
              <Sparkles size={18} className="text-[#B2DE81]" />
              استكشف المتجر
            </Link>
          </div>

          {/* الإحصائيات */}
          <div className="flex items-center gap-6 mt-10 pt-6"
            style={{ borderTop: "1px solid rgba(178,222,129,0.2)" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-black text-[#B2DE81] font-en">{stat.num}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* موجة سفلية */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,24 1440,32 L1440,64 L0,64 Z"
            fill="#FAFAF5" />
        </svg>
      </div>

      {/* أزرار التنقل */}
      <button onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center transition-all z-20"
        style={{ background: "rgba(178,222,129,.15)", border: "2px solid rgba(178,222,129,.4)", borderRadius: "4px" }}
        aria-label="السابق">
        <ChevronRight size={20} className="text-[#B2DE81]" />
      </button>
      <button onClick={() => setCurrent(p => (p + 1) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center transition-all z-20"
        style={{ background: "rgba(178,222,129,.15)", border: "2px solid rgba(178,222,129,.4)", borderRadius: "4px" }}
        aria-label="التالي">
        <ChevronLeft size={20} className="text-[#B2DE81]" />
      </button>

      {/* مؤشرات الشرائح */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 transition-all ${i === current ? "bg-[#B2DE81] w-8" : "bg-white/30 w-2"}`}
            style={{ borderRadius: "2px" }}
            aria-label={`الشريحة ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
