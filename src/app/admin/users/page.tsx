export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, ShoppingBag } from "lucide-react";

interface SearchParams { page?: string; q?: string; role?: string; }

const roleColors: Record<string, string> = {
  CUSTOMER: "bg-gray-100 text-gray-600",
  ADMIN: "bg-blue-100 text-blue-700",
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
};
const roleLabels: Record<string, string> = {
  CUSTOMER: "عميل",
  ADMIN: "مدير",
  SUPER_ADMIN: "مدير عام",
};

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const where: any = {};

  if (searchParams.role) where.role = searchParams.role;
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { email: { contains: searchParams.q, mode: "insensitive" } },
      { phone: { contains: searchParams.q } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-500 text-sm">{total} مستخدم</p>
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "الكل", value: "" },
          { label: "العملاء", value: "CUSTOMER" },
          { label: "المدراء", value: "ADMIN" },
          { label: "مدراء عامون", value: "SUPER_ADMIN" },
        ].map(({ label, value }) => (
          <a
            key={value}
            href={value ? `/admin/users?role=${value}` : "/admin/users"}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              (searchParams.role || "") === value
                ? "bg-[#261B6D] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* بحث */}
      <form className="flex gap-3">
        <input type="text" name="q" defaultValue={searchParams.q} placeholder="البحث بالاسم أو البريد أو الجوال..." className="input-field flex-1 py-2.5" />
        {searchParams.role && <input type="hidden" name="role" value={searchParams.role} />}
        <button type="submit" className="btn-primary px-6 py-2.5">بحث</button>
      </form>

      {/* الجدول */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["المستخدم", "الجوال", "الدور", "الطلبات", "تاريخ التسجيل"].map((h) => (
                  <th key={h} className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#261B6D] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {user.name?.[0] || "؟"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name || "—"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{user.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <ShoppingBag size={14} className="text-gray-400" />
                      {user._count.orders}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-20">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">لا يوجد مستخدمون</p>
            </div>
          )}
        </div>
      </div>

      {Math.ceil(total / limit) > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${p === page ? "bg-[#261B6D] text-white" : "bg-white border border-gray-200 text-gray-700"}`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
