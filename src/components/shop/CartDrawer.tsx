"use client";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

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
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* درج السلة */}
      <div className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-fadeInUp">
        {/* رأس السلة */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">سلة المشتريات</h2>
            {items.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {items.reduce((t, i) => t + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* محتوى السلة */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <ShoppingCart size={40} className="text-orange-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">السلة فارغة</h3>
            <p className="text-gray-500 text-sm mb-6">لم تضف أي منتجات بعد</p>
            <Link href="/products" onClick={closeCart} className="btn-primary">
              تسوق الآن
            </Link>
          </div>
        ) : (
          <>
            {/* قائمة المنتجات */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => {
                const price = product.salePrice ?? product.price;
                return (
                  <div key={product.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                    {/* صورة المنتج */}
                    <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                      {product.mainImage ? (
                        <Image src={product.mainImage} alt={product.nameAr} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>
                      )}
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">{product.nameAr}</h4>
                      <p className="text-orange-500 font-bold text-sm">{formatPrice(price)}</p>

                      {/* التحكم في الكمية */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors"
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors disabled:opacity-50"
                        >
                          <Plus size={14} className="text-gray-600" />
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
            <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50">
              {coupon && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-green-700 text-xs font-medium">كوبون: {coupon.code}</span>
                  <span className="text-green-700 text-xs font-bold">- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>الشحن</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "مجاني" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ضريبة القيمة المضافة (15%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>الإجمالي</span>
                <span className="text-orange-500">{formatPrice(total)}</span>
              </div>

              {subtotal < 200 && (
                <p className="text-xs text-center text-gray-500 bg-blue-50 rounded-lg py-2 px-3">
                  أضف {formatPrice(200 - subtotal)} لتحصل على شحن مجاني! 🚚
                </p>
              )}

              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full text-center block mt-3 py-3"
              >
                إتمام الشراء
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 py-2"
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
