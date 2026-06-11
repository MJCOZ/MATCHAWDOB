import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck,       title: "FAST DELIVERY", titleAr: "شحن سريع",     desc: "24-48 ساعة" },
  { icon: Shield,      title: "SECURE PAY",    titleAr: "دفع آمن 100%", desc: "SSL معتمد" },
  { icon: RefreshCw,   title: "FREE RETURNS",  titleAr: "إرجاع مجاني",  desc: "خلال 7 أيام" },
  { icon: Headphones,  title: "24/7 SUPPORT",  titleAr: "دعم مستمر",    desc: "فريق متاح دائماً" },
];

export function FeaturesBar() {
  return (
    <div style={{ background: "#FAFAF5", borderBottom: "2px solid #1a1a1a" }}>
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          {features.map(({ icon: Icon, title, titleAr, desc }, i) => (
            <div key={title} className="flex items-center gap-3 flex-shrink-0">
              {/* الأيقونة */}
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ background: "#B2DE81", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", borderRadius: "4px" }}>
                <Icon size={17} className="text-[#261B6D]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#261B6D] tracking-wider font-en">{title}</p>
                <p className="text-xs font-bold text-gray-700">{titleAr}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{desc}</p>
              </div>
              {/* فاصل */}
              {i < features.length - 1 && (
                <div className="w-px h-10 bg-gray-200 hidden md:block mr-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
