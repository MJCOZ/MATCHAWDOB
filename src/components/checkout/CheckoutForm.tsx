"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { AddressStep } from "./AddressStep";
import { ShippingStep } from "./ShippingStep";
import { PaymentStep } from "./PaymentStep";
import { OrderSummary } from "./OrderSummary";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  addresses: any[];
  userId: string;
}

const STEPS = [
  { id: 1, label: "عنوان التوصيل" },
  { id: 2, label: "طريقة الشحن" },
  { id: 3, label: "طريقة الدفع" },
];

export function CheckoutForm({ addresses, userId }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getShipping, getTotal, coupon, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    addressId: addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || "",
    shippingFullName: "",
    shippingPhone: "",
    shippingCity: "",
    shippingDistrict: "",
    shippingStreet: "",
    useNewAddress: addresses.length === 0,
    shippingMethod: "aramex",
    paymentMethod: "moyasar_creditcard",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-xl font-bold text-gray-900 mb-4">السلة فارغة</p>
        <a href="/products" className="btn-primary inline-block">تسوق الآن</a>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = (subtotal - discount) * 0.15;
  const total = getTotal();

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: getEffectivePrice(item.product.price, item.product.salePrice),
          })),
          couponCode: coupon?.code,
          subtotal,
          discount,
          shippingCost: shipping,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "حدث خطأ");

      // توجيه لصفحة الدفع
      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
      } else {
        clearCart();
        router.push(`/orders/${data.orderId}?success=1`);
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ في إتمام الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* استمارة الطلب */}
      <div className="lg:col-span-2">
        {/* خطوات الطلب */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep > step.id ? "bg-green-500 text-white"
                  : currentStep === step.id ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
                }`}>
                  {currentStep > step.id ? <CheckCircle size={18} /> : step.id}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${currentStep === step.id ? "text-orange-500" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${currentStep > step.id ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* محتوى الخطوة */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {currentStep === 1 && (
            <AddressStep
              addresses={addresses}
              orderData={orderData}
              setOrderData={setOrderData}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <ShippingStep
              orderData={orderData}
              setOrderData={setOrderData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep
              orderData={orderData}
              setOrderData={setOrderData}
              onBack={() => setCurrentStep(2)}
              onSubmit={handlePlaceOrder}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* ملخص الطلب */}
      <div>
        <OrderSummary
          items={items}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          tax={tax}
          total={total}
          coupon={coupon}
        />
      </div>
    </div>
  );
}
