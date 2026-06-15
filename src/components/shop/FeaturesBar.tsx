import { Truck, Shield, RefreshCw, Headphones, Tag } from "lucide-react";

const features = [
  { icon: Truck,       en: "FAST DELIVERY", ar: "شحن سريع",      sub: "24 - 48 ساعة لأي مكان" },
  { icon: Shield,      en: "SECURE PAYMENT", ar: "دفع آمن 100%",  sub: "SSL + بوابات معتمدة" },
  { icon: Tag,         en: "BEST PRICE",    ar: "ضمان أفضل سعر", sub: "نوافق على كل عرض أقل" },
  { icon: RefreshCw,   en: "FREE RETURNS",  ar: "إرجاع مجاني",   sub: "7 أيام بدون شروط" },
  { icon: Headphones,  en: "24/7 SUPPORT",  ar: "دعم دائم",       sub: "فريق متاح كل الوقت" },
];

export function FeaturesBar() {
  return (
    <div style={{ borderBottom: "2px solid #1a1a1a", background: "#FAFAF5" }}>
      <div className="container-custom">
        <div className="flex items-stretch divide-x divide-x-reverse divide-gray-200 overflow-x-auto scrollbar-hide">
          {features.map(({ icon: Icon, en, ar, sub }) => (
            <div key={en} className="flex items-center gap-3 py-3.5 px-5 flex-shrink-0 min-w-[180px]">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ background: "#B2DE81", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "4px" }}>
                <Icon size={17} className="text-[#261B6D]" />
              </div>
              <div>
                <p className="text-[9px] font-black tracking-widest text-[#261B6D]/40 font-en uppercase leading-none mb-0.5">{en}</p>
                <p className="text-xs font-black text-[#261B6D] leading-none">{ar}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
