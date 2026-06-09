import type { Metadata } from "next";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-14 max-w-3xl">
      <div className="text-center mb-10">
        <p className="text-[#B2DE81] font-bold mb-2">✦ خصوصيتك تهمنا</p>
        <h1 className="text-4xl font-black text-[#261B6D]">سياسة الخصوصية</h1>
        <p className="text-gray-500 text-sm mt-2">آخر تحديث: يناير 2025</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#eeedf8] p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
        {[
          {
            title: "المعلومات التي نجمعها",
            content: "نجمع المعلومات الأساسية فقط لإتمام طلبك: الاسم، رقم الجوال، البريد الإلكتروني، وعنوان التوصيل. نحن لا نجمع أي معلومات غير ضرورية.",
          },
          {
            title: "كيف نستخدم معلوماتك",
            content: `• معالجة طلباتك وتوصيلها
• التواصل معك بشأن طلباتك
• تحسين تجربة التسوق لديك
• إرسال عروض وأخبار المتجر (يمكنك إلغاء الاشتراك في أي وقت)`,
          },
          {
            title: "حماية بياناتك",
            content: "نستخدم تشفير SSL لحماية جميع بياناتك. لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تجارية.",
          },
          {
            title: "ملفات الكوكيز",
            content: "نستخدم ملفات كوكيز أساسية فقط لتحسين تجربة التصفح وحفظ سلة التسوق. لا نستخدم كوكيز تتبع لأغراض إعلانية.",
          },
          {
            title: "حقوقك",
            content: `• حق الوصول: يمكنك طلب نسخة من بياناتك
• حق التعديل: يمكنك تعديل بياناتك في أي وقت
• حق الحذف: يمكنك طلب حذف حسابك وبياناتك
• للتواصل: hello@matchwdob.sa`,
          },
          {
            title: "مشاركة البيانات مع شركاء الشحن",
            content: "نشارك بيانات التوصيل الأساسية (الاسم والعنوان ورقم الجوال) مع شركات الشحن المعتمدة فقط وذلك لإتمام عملية التوصيل.",
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
