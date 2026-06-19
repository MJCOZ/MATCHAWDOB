"use client";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setStatus("error"); return; }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="py-10 md:py-16 relative overflow-hidden"
      style={{ background: "#1a1250", borderTop: "3px solid #1a1a1a" }}>

      {/* زخارف خلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#261B6D]/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#B2DE81]/5 blur-3xl" />
        {["✦", "抹茶", "✦", "お茶", "✦"].map((k, i) => (
          <span key={i} className="absolute text-lg font-black opacity-5 text-[#B2DE81]"
            style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%`, fontFamily: "serif", transform: `rotate(${i * 12}deg)` }}>
            {k}
          </span>
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">

          {/* الأيقونة */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6"
            style={{ background: "#B2DE81", border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", borderRadius: "4px" }}>
            <Mail size={28} className="text-[#261B6D]" />
          </div>

          {/* العنوان */}
          <span className="section-tag mb-4 inline-flex mx-auto">
            <span className="font-en">✦ NEWSLETTER</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-3 mb-3">
            اشترك في النشرة البريدية
          </h2>
          <p className="text-[#B2DE81]/70 text-sm mb-8 leading-relaxed">
            احصل على أحدث العروض وعروض الإطلاق الحصرية مباشرةً في بريدك. بدون سبام، وعد!
          </p>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني..."
              className="flex-1 px-4 py-3 text-sm font-medium focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(178,222,129,0.4)",
                borderRadius: "4px",
                color: "white",
              }}
            />
            <button type="submit"
              className="flex items-center justify-center gap-2 font-black text-[#261B6D] text-sm px-6 py-3 flex-shrink-0 transition-all active:translate-y-0.5"
              style={{ background: "#B2DE81", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a", borderRadius: "4px" }}>
              <Sparkles size={16} />
              اشترك الآن
            </button>
          </form>

          {/* حالة النجاح/الخطأ */}
          {status === "success" && (
            <p className="mt-4 text-sm font-black text-[#B2DE81] animate-slide-in">
              ✓ تم التسجيل بنجاح! سنرسل لك أفضل العروض قريباً 🍵
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm font-black text-red-400">
              يرجى إدخال بريد إلكتروني صحيح
            </p>
          )}

          {/* ميزات الاشتراك */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {["عروض حصرية", "وصول مبكر", "محتوى مجاني"].map((item, i) => (
              <div key={item} className={`flex items-center gap-1.5 text-xs text-[#B2DE81]/60 ${i > 0 ? "pr-6 border-r border-[#B2DE81]/10" : ""}`}>
                <span className="text-[#B2DE81]">✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
