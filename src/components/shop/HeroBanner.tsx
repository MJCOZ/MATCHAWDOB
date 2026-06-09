"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ShoppingBag, Sparkles } from "lucide-react";
import { PandaAstronaut } from "@/components/brand/PandaAstronaut";
import { AlienMascot } from "@/components/brand/AlienMascot";

const slides = [
  {
    id: 1,
    title: "ماتشا من الفضاء",
    subtitle: "الطعم الياباني الأصيل",
    description: "اكتشف مجموعتنا الفريدة من الماتشا الفاخر وأدوات التحضير الأصيلة — مختارة بعناية من أجود مزارع اليابان",
    cta: "تسوق الآن",
    ctaLink: "/products",
    badge: "✦ جديد ومميز",
    mascot: "panda-wave",
  },
  {
    id: 2,
    title: "ماتشا من الفضاء",
    subtitle: "من اليابان مباشرةً إليك",
    description: "أفضل أنواع الماتشا من مزارع اليابان الشهيرة — نكهة خاصة لكل رشفة",
    cta: "اكتشف الآن",
    ctaLink: "/products?category=matcha-powder",
    badge: "🍵 ماتشا أصيل",
    mascot: "alien",
  },
  {
    id: 3,
    title: "ماتشا من الفضاء",
    subtitle: "هدايا كيوت ومميزة",
    description: "أطقم هدايا فاخرة بتصميم ياباني راقٍ — لكل مناسبة خاصة وكل من تحب",
    cta: "العروض الحصرية",
    ctaLink: "/products?sale=true",
    badge: "✦ عروض محدودة",
    mascot: "panda-surprise",
  },
];

/* نجمة مضيئة */
function Star({ x, y, size, delay, color = "#B2DE81" }: { x: number; y: number; size: number; delay: number; color?: string }) {
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, animationDelay: `${delay}s` }}
      className="animate-sparkle"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
    </svg>
  );
}

const stars = [
  { x: "8%",  y: "12%", size: 22, delay: 0,   color: "#B2DE81" },
  { x: "15%", y: "65%", size: 14, delay: 0.5, color: "#B2DE81" },
  { x: "5%",  y: "42%", size: 18, delay: 1,   color: "#ffffff" },
  { x: "88%", y: "8%",  size: 24, delay: 0.3, color: "#B2DE81" },
  { x: "82%", y: "18%", size: 14, delay: 0.8, color: "#ffffff" },
  { x: "92%", y: "72%", size: 16, delay: 1.2, color: "#B2DE81" },
  { x: "55%", y: "5%",  size: 12, delay: 0.6, color: "#B2DE81" },
  { x: "48%", y: "88%", size: 10, delay: 1.5, color: "#ffffff" },
  { x: "30%", y: "78%", size: 14, delay: 0.9, color: "#B2DE81" },
  { x: "72%", y: "55%", size: 10, delay: 0.2, color: "#ffffff" },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative bg-[#261B6D] text-white overflow-hidden min-h-[500px] md:min-h-[560px]">

      {/* النجوم الزخرفية فقط */}
      <div className="absolute inset-0 stars-pattern opacity-25 pointer-events-none" />
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute animate-sparkle pointer-events-none"
          style={{ left: s.x, top: s.y, animationDelay: `${s.delay}s` }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={s.color}>
            <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
          </svg>
        </div>
      ))}

      {/* ضباب كوني */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#352a8a]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#B2DE81]/8 blur-3xl pointer-events-none" />

      <div className="container-custom py-16 md:py-20 relative z-10">
        <div className="flex items-center justify-between gap-8">

          {/* المحتوى النصي */}
          <div className="max-w-xl animate-fadeInUp">
            {/* شارة */}
            <span className="inline-flex items-center gap-2 bg-[#B2DE81]/20 text-[#B2DE81] text-sm font-bold px-5 py-1.5 rounded-full mb-6 border border-[#B2DE81]/30">
              {slide.badge}
            </span>

            {/* السلوقن الرئيسي */}
            <h1 className="text-5xl md:text-6xl font-bold mb-3 leading-tight text-white">
              {slide.title}
            </h1>
            <p className="text-[#B2DE81] text-xl font-semibold mb-4">
              {slide.subtitle}
            </p>
            <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
              {slide.description}
            </p>

            {/* أزرار */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-[#B2DE81] hover:bg-[#8fc455] text-[#261B6D] font-black py-4 px-8 rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-[#B2DE81]/30 active:scale-95"
              >
                <ShoppingBag size={22} />
                {slide.cta}
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border-2 border-[#B2DE81]/40 hover:border-[#B2DE81] text-white font-semibold py-4 px-6 rounded-2xl transition-all hover:bg-[#B2DE81]/10"
              >
                <Sparkles size={18} className="text-[#B2DE81]" />
                استكشف المتجر
              </Link>
            </div>

            {/* إحصائيات */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
              {[
                { num: "+500", label: "عميل سعيد" },
                { num: "100%", label: "ماتشا أصيل" },
                { num: "24h",  label: "توصيل سريع" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl text-[#B2DE81] font-bold">{stat.num}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* الشخصيات */}
          <div className="hidden lg:flex items-end gap-2 flex-shrink-0">
            {slide.mascot === "alien" ? (
              <>
                <div className="mb-6">
                  <AlienMascot size={170} animate={true} />
                </div>
                <div>
                  <PandaAstronaut size={210} animate={true} variant="wave" />
                </div>
              </>
            ) : slide.mascot === "panda-surprise" ? (
              <>
                <div className="mb-6">
                  <AlienMascot size={155} animate={true} />
                </div>
                <div>
                  <PandaAstronaut size={210} animate={true} variant="surprised" />
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <AlienMascot size={160} animate={true} />
                </div>
                <div>
                  <PandaAstronaut size={220} animate={true} variant="wave" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* موجة سفلية */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,24 1440,32 L1440,64 L0,64 Z" fill="#F8F7FF" />
        </svg>
      </div>

      {/* أزرار التنقل */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#B2DE81]/20 hover:bg-[#B2DE81]/40 border border-[#B2DE81]/30 rounded-full flex items-center justify-center transition-all z-20"
        aria-label="السابق"
      >
        <ChevronRight size={20} className="text-[#B2DE81]" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#B2DE81]/20 hover:bg-[#B2DE81]/40 border border-[#B2DE81]/30 rounded-full flex items-center justify-center transition-all z-20"
        aria-label="التالي"
      >
        <ChevronLeft size={20} className="text-[#B2DE81]" />
      </button>

      {/* مؤشرات الشرائح */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "bg-[#B2DE81] w-8" : "bg-white/30 w-2"}`}
            aria-label={`الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
