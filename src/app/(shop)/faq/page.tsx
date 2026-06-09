"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";

const faqs = [
  {
    category: "الطلبات والشحن",
    items: [
      {
        q: "كم يستغرق توصيل الطلب؟",
        a: "نوصّل خلال 24-48 ساعة في الرياض وجدة والدمام. للمدن الأخرى 2-4 أيام عمل عبر أرامكس أو SMSA Express.",
      },
      {
        q: "كيف أتابع طلبي؟",
        a: "بعد شحن الطلب ستصلك رسالة SMS برقم التتبع. يمكنك أيضاً متابعة طلبك من صفحة 'طلباتي' في حسابك.",
      },
      {
        q: "هل الشحن مجاني؟",
        a: "نعم! الشحن مجاني لجميع الطلبات فوق 200 ريال. للطلبات أقل من 200 ريال تكلفة الشحن 25 ريال.",
      },
      {
        q: "هل تشحنون لجميع مناطق المملكة؟",
        a: "نعم نشحن لجميع مناطق المملكة العربية السعودية عبر أرامكس وSMSA Express والبريد السعودي.",
      },
    ],
  },
  {
    category: "المنتجات",
    items: [
      {
        q: "من أين يأتي الماتشا الذي تبيعونه؟",
        a: "نستورد الماتشا مباشرة من مزارع اليابان المشهورة في مناطق أوجي وناشيرو وكيوتو. كل دُفعة تأتي بشهادة جودة.",
      },
      {
        q: "ما الفرق بين الماتشا السيريمونيال والكوليناري؟",
        a: "الماتشا السيريمونيال هو الأعلى جودة، مخصص للشرب المباشر. الكوليناري أقل سعراً ومثالي للطهي والعجائن والمشروبات.",
      },
      {
        q: "كيف أحفظ الماتشا بعد الفتح؟",
        a: "احفظه في علبة محكمة الغلق بعيداً عن الضوء والرطوبة في درجة حرارة الغرفة. يُستهلك خلال شهر من الفتح للحصول على أفضل نكهة.",
      },
    ],
  },
  {
    category: "الدفع والإرجاع",
    items: [
      {
        q: "ما طرق الدفع المتاحة؟",
        a: "نقبل: مدى، فيزا، ماستركارد، Apple Pay، STC Pay، وتابي للتقسيط. جميع المدفوعات محمية بتشفير SSL.",
      },
      {
        q: "هل يمكنني إرجاع المنتج؟",
        a: "نعم! تقبل الإرجاع خلال 7 أيام من الاستلام إذا كان المنتج بحالته الأصلية وغير مفتوح. راجع سياسة الإرجاع لمزيد من التفاصيل.",
      },
      {
        q: "متى يُسترد المبلغ؟",
        a: "يُسترد المبلغ خلال 5-7 أيام عمل على نفس طريقة الدفع بعد استلام المنتج المُرجَع والتحقق منه.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="container-custom py-14 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-[#B2DE81] font-bold mb-2">✦ لديك سؤال؟</p>
        <h1 className="text-4xl font-black text-[#261B6D]">الأسئلة الشائعة</h1>
        <p className="text-gray-500 mt-2">كل ما تريد معرفته عن MatchaWdob</p>
      </div>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-black text-[#261B6D] mb-4 flex items-center gap-2">
              <span className="text-[#B2DE81]">✦</span>
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = openIndex === key;
                return (
                  <div key={i} className="bg-white rounded-3xl border-2 border-[#eeedf8] overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-[#F8F7FF] transition-colors"
                    >
                      <span className="font-semibold text-[#261B6D] text-sm">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-[#B2DE81] flex-shrink-0 mr-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 border-t border-[#eeedf8]">
                        <p className="text-gray-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-[#261B6D] rounded-3xl p-8 text-center text-white">
        <p className="text-[#B2DE81] font-bold mb-2">✦ لم تجد إجابتك؟</p>
        <h3 className="text-2xl font-black mb-4">تواصل معنا مباشرة</h3>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"}?text=مرحباً، لدي سؤال`}
          target="_blank"
          className="inline-flex items-center gap-2 bg-[#B2DE81] text-[#261B6D] font-black px-8 py-3.5 rounded-2xl hover:bg-[#8fc455] transition-colors"
        >
          تواصل عبر واتساب ✦
        </a>
      </div>
    </div>
  );
}
