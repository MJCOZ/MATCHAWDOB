"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(passwordChecks).every(Boolean)) {
      toast.error("كلمة المرور لا تستوفي المتطلبات");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // تسجيل الدخول تلقائياً بعد إنشاء الحساب
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("تم إنشاء حسابك بنجاح! 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-2xl">م</span>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl text-white">متجر الخير</p>
              <p className="text-sm text-orange-400">تسوق بثقة</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">إنشاء حساب جديد</h1>
          <p className="text-gray-500 text-sm mb-6">أنشئ حسابك وابدأ التسوق الآن</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">الاسم الكامل *</label>
              <input type="text" required className="input-field" placeholder="محمد عبدالله" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">البريد الإلكتروني *</label>
              <input type="email" required className="input-field" placeholder="example@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">رقم الجوال (اختياري)</label>
              <input type="tel" className="input-field" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">كلمة المرور *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required className="input-field pl-12" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {[
                    { check: passwordChecks.length, label: "8 أحرف على الأقل" },
                    { check: passwordChecks.upper, label: "حرف كبير واحد" },
                    { check: passwordChecks.number, label: "رقم واحد" },
                  ].map(({ check, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <CheckCircle size={14} className={check ? "text-green-500" : "text-gray-300"} />
                      <span className={`text-xs ${check ? "text-green-600" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70">
              {isLoading ? <><Loader2 size={18} className="animate-spin" />جاري الإنشاء...</> : "إنشاء الحساب"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">تسجيل الدخول</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">← العودة للمتجر</Link>
        </p>
      </div>
    </div>
  );
}
