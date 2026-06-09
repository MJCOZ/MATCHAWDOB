import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, translateOrderStatus, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "طلباتي" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/orders");

  const userId = (session.user as any).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { take: 3, select: { productName: true, productImage: true, quantity: true, total: true } },
      shipping: { select: { trackingNumber: true, status: true, carrier: true } },
    },
  });

  return (
    <div className="container-custom py-10 max-w-4xl">
      <h1 className="text-2xl font-black text-gray-900 mb-8">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Package size={60} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات بعد</h2>
          <p className="text-gray-500 mb-6">ابدأ تسوقك الآن واستمتع بأفضل المنتجات</p>
          <Link href="/products" className="btn-primary inline-block">تسوق الآن</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">#{order.orderNumber}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {translateOrderStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-orange-500">{formatPrice(Number(order.total))}</p>
                  {order.shipping?.trackingNumber && (
                    <p className="text-xs text-gray-500 mt-0.5">تتبع: {order.shipping.trackingNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{order.items.map((i) => `${i.productName} ×${i.quantity}`).join("، ")}</span>
                <ChevronLeft size={14} className="text-gray-400 mr-auto" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
