"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Ticket, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  descriptionAr: string;
  type: string;
  value: number;
  minOrderAmount: number;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  PERCENTAGE: "نسبة مئوية",
  FIXED: "مبلغ ثابت",
  FREE_SHIPPING: "شحن مجاني",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "", descriptionAr: "", type: "PERCENTAGE",
    value: "", minOrderAmount: "0", usageLimit: "", expiresAt: "",
  });

  useEffect(() => { fetchCoupons(); }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
          minOrderAmount: parseFloat(form.minOrderAmount),
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("تم إنشاء الكوبون");
      setShowForm(false);
      setForm({ code: "", descriptionAr: "", type: "PERCENTAGE", value: "", minOrderAmount: "0", usageLimit: "", expiresAt: "" });
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchCoupons();
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`هل تريد حذف كوبون ${code}؟`)) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    toast.success("تم حذف الكوبون");
    fetchCoupons();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#261B6D]" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">كوبونات الخصم</h1>
          <p className="text-gray-500 text-sm">{coupons.length} كوبون</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة كوبون
        </button>
      </div>

      {/* نموذج الإضافة */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">كوبون جديد</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">كود الكوبون *</label>
              <input required className="input-field uppercase" placeholder="MATCHA10" value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">نوع الخصم *</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PERCENTAGE">نسبة مئوية %</option>
                <option value="FIXED">مبلغ ثابت ر.س</option>
                <option value="FREE_SHIPPING">شحن مجاني</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {form.type === "PERCENTAGE" ? "نسبة الخصم %" : form.type === "FIXED" ? "مبلغ الخصم ر.س" : "القيمة (0 للشحن المجاني)"}
              </label>
              <input type="number" min="0" required className="input-field" placeholder="10" value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">الحد الأدنى للطلب</label>
              <input type="number" min="0" className="input-field" placeholder="0" value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">حد الاستخدام (فارغ = غير محدود)</label>
              <input type="number" min="1" className="input-field" placeholder="100" value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">تاريخ الانتهاء (اختياري)</label>
              <input type="date" className="input-field" value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">الوصف *</label>
              <input required className="input-field" placeholder="خصم 10% على جميع المنتجات" value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                حفظ الكوبون
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* جدول الكوبونات */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["الكود", "النوع", "القيمة", "الحد الأدنى", "الاستخدام", "الانتهاء", "الحالة", "إجراء"].map((h) => (
                  <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-3.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3.5">
                    <p className="font-mono font-bold text-[#261B6D]">{c.code}</p>
                    <p className="text-xs text-gray-500">{c.descriptionAr}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{typeLabels[c.type]}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900">
                    {c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FIXED" ? `${c.value} ر.س` : "مجاني"}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.minOrderAmount > 0 ? `${c.minOrderAmount} ر.س` : "—"}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("ar-SA") : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => handleToggle(c.id, c.isActive)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.isActive ? "نشط" : "معطل"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => handleDelete(c.id, c.code)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="text-center py-20">
              <Ticket size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">لا توجد كوبونات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
