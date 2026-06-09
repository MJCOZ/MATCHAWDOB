"use client";
import { CreditCard, Loader2, Shield } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "moyasar_creditcard",
    nameAr: "بطاقة ائتمانية (Visa/Mastercard)",
    desc: "عبر بوابة Moyasar الآمنة",
    icon: "💳",
    badges: ["Visa", "Mastercard"],
  },
  {
    id: "moyasar_mada",
    nameAr: "بطاقة مدى",
    desc: "عبر بوابة Moyasar الآمنة",
    icon: "🏧",
    badges: ["مدى"],
  },
  {
    id: "moyasar_applepay",
    nameAr: "Apple Pay",
    desc: "دفع سريع وآمن",
    icon: "🍎",
    badges: ["Apple Pay"],
  },
  {
    id: "tap",
    nameAr: "Tap Payments",
    desc: "جميع طرق الدفع - بطاقات، STC Pay",
    icon: "💰",
    badges: ["Visa", "Mastercard", "مدى", "STC Pay"],
  },
  {
    id: "cod",
    nameAr: "الدفع عند الاستلام",
    desc: "ادفع نقداً عند وصول طلبك",
    icon: "🏠",
    badges: ["COD"],
    note: "متاح للطلبات أقل من 1000 ريال",
  },
];

interface PaymentStepProps {
  orderData: any;
  setOrderData: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PaymentStep({ orderData, setOrderData, onBack, onSubmit, isLoading }: PaymentStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard size={22} className="text-orange-500" />
        طريقة الدفع
      </h2>

      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              orderData.paymentMethod === method.id
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={orderData.paymentMethod === method.id}
              onChange={() => setOrderData({ ...orderData, paymentMethod: method.id })}
              className="mt-1 accent-orange-500"
            />
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{method.nameAr}</p>
              <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
              {method.note && (
                <p className="text-xs text-amber-600 mt-0.5">⚠️ {method.note}</p>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {method.badges.map((b) => (
                  <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{b}</span>
                ))}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* ضمان الأمان */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-3">
        <Shield size={20} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-green-700">
          جميع المعاملات المالية مشفرة بتقنية SSL وتتم عبر بوابات دفع معتمدة من البنك المركزي السعودي (SAMA)
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} disabled={isLoading} className="btn-outline flex-1 py-3.5 disabled:opacity-50">
          ← رجوع
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              جاري المعالجة...
            </>
          ) : (
            "تأكيد الطلب وادفع →"
          )}
        </button>
      </div>
    </div>
  );
}
