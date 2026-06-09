import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق MatchaWdob - نحن هنا للمساعدة",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";

  return (
    <div className="container-custom py-14">
      <div className="text-center mb-12">
        <p className="text-[#B2DE81] font-bold mb-2">✦ نسعد بتواصلك</p>
        <h1 className="text-4xl font-black text-[#261B6D]">اتصل بنا</h1>
        <p className="text-gray-500 mt-2">فريقنا مستعد لمساعدتك في أي وقت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* معلومات التواصل */}
        <div className="space-y-6">
          <div className="bg-[#261B6D] rounded-3xl p-8 text-white">
            <h2 className="text-xl font-bold mb-6 text-[#B2DE81]">معلومات التواصل ✦</h2>
            <div className="space-y-5">
              {[
                { icon: Phone, label: "الهاتف", value: "920-000-000" },
                { icon: Mail, label: "البريد الإلكتروني", value: "hello@matchwdob.sa" },
                { icon: MapPin, label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
                { icon: Clock, label: "ساعات العمل", value: "السبت - الخميس: 9ص - 11م" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#B2DE81]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#B2DE81]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#B2DE81]/60 mb-0.5">{label}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* واتساب */}
          <a
            href={`https://wa.me/${whatsapp}?text=مرحباً MatchaWdob، أريد الاستفسار عن`}
            target="_blank"
            className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white p-5 rounded-3xl transition-colors"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">تواصل عبر واتساب</p>
              <p className="text-sm text-green-100">رد سريع خلال دقائق</p>
            </div>
          </a>
        </div>

        {/* نموذج التواصل */}
        <div className="bg-white rounded-3xl border-2 border-[#eeedf8] p-8">
          <h2 className="text-xl font-bold text-[#261B6D] mb-6">أرسل لنا رسالة ✦</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">الاسم الكامل</label>
              <input type="text" className="input-field" placeholder="اسمك الكريم" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">البريد الإلكتروني</label>
              <input type="email" className="input-field" placeholder="example@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">رقم الجوال</label>
              <input type="tel" className="input-field" placeholder="05xxxxxxxx" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">الموضوع</label>
              <select className="input-field">
                <option value="">اختر الموضوع</option>
                <option value="order">استفسار عن طلب</option>
                <option value="product">استفسار عن منتج</option>
                <option value="return">طلب إرجاع</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">رسالتك</label>
              <textarea className="input-field resize-none" rows={4} placeholder="اكتب رسالتك هنا..." />
            </div>
            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              إرسال الرسالة ✦
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
