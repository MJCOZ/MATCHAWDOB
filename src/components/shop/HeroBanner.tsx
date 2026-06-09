"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "تسوق بثقة وأمان",
    subtitle: "أفضل المنتجات العالمية بأسعار منافسة",
    description: "شحن سريع لجميع مناطق المملكة • دفع آمن • إرجاع مجاني",
    cta: "تسوق الآن",
    ctaLink: "/products",
    bg: "from-gray-900 via-gray-800 to-gray-900",
    accent: "text-orange-400",
    badge: "خصم يصل إلى 50%",
    image: "🛍️",
  },
  {
    id: 2,
    title: "أحدث الإلكترونيات",
    subtitle: "تقنية متطورة بضمان رسمي",
    description: "أفضل الماركات العالمية • ضمان سنتين • توصيل خلال 24 ساعة",
    cta: "استكشف الآن",
    ctaLink: "/products?category=electronics",
    bg: "from-blue-950 via-blue-900 to-gray-900",
    accent: "text-blue-400",
    badge: "منتجات جديدة",
    image: "💻",
  },
  {
    id: 3,
    title: "عروض نهاية الأسبوع",
    subtitle: "خصومات حصرية لوقت محدود",
    description: "استغل العروض قبل انتهائها • كوبون WELCOME10 خصم 10%",
    cta: "العروض الآن",
    ctaLink: "/products?sale=true",
    bg: "from-orange-900 via-orange-800 to-gray-900",
    accent: "text-yellow-400",
    badge: "🔥 عروض محدودة",
    image: "🎯",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative bg-gradient-to-l ${slide.bg} text-white overflow-hidden transition-all duration-700`}>
      <div className="container-custom py-20 md:py-28">
        <div className="flex items-center justify-between gap-8">
          {/* المحتوى النصي */}
          <div className="max-w-2xl animate-fadeInUp">
            <span className={`inline-flex items-center gap-2 ${slide.accent} bg-white/10 text-sm font-bold px-4 py-1.5 rounded-full mb-5 border border-white/20`}>
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className={`text-xl md:text-2xl ${slide.accent} font-semibold mb-4`}>
              {slide.subtitle}
            </p>
            <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
              {slide.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href={slide.ctaLink} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95">
                <ShoppingBag size={22} />
                {slide.cta}
              </Link>
              <Link href="/products?sale=true" className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold py-4 px-6 rounded-2xl transition-all">
                العروض الحصرية
              </Link>
            </div>
          </div>

          {/* الأيقونة التوضيحية */}
          <div className="hidden md:flex text-[180px] opacity-20 select-none">
            {slide.image}
          </div>
        </div>
      </div>

      {/* أزرار التنقل */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* مؤشرات الشرائح */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "bg-orange-400 w-8" : "bg-white/30 w-2"}`}
          />
        ))}
      </div>
    </section>
  );
}
