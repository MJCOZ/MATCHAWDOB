import { Leaf, Award, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Leaf,
    en: "ORGANIC",
    title: "ماتشا عضوي 100%",
    desc: "نختار بعناية أفضل أوراق الشاي من مزارع أوجي وكيوتو اليابانية المعتمدة بشهادات الجودة الدولية",
    kanji: "自然",
    color: "#B2DE81",
    bg: "#f0fde4",
  },
  {
    icon: Award,
    en: "PREMIUM",
    title: "جودة مضمونة",
    desc: "كل منتج يمر بفحوصات دقيقة للتأكد من طزاجته وصلاحيته. نضمن لك تجربة ماتشا أصيلة في كل مرة",
    kanji: "品質",
    color: "#261B6D",
    bg: "#eeedf8",
  },
  {
    icon: Truck,
    en: "24H SHIPPING",
    title: "توصيل سريع",
    desc: "نشحن طلبك خلال 24 ساعة من التأكيد لجميع مناطق المملكة العربية السعودية بسرعة واحترافية",
    kanji: "速達",
    color: "#ff3b3b",
    bg: "#fff0f0",
  },
  {
    icon: ShieldCheck,
    en: "GUARANTEED",
    title: "ضمان الرضا",
    desc: "إذا لم تكن راضياً عن أي منتج، نستردّه خلال 7 أيام بدون أسئلة. رضاك أولويتنا دائماً",
    kanji: "保証",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-10 md:py-16 ink-dots-bg" style={{ borderTop: "2px solid #1a1a1a", borderBottom: "2px solid #1a1a1a" }}>
      <div className="container-custom">

        {/* العنوان */}
        <div className="text-center mb-8 md:mb-12">
          <span className="section-tag mb-4 inline-flex mx-auto">
            <span className="font-en">✦ WHY MATCHAWDOB</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#261B6D] mt-3 mb-3">
            لماذا تختار <span style={{ color: "#B2DE81", WebkitTextStroke: "1px #1a1a1a" }}>MatchaWdob</span>؟
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            أكثر من مجرد متجر — نحن بوابتك لعالم الماتشا الياباني الأصيل
          </p>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, en, title, desc, kanji, color, bg }) => (
            <div key={en} className="feature-card relative overflow-hidden">

              {/* كانجي خلفي */}
              <span className="absolute -bottom-3 -left-2 text-5xl font-black pointer-events-none select-none"
                style={{ color, opacity: 0.06, fontFamily: "serif" }}>
                {kanji}
              </span>

              {/* الأيقونة */}
              <div className="w-14 h-14 flex items-center justify-center mb-4"
                style={{ background: bg, border: `2px solid ${color}`, borderRadius: "4px" }}>
                <Icon size={26} style={{ color }} />
              </div>

              {/* الإنجليزية الصغيرة */}
              <p className="font-en text-xs font-black tracking-widest mb-2" style={{ color, opacity: 0.7 }}>{en}</p>

              {/* العنوان */}
              <h3 className="text-base font-black text-[#261B6D] mb-2">{title}</h3>

              {/* الوصف */}
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
