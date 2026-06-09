import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "شحن سريع", desc: "توصيل خلال 24-48 ساعة" },
  { icon: Shield, title: "دفع آمن 100%", desc: "تشفير SSL معتمد" },
  { icon: RefreshCw, title: "إرجاع مجاني", desc: "خلال 7 أيام من الاستلام" },
  { icon: Headphones, title: "دعم 24/7", desc: "فريق خدمة متاح دائماً" },
];

export function FeaturesBar() {
  return (
    <div className="bg-orange-500">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-2.5 flex-shrink-0 text-white">
              <Icon size={20} className="text-orange-100" />
              <div>
                <p className="text-xs font-bold">{title}</p>
                <p className="text-xs text-orange-100 hidden sm:block">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
