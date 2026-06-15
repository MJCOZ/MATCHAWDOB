"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, Settings, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Setting { key: string; value: string; group: string; }

const settingLabels: Record<string, string> = {
  store_name: "اسم المتجر (إنجليزي)",
  store_name_ar: "اسم المتجر (عربي)",
  store_phone: "رقم الهاتف",
  store_email: "البريد الإلكتروني",
  store_address: "العنوان",
  vat_rate: "نسبة ضريبة القيمة المضافة %",
  free_shipping_threshold: "حد الشحن المجاني (ر.س)",
  default_shipping_cost: "تكلفة الشحن الافتراضية (ر.س)",
  currency: "رمز العملة",
  currency_symbol: "علامة العملة",
};

const groupLabels: Record<string, string> = {
  general: "إعدادات عامة",
  pricing: "الأسعار والضرائب",
  shipping: "الشحن",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        const map: Record<string, string> = {};
        data.forEach((s: Setting) => { map[s.key] = s.value; });
        setValues(map);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ الإعدادات");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#261B6D]" />
    </div>
  );

  const groups = Array.from(new Set(settings.map((s) => s.group)));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">إعدادات المتجر</h1>
        <p className="text-gray-500 text-sm">تحكم في إعدادات المتجر الأساسية</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* هوية المتجر — الشعار / البروفايل والنص أسفله */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#261B6D]" />
            هوية المتجر (الشعار والبروفايل)
          </h2>
          <p className="text-xs text-gray-400 -mt-2">
            صورة البروفايل تظهر في الهيدر والفوتر. اتركها فارغة لاستخدام شعار الدب الافتراضي.
          </p>

          <ImageUploader
            label="صورة البروفايل / الشعار"
            value={values.store_logo || ""}
            onChange={(v) => setValues({ ...values, store_logo: v })}
            shape="circle"
            hint="يفضّل صورة مربعة بخلفية شفافة (PNG)، بحجم 200×200 بكسل أو أكبر."
          />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              النص أسفل الشعار (الوصف القصير)
            </label>
            <input
              className="input-field"
              value={values.store_tagline ?? "عالم الماتشا الياباني ✦"}
              onChange={(e) => setValues({ ...values, store_tagline: e.target.value })}
              placeholder="عالم الماتشا الياباني ✦"
            />
          </div>
        </div>

        {groups.map((group) => (
          <div key={group} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Settings size={16} className="text-[#261B6D]" />
              {groupLabels[group] || group}
            </h2>
            {settings.filter((s) => s.group === group).map((s) => (
              <div key={s.key}>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  {settingLabels[s.key] || s.key}
                </label>
                <input
                  className="input-field"
                  value={values[s.key] || ""}
                  onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        ))}

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 w-full justify-center py-3.5">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          حفظ الإعدادات
        </button>
      </form>
    </div>
  );
}
