export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, translateOrderStatus, translatePaymentStatus, formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, Truck, MapPin, CreditCard, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
  searchParams: { success?: string; payment_failed?: string; error?: string };
}

export const metadata: Metadata = { title: "تفاصيل الطلب" };

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role);

  const order = await prisma.order.findFirst({
    where: { id: params.id, ...(isAdmin ? {} : { userId }) },
    include: {
      items: { include: { product: { select: { slug: true } } } },
      payment: true,
      shipping: true,
      address: true,
    },
  });

  if (!order) notFound();

  const steps = [
    { status: "PENDING", label: "تم الطلب", icon: CheckCircle },
    { status: "CONFIRMED", label: "تم التأكيد", icon: CheckCircle },
    { status: "PROCESSING", label: "جاري التجهيز", icon: Package },
    { status: "SHIPPED", label: "تم الشحن", icon: Truck },
    { status: "DELIVERED", label: "تم التوصيل", icon: CheckCircle },
  ];

  const stepOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = stepOrder.indexOf(order.status);

  return (
    <div className="container-custom py-10 max-w-4xl">
      {/* رسائل الحالة */}
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">تم تأكيد طلبك بنجاح! 🎉</p>
            <p className="text-sm text-green-600">سيتم التواصل معك قريباً لتأكيد الشحن</p>
          </div>
        </div>
      )}
      {searchParams.payment_failed && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-800">فشل الدفع</p>
            <p className="text-sm text-red-600">يمكنك المحاولة مجدداً أو اختيار طريقة دفع أخرى</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">طلب #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-xl ${
          order.status === "DELIVERED" ? "bg-green-100 text-green-700"
          : order.status === "CANCELLED" ? "bg-red-100 text-red-700"
          : "bg-orange-100 text-orange-700"
        }`}>
          {translateOrderStatus(order.status)}
        </span>
      </div>

      {/* متتبع حالة الطلب */}
      {!["CANCELLED", "REFUNDED"].includes(order.status) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-5">تتبع الطلب</h2>
          <div className="flex items-center">
            {steps.map((step, index) => {
              const isCompleted = stepOrder.indexOf(step.status) <= currentStepIndex;
              const isCurrent = step.status === order.status;
              return (
                <div key={step.status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? "bg-green-500 text-white"
                      : isCurrent ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-400"
                    }`}>
                      <step.icon size={18} />
                    </div>
                    <p className={`text-xs mt-1.5 text-center font-medium whitespace-nowrap ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${stepOrder.indexOf(steps[index + 1].status) <= currentStepIndex ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
          {order.shipping?.trackingNumber && (
            <div className="mt-4 bg-blue-50 rounded-xl p-3 flex items-center gap-3">
              <Truck size={18} className="text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-blue-700">{order.shipping.carrier} - رقم التتبع: {order.shipping.trackingNumber}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المنتجات */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">المنتجات المطلوبة</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.product?.slug || ""}`} className="text-sm font-semibold text-gray-900 hover:text-orange-500">
                      {item.productName}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">الكمية: {item.quantity} × {formatPrice(Number(item.price))}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(Number(item.total))}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">ملخص الطلب</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>المجموع الفرعي</span><span>{formatPrice(Number(order.subtotal))}</span></div>
              <div className="flex justify-between text-gray-600"><span>الشحن</span><span>{Number(order.shippingCost) === 0 ? "مجاني" : formatPrice(Number(order.shippingCost))}</span></div>
              <div className="flex justify-between text-gray-600"><span>ضريبة القيمة المضافة</span><span>{formatPrice(Number(order.tax))}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><span>- {formatPrice(Number(order.discount))}</span></div>}
              <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>الإجمالي</span>
                <span className="text-orange-500">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* العنوان */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-orange-500" />
              <h2 className="font-bold text-gray-900 text-sm">عنوان التوصيل</h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingFullName}</p>
              <p>{order.shippingDistrict}، {order.shippingCity}</p>
              <p>{order.shippingStreet}</p>
              <p>{order.shippingPhone}</p>
            </div>
          </div>

          {/* الدفع */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-orange-500" />
              <h2 className="font-bold text-gray-900 text-sm">الدفع</h2>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "دفع إلكتروني"}</p>
              <p className="mt-1">{translatePaymentStatus(order.paymentStatus)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/orders" className="btn-outline py-3 px-6">← طلباتي</Link>
        <Link href="/products" className="btn-primary py-3 px-6">تسوق مجدداً</Link>
      </div>
    </div>
  );
}
