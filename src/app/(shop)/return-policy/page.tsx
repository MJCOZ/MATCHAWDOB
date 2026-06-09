import type { Metadata } from "next";

export const metadata: Metadata = { title: "سياسة الإرجاع والاستبدال" };

export default function ReturnPolicyPage() {
  return (
    <div className="container-custom py-14 max-w-3xl">
      <div className="text-center mb-10">
        <p className="text-[#B2DE81] font-bold mb-2">✦ إرجاع واستبدال</p>
        <h1 className="text-4xl font-black text-[#261B6D]">سياسة الإرجاع</h1>
      </div>

      <div className="bg-[#B2DE81]/10 border-2 border-[#B2DE81]/30 rounded-3xl p-5 mb-8 flex items-center gap-4">
        <span className="text-3xl">✦</span>
        <p className="text-[#261B6D] font-bold text-sm">
          رضاك يهمنا! نقبل الإرجاع خلال <strong>7 أيام</strong> من تاريخ الاستلام بدون أسئلة.
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#eeedf8] p-8 space-y-8">
        {[
          {
            title: "شروط قبول الإرجاع",
            content: `• المنتج بحالته الأصلية (لم يُفتح أو يُستخدم)
• العبوة الأصلية سليمة
• خلال 7 أيام من تاريخ الاستلام
• يرافقه فاتورة الشراء أو رقم الطلب`,
          },
          {
            title: "منتجات لا تُرجع",
            content: `• المنتجات الغذائية المفتوحة (ماتشا بودر، مشروبات)
• المنتجات التالفة بسبب سوء الاستخدام
• المنتجات ذات العروض النهائية المحددة`,
          },
          {
            title: "كيفية طلب الإرجاع",
            content: `1. تواصل معنا عبر واتساب أو البريد الإلكتروني
2. أخبرنا برقم طلبك وسبب الإرجاع
3. سنرسل لك كود الشحن المجاني
4. أرسل المنتج عبر أي مكتب شحن
5. يصلك المبلغ خلال 5-7 أيام عمل`,
          },
          {
            title: "استرداد المبلغ",
            content: `• يُسترد المبلغ كاملاً على نفس طريقة الدفع
• مدة الاسترداد: 5-7 أيام عمل بعد استلام المنتج
• رسوم الشحن لا تُسترد إلا في حالة الخطأ من طرفنا`,
          },
          {
            title: "في حالة وصول منتج تالف أو خاطئ",
            content: "إذا وصلك منتج تالف أو مختلف عما طلبت، نعتذر منك ونلتزم بإرجاع كامل أو استبدال فوري مع الشحن المجاني على حسابنا.",
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-black text-[#261B6D] text-lg mb-3 flex items-center gap-2">
              <span className="text-[#B2DE81]">✦</span> {section.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
