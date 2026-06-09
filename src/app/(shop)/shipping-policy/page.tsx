import type { Metadata } from "next";

export const metadata: Metadata = { title: "سياسة الشحن" };

export default function ShippingPolicyPage() {
  return (
    <div className="container-custom py-14 max-w-3xl">
      <div className="text-center mb-10">
        <p className="text-[#B2DE81] font-bold mb-2">✦ الشحن والتوصيل</p>
        <h1 className="text-4xl font-black text-[#261B6D]">سياسة الشحن</h1>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#eeedf8] p-8 space-y-8">
        {[
          {
            title: "مناطق التوصيل",
            content: "نوصّل لجميع مناطق المملكة العربية السعودية الرئيسية والثانوية عبر شركاء الشحن المعتمدين: أرامكس، SMSA Express، والبريد السعودي.",
          },
          {
            title: "مدة التوصيل",
            content: `• الرياض وجدة والدمام: 24-48 ساعة
• المدن الرئيسية الأخرى: 2-3 أيام عمل
• المناطق النائية: 3-5 أيام عمل
• تُحسب أيام العمل من السبت إلى الخميس.`,
          },
          {
            title: "تكلفة الشحن",
            content: `• شحن مجاني: على جميع الطلبات التي تزيد عن 200 ريال
• طلبات أقل من 200 ريال: رسوم شحن 25 ريال
• الشحن المستعجل (24 ساعة): 45 ريال إضافية`,
          },
          {
            title: "تتبع الطلب",
            content: "بعد شحن طلبك ستصلك رسالة SMS تحتوي على رقم التتبع وطريقة متابعة شحنتك. يمكنك أيضاً تتبع الطلب من خلال صفحة 'طلباتي' في حسابك.",
          },
          {
            title: "حالات التأخير",
            content: "في حالات نادرة قد يتأخر التوصيل بسبب ظروف خارجة عن إرادتنا (العطل الرسمية، الظروف الجوية، إلخ). سنتواصل معك فوراً في حال حدوث أي تأخير.",
          },
          {
            title: "الطلبات المسترجعة",
            content: "إذا لم يتم التسليم بعد 3 محاولات، تُعاد الشحنة إلينا. سنتواصل معك لإعادة الجدولة أو استرداد المبلغ كاملاً.",
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
