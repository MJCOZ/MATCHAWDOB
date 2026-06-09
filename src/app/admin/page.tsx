import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalOrders, totalRevenue, totalProducts, totalUsers,
    pendingOrders, recentOrders, lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } }, items: { select: { productName: true, quantity: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, nameAr: true, stock: true, slug: true },
    }),
  ]);

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: totalOrders.toLocaleString("ar-SA"),
      icon: ShoppingBag,
      color: "bg-blue-500",
      href: "/admin/orders",
    },
    {
      title: "إجمالي الإيرادات",
      value: formatPrice(Number(totalRevenue._sum.total) || 0),
      icon: TrendingUp,
      color: "bg-green-500",
      href: "/admin/orders",
    },
    {
      title: "المنتجات النشطة",
      value: totalProducts.toLocaleString("ar-SA"),
      icon: Package,
      color: "bg-orange-500",
      href: "/admin/products",
    },
    {
      title: "العملاء",
      value: totalUsers.toLocaleString("ar-SA"),
      icon: Users,
      color: "bg-purple-500",
      href: "/admin/users",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "بانتظار التأكيد",
    CONFIRMED: "تم التأكيد",
    PROCESSING: "جاري التجهيز",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغى",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-0.5">مرحباً بك، هذه نظرة عامة على متجرك</p>
        </div>
        {pendingOrders > 0 && (
          <Link href="/admin/orders?status=PENDING" className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-100 transition-colors">
            <Clock size={16} />
            {pendingOrders} طلبات تنتظر التأكيد
          </Link>
        )}
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color, href }) => (
          <Link key={title} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* آخر الطلبات */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">رقم الطلب</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">العميل</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">المبلغ</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-orange-500 hover:text-orange-600">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.user.name || "—"}</p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(Number(order.total))}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* منتجات مخزونها منخفض */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">تنبيهات المخزون</h2>
            <Link href="/admin/products?lowStock=true" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              عرض الكل
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">المخزون في مستوى جيد</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.nameAr}</p>
                    <p className="text-xs text-red-500 font-medium">{product.stock} قطعة متبقية</p>
                  </div>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <AlertCircle size={18} className="text-red-400" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
