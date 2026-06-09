"use client";
import { Truck } from "lucide-react";

const SHIPPING_OPTIONS = [
  {
    id: "aramex",
    name: "Aramex",
    nameAr: "أرامكس",
    desc: "توصيل خلال 1-2 يوم عمل",
    price: 30,
    logo: "🚚",
    badge: null,
  },
  {
    id: "smsa",
    name: "SMSA Express",
    nameAr: "SMSA Express",
    desc: "توصيل خلال 1-3 أيام عمل",
    price: 25,
    logo: "📦",
    badge: "الأوفر",
  },
  {
    id: "spl",
    name: "Saudi Post (واصل)",
    nameAr: "البريد السعودي - واصل",
    desc: "توصيل خلال 2-5 أيام عمل",
    price: 20,
    logo: "✉️",
    badge: null,
  },
  {
    id: "free",
    name: "Free Shipping",
    nameAr: "الشحن المجاني",
    desc: "توصيل خلال 3-7 أيام عمل",
    price: 0,
    logo: "🎁",
    badge: "مجاني",
    condition: "للطلبات فوق 200 ريال",
  },
];

interface ShippingStepProps {
  orderData: any;
  setOrderData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ShippingStep({ orderData, setOrderData, onNext, onBack }: ShippingStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Truck size={22} className="text-orange-500" />
        طريقة الشحن
      </h2>

      <div className="space-y-3 mb-8">
        {SHIPPING_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              orderData.shippingMethod === option.id
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={orderData.shippingMethod === option.id}
              onChange={() => setOrderData({ ...orderData, shippingMethod: option.id })}
              className="accent-orange-500"
            />
            <span className="text-3xl">{option.logo}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">{option.nameAr}</p>
                {option.badge && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    option.badge === "مجاني" ? "bg-green-100 text-green-700"
                    : option.badge === "الأوفر" ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                  }`}>
                    {option.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
              {option.condition && (
                <p className="text-xs text-green-600 mt-0.5">({option.condition})</p>
              )}
            </div>
            <p className={`text-lg font-black ${option.price === 0 ? "text-green-600" : "text-gray-900"}`}>
              {option.price === 0 ? "مجاني" : `${option.price} ريال`}
            </p>
          </label>
        ))}
      </div>

      {/* ملاحظات الطلب */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">ملاحظات إضافية (اختياري)</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="أي ملاحظات خاصة بطلبك مثل: يرجى الاتصال قبل التوصيل..."
          value={orderData.notes}
          onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-1 py-3.5">
          ← رجوع
        </button>
        <button onClick={onNext} className="btn-primary flex-2 py-3.5 flex-1">
          متابعة ← طريقة الدفع
        </button>
      </div>
    </div>
  );
}
