"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { BrandLogo } from "@/components/brand/BrandLogo";

function LoginForm() {
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

      toast.success("أهلاً بك في MatchaWdob ✦");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#261B6D] flex items-center justify-center p-4 relative overflow-hidden">
      {/* نجوم خلفية */}
      <div className="absolute inset-0 stars-pattern opacity-20" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B2DE81]/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#B2DE81]/5 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* الشعار */}
        <div className="flex justify-center mb-8">
          <BrandLogo size="lg" variant="light" />
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-[#261B6D] mb-1">تسجيل الدخول</h1>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#261B6D]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-[#261B6D]/60 hover:text-[#261B6D]">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" />جاري التحقق...</> : "تسجيل الدخول ✦"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-[#261B6D] hover:text-[#352a8a] font-bold">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#B2DE81]/60 mt-6">
          <Link href="/" className="hover:text-[#B2DE81] transition-colors">
            ← العودة للمتجر
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#261B6D] flex items-center justify-center">
        <div className="text-[#B2DE81] text-lg">جاري التحميل...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
