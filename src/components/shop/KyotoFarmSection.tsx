import Image from "next/image";

const FIELD_IMAGE = "/images/kyoto/field.jpg";
const VILLAGE_IMAGE = "/images/kyoto/village.jpg";

const steps = [
  { kanji: "陰", title: "تظليل تقليدي", desc: "قبل الحصاد بأسابيع" },
  { kanji: "摘", title: "حصاد يدوي", desc: "لأجود الأوراق فقط" },
  { kanji: "石", title: "طحن حجري", desc: "بطيء يحافظ على النكهة" },
];

export function KyotoFarmSection() {
  return (
    <section className="container-custom py-10 md:py-16 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

        {/* الصورة */}
        <div className="relative order-2 lg:order-1 pb-8 pl-6 lg:pb-10 lg:pl-8">
          <div className="relative h-[260px] sm:h-[340px] md:h-[400px] overflow-hidden"
            style={{ border: "3px solid #1a1a1a", borderRadius: "6px", boxShadow: "6px 6px 0 #B2DE81" }}>
            <Image
              src={FIELD_IMAGE}
              alt="مزارع الماتشا المتدرجة في كيوتو، اليابان"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover animate-kenburns"
            />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(38,27,109,0) 55%, rgba(38,27,109,.55) 100%)" }} />
            <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5"
              style={{ background: "white", border: "2px solid #1a1a1a", borderRadius: "4px", boxShadow: "2px 2px 0 #1a1a1a" }}>
              <span className="text-sm">📍</span>
              <span className="text-xs font-black text-[#261B6D]">كيوتو، اليابان</span>
            </div>
          </div>

          {/* بطاقة فرعية متراكبة */}
          <div className="hidden sm:block absolute bottom-0 left-0 w-28 h-28 md:w-36 md:h-36 overflow-hidden animate-float"
            style={{ border: "3px solid #1a1a1a", borderRadius: "6px", boxShadow: "4px 4px 0 #1a1a1a", background: "white" }}>
            <Image
              src={VILLAGE_IMAGE}
              alt="قرية يابانية تقليدية بين حقول الماتشا"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>

          {/* زخارف عائمة */}
          <span className="hidden md:block absolute -top-2 right-6 text-7xl font-black opacity-10 select-none pointer-events-none animate-leaf-drift"
            style={{ color: "#261B6D", fontFamily: "serif" }}>
            茶畑
          </span>
          <span className="absolute top-4 left-0 text-2xl select-none pointer-events-none animate-sparkle">🍃</span>
        </div>

        {/* النص */}
        <div className="order-1 lg:order-2">
          <span className="section-tag mb-4 inline-flex">
            <span className="font-en">✦ OUR ORIGIN</span>
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#261B6D] mt-2 mb-4">
            من تلال كيوتو إلى فنجانك
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            في قلب أوجي وكيوتو، حيث الضباب الصباحي والتربة الغنية، تُزرع أوراق الماتشا تحت ظلٍ خاص قبل الحصاد لتركيز لونها ونكهتها. حصاد يدوي وطحن بالحجر التقليدي على طريقة الأجداد — لنُحضر لك ماتشا أصيلة 100%، كما تُصنع منذ قرون.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {steps.map((s) => (
              <div key={s.title} className="text-center p-3"
                style={{ border: "2px solid #1a1a1a", borderRadius: "4px", background: "#FAFAF5" }}>
                <p className="text-2xl mb-1" style={{ fontFamily: "serif", color: "#B2DE81", WebkitTextStroke: "1px #1a1a1a" }}>
                  {s.kanji}
                </p>
                <p className="text-xs font-black text-[#261B6D]">{s.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
