"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح!");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* الشعار */}
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

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mb-6">أدخل بيانات حسابك للمتابعة</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" />جاري التحقق...</> : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            ← العودة للمتجر
          </Link>
        </p>
      </div>
    </div>
  );
}
