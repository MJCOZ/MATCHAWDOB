"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

export function CategoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    nameAr: "", nameEn: "", description: "", isActive: true, sortOrder: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: slugify(form.nameAr) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      toast.success("تم إضافة التصنيف");
      setForm({ nameAr: "", nameEn: "", description: "", isActive: true, sortOrder: 0 });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">اسم التصنيف بالعربية *</label>
        <input type="text" required className="input-field" placeholder="مثال: إلكترونيات" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">اسم التصنيف بالإنجليزية</label>
        <input type="text" className="input-field" placeholder="Electronics" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">الوصف</label>
        <textarea className="input-field resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">ترتيب العرض</label>
          <input type="number" className="input-field" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-orange-500 w-4 h-4" />
          <span className="text-sm text-gray-700">نشط</span>
        </label>
      </div>
      <button type="submit" disabled={isLoading || !form.nameAr} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
        {isLoading ? <><Loader2 size={16} className="animate-spin" />جاري الحفظ...</> : "إضافة التصنيف"}
      </button>
    </form>
  );
}
