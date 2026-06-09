import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, translateOrderStatus, translatePaymentStatus, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { Package, Truck, CreditCard, User, MapPin } from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { slug: true, mainImage: true } } } },
      payment: true,
      shipping: true,
      address: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-orange-500 mb-1 block">
            ← الطلبات
          </Link>
          <h1 className="text-2xl font-black text-gray-900">طلب #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-left">
          <p className="text-2xl font-black text-orange-500">{formatPrice(Number(order.total))}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المنتجات */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-orange-500" />
              <h2 className="font-bold text-gray-900">المنتجات ({order.items.length})</h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    ) : <div className="absolute inset-0 flex items-center justify-center">📦</div>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(Number(item.price))}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(Number(item.total))}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600"><span>المجموع</span><span>{formatPrice(Number(order.subtotal))}</span></div>
              <div className="flex justify-between text-gray-600"><span>الشحن</span><span>{Number(order.shippingCost) === 0 ? "مجاني" : formatPrice(Number(order.shippingCost))}</span></div>
              <div className="flex justify-between text-gray-600"><span>الضريبة (15%)</span><span>{formatPrice(Number(order.tax))}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>الخصم</span><span>- {formatPrice(Number(order.discount))}</span></div>}
              <div className="flex justify-between font-black text-base pt-1 border-t"><span>الإجمالي</span><span className="text-orange-500">{formatPrice(Number(order.total))}</span></div>
            </div>
          </div>

          {/* تحديث حالة الطلب */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            trackingNumber={order.shipping?.trackingNumber || ""}
            carrier={order.shipping?.carrier || ""}
          />
        </div>

        {/* التفاصيل */}
        <div className="space-y-4">
          {/* العميل */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-orange-500" />
              <h2 className="font-bold text-gray-900 text-sm">العميل</h2>
            </div>
            <p className="text-sm font-semibold text-gray-900">{order.user.name || "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.user.email}</p>
            {order.user.phone && <p className="text-xs text-gray-500">{order.user.phone}</p>}
          </div>

          {/* العنوان */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-orange-500" />
              <h2 className="font-bold text-gray-900 text-sm">عنوان التوصيل</h2>
            </div>
            <p className="text-sm font-semibold text-gray-900">{order.shippingFullName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.shippingDistrict}، {order.shippingCity}</p>
            <p className="text-xs text-gray-500">{order.shippingStreet}</p>
            <p className="text-xs text-gray-500">{order.shippingPhone}</p>
          </div>

          {/* الدفع */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-orange-500" />
              <h2 className="font-bold text-gray-900 text-sm">الدفع</h2>
            </div>
            <p className="text-sm text-gray-600">{order.paymentMethod === "cod" ? "عند الاستلام" : order.paymentMethod || "—"}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
              order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {translatePaymentStatus(order.paymentStatus)}
            </span>
          </div>

          {/* الشحن */}
          {order.shipping && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={16} className="text-orange-500" />
                <h2 className="font-bold text-gray-900 text-sm">الشحن</h2>
              </div>
              <p className="text-sm text-gray-600">{order.shipping.carrier}</p>
              {order.shipping.trackingNumber && (
                <p className="text-xs text-blue-600 font-medium mt-1">تتبع: {order.shipping.trackingNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
