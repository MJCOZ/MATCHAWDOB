"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon: any;
}

export function OrderSummary({ items, subtotal, discount, shipping, tax, total, coupon }: OrderSummaryProps) {
  const { applyCoupon, removeCoupon } = useCartStore();
  const { currency_symbol } = useStoreSettings();
  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    try {
      const res = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "كوبون غير صالح");
      applyCoupon(data.code, data.value, data.type);
      toast.success(`تم تطبيق الكوبون! خصم ${data.type === "PERCENTAGE" ? data.value + "%" : formatPrice(data.value, currency_symbol)}`);
      setCouponInput("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h3>

      {/* المنتجات */}
      <div className="space-y-3 mb-5">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {product.mainImage ? (
                <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xl">📦</div>
              )}
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{product.nameAr}</p>
              <p className="text-xs text-orange-500 font-bold mt-0.5">
                {formatPrice(getEffectivePrice(product.price, product.salePrice) * quantity, currency_symbol)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* كوبون */}
      {!coupon ? (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="كوبون الخصم"
              className="input-field text-sm py-2 flex-1"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponInput.trim()}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <Tag size={14} />
              {isApplying ? "..." : "تطبيق"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-green-600" />
            <div>
              <p className="text-xs font-bold text-green-700">{coupon.code}</p>
              <p className="text-xs text-green-600">- {formatPrice(discount, currency_symbol)}</p>
            </div>
          </div>
          <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* الملخص المالي */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(subtotal, currency_symbol)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>الشحن</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "مجاني 🎁" : formatPrice(shipping, currency_symbol)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>ضريبة القيمة المضافة (15%)</span>
          <span>{formatPrice(tax, currency_symbol)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>الخصم</span>
            <span>- {formatPrice(discount, currency_symbol)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-200">
          <span>الإجمالي</span>
          <span className="text-orange-500">{formatPrice(total, currency_symbol)}</span>
        </div>
      </div>

      {/* ضمانات */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>🔒</span>
          <span>دفع آمن 100% مشفر بـ SSL</span>
        </div>
      </div>
    </div>
  );
}
