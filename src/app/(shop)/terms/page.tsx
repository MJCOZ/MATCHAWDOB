import type { Metadata } from "next";

export const metadata: Metadata = { title: "الشروط والأحكام" };

export default function TermsPage() {
  return (
    <div className="container-custom py-14 max-w-3xl">
      <div className="text-center mb-10">
        <p className="text-[#B2DE81] font-bold mb-2">✦ اتفاقية الاستخدام</p>
        <h1 className="text-4xl font-black text-[#261B6D]">الشروط والأحكام</h1>
        <p className="text-gray-500 text-sm mt-2">آخر تحديث: يناير 2025</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#eeedf8] p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
        {[
          {
            title: "الموافقة على الشروط",
            content: "باستخدامك لموقع MatchaWoob، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.",
          },
          {
            title: "الأسعار وطرق الدفع",
            content: `• جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة (15%)
• نحتفظ بحق تعديل الأسعار في أي وقت
• الدفع الإلكتروني الآمن عبر بوابات دفع معتمدة
• لا نقبل الدفع عند الاستلام حالياً`,
          },
          {
            title: "الطلبات والإلغاء",
            content: `• يمكن إلغاء الطلب خلال ساعتين من تقديمه
• بعد بدء التجهيز لا يمكن إلغاء الطلب
• في حالة عدم توفر المنتج سنتواصل معك فوراً`,
          },
          {
            title: "المنتجات والمحتوى",
            content: "نسعى لأن تكون صور وأوصاف المنتجات دقيقة قدر الإمكان. قد يختلف اللون أو الشكل قليلاً عن الصور بسبب اختلاف شاشات العرض.",
          },
          {
            title: "الملكية الفكرية",
            content: "جميع المحتوى على الموقع (الشعارات، الصور، النصوص، الشخصيات) ملك حصري لـ MatchaWoob ومحمي بحقوق الملكية الفكرية. يُحظر أي استخدام بدون إذن كتابي مسبق.",
          },
          {
            title: "تحديد المسؤولية",
            content: "MatchaWoob غير مسؤول عن أي أضرار غير مباشرة تنتج عن استخدام المنتجات خارج نطاق التعليمات المرفقة.",
          },
          {
            title: "القانون المطبق",
            content: "تخضع هذه الشروط لنظام التجارة الإلكترونية في المملكة العربية السعودية وأنظمة هيئة الاتصالات وتقنية المعلومات.",
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-black text-[#261B6D] text-lg mb-3 flex items-center gap-2">
              <span className="text-[#B2DE81]">✦</span> {section.title}
            </h2>
            <p className="whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
