"use client";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getEffectivePrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQuantity,
    getSubtotal, getDiscount, getShipping, getTotal, coupon
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();
  const tax = (subtotal - discount) * 0.15;

  if (!isOpen) return null;

  return (
    <>
      {/* خلفية شبه شفافة */}
      <div
        className="fixed inset-0 bg-[#261B6D]/60 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* درج السلة */}
      <div className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-fadeInUp">
        {/* رأس السلة */}
        <div className="flex items-center justify-between p-5 bg-[#261B6D] text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-[#B2DE81]" />
            <h2 className="text-xl font-bold">سلة المشتريات ✦</h2>
            {items.length > 0 && (
              <span className="bg-[#B2DE81] text-[#261B6D] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {items.reduce((t, i) => t + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-[#352a8a] rounded-xl transition-colors"
          >
            <X size={20} className="text-[#B2DE81]" />
          </button>
        </div>

        {/* محتوى السلة */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-28 h-28 bg-[#eeedf8] rounded-full flex items-center justify-center mb-5">
              <span className="text-5xl">🍵</span>
            </div>
            <h3 className="text-xl font-bold text-[#261B6D] mb-2">السلة فارغة</h3>
            <p className="text-gray-500 text-sm mb-6">لم تضف أي منتجات بعد — استكشف عالم الماتشا!</p>
            <Link href="/products" onClick={closeCart} className="btn-primary">
              تسوق الآن ✦
            </Link>
          </div>
        ) : (
          <>
            {/* قائمة المنتجات */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => {
                const price = getEffectivePrice(product.price, product.salePrice);
                return (
                  <div key={product.id} className="flex items-center gap-3 bg-[#F8F7FF] border border-[#e8e6f5] rounded-2xl p-3">
                    {/* صورة المنتج */}
                    <div className="w-20 h-20 bg-[#eeedf8] rounded-xl overflow-hidden flex-shrink-0 relative">
                      {product.mainImage ? (
                        <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍵</div>
                      )}
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">{product.nameAr}</h4>
                      <p className="text-[#261B6D] font-bold text-sm">{formatPrice(price)}</p>

                      {/* التحكم في الكمية */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 bg-white border-2 border-[#e8e6f5] rounded-xl flex items-center justify-center hover:border-[#B2DE81] transition-colors"
                        >
                          <Minus size={12} className="text-[#261B6D]" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#261B6D]">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 bg-white border-2 border-[#e8e6f5] rounded-xl flex items-center justify-center hover:border-[#B2DE81] transition-colors disabled:opacity-50"
                        >
                          <Plus size={12} className="text-[#261B6D]" />
                        </button>
                      </div>
                    </div>

                    {/* حذف */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} className="text-red-400 hover:text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ملخص السعر */}
            <div className="border-t-2 border-[#eeedf8] p-4 space-y-2 bg-[#F8F7FF]">
              {coupon && (
                <div className="bg-[#B2DE81]/20 border border-[#B2DE81]/40 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-[#261B6D] text-xs font-bold">✦ كوبون: {coupon.code}</span>
                  <span className="text-[#261B6D] text-xs font-bold">- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>الشحن</span>
                <span className={shipping === 0 ? "text-[#261B6D] font-bold" : ""}>
                  {shipping === 0 ? "مجاني ✦" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ضريبة القيمة المضافة (15%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>الخصم</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black text-[#261B6D] pt-2 border-t-2 border-[#eeedf8]">
                <span>الإجمالي</span>
                <span>{formatPrice(total)}</span>
              </div>

              {subtotal < 200 && (
                <div className="bg-[#B2DE81]/15 border border-[#B2DE81]/30 rounded-xl py-2 px-3 text-center">
                  <p className="text-xs text-[#261B6D] font-medium">
                    أضف <span className="font-bold">{formatPrice(200 - subtotal)}</span> للحصول على شحن مجاني ✦
                  </p>
                  <div className="mt-1.5 h-1.5 bg-[#eeedf8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B2DE81] rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full text-center block mt-3 py-3.5 text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="text-[#B2DE81]" />
                إتمام الشراء
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-gray-500 hover:text-[#261B6D] flex items-center justify-center gap-1 py-2 transition-colors"
              >
                <ArrowLeft size={14} />
                متابعة التسوق
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
