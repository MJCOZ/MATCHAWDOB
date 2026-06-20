import { Star } from "lucide-react";
import { getReviewStats } from "@/lib/settings";

const reviews = [
  {
    name: "سارة الأحمدي",
    city: "الرياض",
    rating: 5,
    text: "أفضل ماتشا جربته في حياتي! اللون أخضر زاهٍ والنكهة ناعمة ومميزة. التغليف جميل جداً والتوصيل كان سريع. رح أكرر الطلب بكيف",
    product: "ماتشا سيريمونيال",
    date: "منذ أسبوع",
    verified: true,
    avatar: "س",
  },
  {
    name: "فيصل المطيري",
    city: "جدة",
    rating: 5,
    text: "طقم أدوات الماتشا الكامل — جودته فوق التوقع! المخفقة (شاسين) والطاسة الخزفية مصنوعة بإتقان ياباني حقيقي. وصلت في يومين فقط",
    product: "طقم أدوات الماتشا",
    date: "منذ 3 أيام",
    verified: true,
    avatar: "ف",
  },
  {
    name: "منى القحطاني",
    city: "الدمام",
    rating: 5,
    text: "استخدمت الماتشا الكوليناري في صنع الكيك والآيس كريم — النتيجة كانت رائعة! اللون والنكهة ممتازة. المتجر محترم وسريع التوصيل",
    product: "ماتشا كوليناري",
    date: "منذ أسبوعين",
    verified: true,
    avatar: "م",
  },
];

export async function TestimonialsSection() {
  const stats = await getReviewStats();
  return (
    <section className="container-custom py-10 md:py-16">

      {/* العنوان */}
      <div className="text-center mb-8 md:mb-12">
        <span className="section-tag mb-4 inline-flex mx-auto">
          <span className="font-en">✦ REVIEWS</span>
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-[#261B6D] mt-3 mb-2">عملاؤنا يتحدثون</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-[#B2DE81] text-[#B2DE81]" />
            ))}
          </div>
          <span className="font-black text-[#261B6D] font-en">4.9</span>
          <span className="text-gray-500 text-sm">من أكثر من 500 تقييم</span>
        </div>
      </div>

      {/* بطاقات التقييمات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <div key={review.name} className="review-card relative overflow-hidden">

            {/* علامة التنصيص */}
            <div className="absolute top-4 left-5 text-6xl font-black text-[#261B6D] opacity-5 pointer-events-none select-none"
              style={{ fontFamily: "serif", lineHeight: 1 }}>
              "
            </div>

            {/* النجوم */}
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#B2DE81] text-[#B2DE81]" />
              ))}
            </div>

            {/* التعليق */}
            <p className="text-sm text-gray-700 leading-relaxed mb-5 relative z-10">
              "{review.text}"
            </p>

            {/* بادج المنتج */}
            <div className="mb-4">
              <span className="text-xs font-black text-[#261B6D] px-2.5 py-1"
                style={{ background: "#B2DE81", border: "1.5px solid #1a1a1a", borderRadius: "2px" }}>
                {review.product}
              </span>
            </div>

            {/* المعلومات */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ background: "#261B6D", border: "2px solid #1a1a1a", borderRadius: "4px" }}>
                {review.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-gray-900">{review.name}</p>
                  {review.verified && (
                    <span className="text-xs font-black text-[#B2DE81]">✓ موثّق</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{review.city} · {review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* إجمالي التقييمات */}
      <div className="mt-6 md:mt-10 text-center">
        <div className="inline-flex items-center gap-3 sm:gap-6 px-5 sm:px-8 py-4 sm:py-5 max-w-full"
          style={{ border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #B2DE81", borderRadius: "4px", background: "white" }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className={`text-center ${i > 0 ? "pr-3 sm:pr-6 border-r-2 border-gray-100" : ""}`}>
              <p className="text-xl sm:text-2xl font-black text-[#261B6D] font-en">{stat.num}</p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 whitespace-nowrap">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
