import { BearMascot } from "@/components/brand/BearMascot";
import { AlienMascot } from "@/components/brand/AlienMascot";
import { WavyDivider } from "@/components/brand/WavyDivider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description: "قصة MatchaWoob - عالم الماتشا الياباني والشخصيات الكيوت",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#261B6D] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 stars-pattern opacity-20" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-right">
              <p className="text-[#B2DE81] font-bold mb-3">✦ قصتنا</p>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                من نحن؟<br />
                <span className="text-[#B2DE81] font-brand">MatchaWoob</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                متجر ياباني الروح، سعودي الهوى. نجمع بين شغف الماتشا الأصيل وروح الشخصيات الكيوت في تجربة تسوق مختلفة تماماً.
              </p>
            </div>
            <div className="flex items-end gap-4">
              <AlienMascot size={150} animate={true} />
              <BearMascot size={180} animate={true} />
            </div>
          </div>
        </div>
        <WavyDivider color="#F8F7FF" height={60} />
      </section>

      {/* القصة */}
      <section className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#B2DE81] font-bold mb-2">✦ بداية الحكاية</p>
            <h2 className="text-3xl font-black text-[#261B6D]">كيف بدأ MatchaWoob؟</h2>
          </div>
          <div className="space-y-6 text-gray-600 leading-relaxed text-base">
            <p>
              بدأت القصة بكوب واحد من الماتشا الياباني الأصيل. كان الطعم مختلفاً عن كل ما ذقناه من قبل — أخضر، عميق، وناعم في آنٍ واحد. من تلك اللحظة، وُلد حلم MatchaWoob.
            </p>
            <p>
              أردنا أن نجلب هذه التجربة الاستثنائية إلى كل بيت سعودي، مع لمسة مرحة ومميزة تعكس شخصيتنا: الدب الياباني الكيوت الذي يعشق الماتشا، والكائن الفضائي الأخضر الذي جاء من بعيد ليكتشف طعم هذا الشراب الرائع!
            </p>
            <p>
              اليوم، نقدم أفضل أنواع الماتشا من مزارع اليابان الشهيرة، مع أدوات التحضير الأصيلة والإكسسوارات الكيوت — كل ذلك بتوصيل سريع لجميع مناطق المملكة.
            </p>
          </div>
        </div>
      </section>

      {/* القيم */}
      <section className="bg-[#F8F7FF] py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-[#B2DE81] font-bold mb-2">✦ ما يميزنا</p>
            <h2 className="text-3xl font-black text-[#261B6D]">قيمنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🍵", title: "الجودة أولاً", desc: "نختار الماتشا بعناية من أفضل مزارع اليابان. لا نقبل بأقل من الممتاز." },
              { icon: "🌸", title: "تجربة مختلفة", desc: "ليس مجرد منتج — بل تجربة كاملة تجمع بين الثقافة اليابانية والمرح." },
              { icon: "💚", title: "خدمة بقلب", desc: "كل عميل يعامَل كصديق. رضاك هو نجاحنا." },
            ].map((val) => (
              <div key={val.title} className="bg-white rounded-3xl p-8 border-2 border-[#eeedf8] hover:border-[#B2DE81] transition-all text-center">
                <div className="text-5xl mb-4">{val.icon}</div>
                <h3 className="font-black text-[#261B6D] text-xl mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* أرقام */}
      <section className="bg-[#261B6D] py-14">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "+500", label: "عميل سعيد" },
              { num: "14", label: "منتج مميز" },
              { num: "100%", label: "ماتشا أصيل" },
              { num: "24h", label: "توصيل سريع" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-brand text-4xl text-[#B2DE81] font-bold mb-2">{s.num}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
