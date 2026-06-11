export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { formatPrice, translateOrderStatus, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Package } from "lucide-react";

interface SearchParams {
  page?: string;
  status?: string;
  q?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-600 border-gray-200",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const where: any = {};

  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { orderNumber: { contains: searchParams.q } },
      { user: { name: { contains: searchParams.q, mode: "insensitive" } } },
      { user: { email: { contains: searchParams.q, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { productName: true, quantity: true }, take: 2 },
        shipping: { select: { trackingNumber: true, carrier: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const allStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500 text-sm">{total} طلب</p>
        </div>
      </div>

      {/* فلاتر الحالة */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${!searchParams.status ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
          الكل
        </Link>
        {allStatuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${searchParams.status === s ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {translateOrderStatus(s)}
          </Link>
        ))}
      </div>

      {/* البحث */}
      <form className="flex gap-3">
        <input type="text" name="q" defaultValue={searchParams.q} placeholder="البحث برقم الطلب أو اسم العميل..." className="input-field flex-1 py-2.5" />
        {searchParams.status && <input type="hidden" name="status" value={searchParams.status} />}
        <button type="submit" className="btn-primary px-6 py-2.5">بحث</button>
      </form>

      {/* الجدول */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["رقم الطلب", "العميل", "المنتجات", "المبلغ", "الشحن", "الحالة", "التاريخ", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-3.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-orange-500 hover:text-orange-600">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{order.user.name || "—"}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-700">
                      {order.items.slice(0, 2).map((i) => `${i.productName} ×${i.quantity}`).join("، ")}
                      {order.items.length > 2 && ` +${order.items.length - 2}`}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(Number(order.total))}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod === "cod" ? "عند الاستلام" : "إلكتروني"}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {order.shipping?.trackingNumber ? (
                      <div>
                        <p className="text-xs font-medium text-blue-600">{order.shipping.carrier}</p>
                        <p className="text-xs text-gray-500">{order.shipping.trackingNumber}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {translateOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600 whitespace-nowrap">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-20">
              <Package size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد طلبات</p>
            </div>
          )}
        </div>
      </div>

      {/* الصفحات */}
      {Math.ceil(total / limit) > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${p === page ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"}`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
