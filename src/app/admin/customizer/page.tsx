"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Loader2, Save, ExternalLink, Layout, Palette,
  Store, BarChart3, ChevronDown, ChevronUp, RotateCcw, Check,
  Monitor, Smartphone, Eye, Type
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── أنواع البيانات ─── */
interface Slide {
  title: string; subtitle: string; description: string;
  cta: string; ctaLink: string; badge: string; mascot: string;
  image?: string;
}
interface Stat { num: string; label: string; }
interface CustomizerData {
  slides: [Slide, Slide, Slide];
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  slogan: string;
  stats: [Stat, Stat, Stat];
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  showFeaturesBar: boolean;
  showOffersSection: boolean;
  showNewProducts: boolean;
  featuresBarText: string;
  fontFamily: string;
  fontScale: string;
}

const DEFAULT: CustomizerData = {
  slides: [
    { title: "ماتشا من الفضاء", subtitle: "الطعم الياباني الأصيل", description: "اكتشف مجموعتنا الفريدة من الماتشا الفاخر وأدوات التحضير الأصيلة", cta: "تسوق الآن", ctaLink: "/products", badge: "✦ جديد ومميز", mascot: "wave", image: "" },
    { title: "ماتشا من الفضاء", subtitle: "من اليابان مباشرةً إليك", description: "أفضل أنواع الماتشا من مزارع اليابان الشهيرة — نكهة خاصة لكل رشفة", cta: "اكتشف الآن", ctaLink: "/products?category=matcha-powder", badge: "🍵 ماتشا أصيل", mascot: "alien", image: "" },
    { title: "ماتشا من الفضاء", subtitle: "هدايا كيوت ومميزة", description: "أطقم هدايا فاخرة بتصميم ياباني راقٍ — لكل مناسبة خاصة", cta: "العروض الحصرية", ctaLink: "/products?sale=true", badge: "✦ عروض محدودة", mascot: "surprised", image: "" },
  ],
  primaryColor: "#261B6D",
  secondaryColor: "#B2DE81",
  bgColor: "#F8F7FF",
  slogan: "ماتشا من الفضاء",
  stats: [
    { num: "+500", label: "عميل سعيد" },
    { num: "100%", label: "ماتشا أصيل" },
    { num: "24h",  label: "توصيل سريع" },
  ],
  storeName: "MatchaWdob",
  storePhone: "+966500000000",
  storeEmail: "hello@matchwdob.sa",
  storeAddress: "الرياض، المملكة العربية السعودية",
  showFeaturesBar: true,
  showOffersSection: true,
  showNewProducts: true,
  featuresBarText: "شحن مجاني للطلبات فوق 200 ر.س • ضمان الجودة 100% • توصيل سريع",
  fontFamily: "AraHamahHoms",
  fontScale: "1",
};

type Tab = "banner" | "colors" | "fonts" | "store" | "stats" | "sections";
type ViewMode = "desktop" | "mobile";

const FONT_OPTIONS = [
  { id: "AraHamahHoms", label: "Ara Hamah Homs", labelAr: "آرا حماه حمص", sample: "ماتشا من الفضاء", gfUrl: null },
  { id: "Tajawal",      label: "Tajawal",        labelAr: "تجوال",          sample: "ماتشا من الفضاء", gfUrl: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" },
  { id: "Cairo",        label: "Cairo",          labelAr: "كايرو",          sample: "ماتشا من الفضاء", gfUrl: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" },
  { id: "Almarai",      label: "Almarai",        labelAr: "المرعي",         sample: "ماتشا من الفضاء", gfUrl: "https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap" },
  { id: "Readex Pro",   label: "Readex Pro",     labelAr: "ريدكس برو",      sample: "ماتشا من الفضاء", gfUrl: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;700&display=swap" },
  { id: "IBM Plex Sans Arabic", label: "IBM Plex Sans Arabic", labelAr: "IBM بلكس", sample: "ماتشا من الفضاء", gfUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap" },
];

const SCALE_OPTIONS = [
  { id: "0.875", label: "صغير",     desc: "14px" },
  { id: "1",     label: "عادي",     desc: "16px" },
  { id: "1.125", label: "كبير",     desc: "18px" },
  { id: "1.25",  label: "كبير جداً", desc: "20px" },
];

/* ─── مكون حقل الإدخال ─── */
function Field({ label, value, onChange, placeholder, type = "text", multiline = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      {multiline ? (
        <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#261B6D] resize-none" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#261B6D]" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

/* ─── أكورديون الشريحة ─── */
function SlideAccordion({ index, slide, onChange }: { index: number; slide: Slide; onChange: (s: Slide) => void }) {
  const [open, setOpen] = useState(index === 0);
  const labels = ["الشريحة الأولى", "الشريحة الثانية", "الشريحة الثالثة"];
  const mascots = [
    { value: "wave", label: "الباندا يلوّح" },
    { value: "surprised", label: "الباندا متفاجئ" },
    { value: "alien", label: "الفضائي" },
  ];
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700">
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#261B6D] text-white text-xs flex items-center justify-center">{index + 1}</span>
          {labels[index]}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-white">
          <Field label="العنوان الرئيسي" value={slide.title} onChange={v => onChange({ ...slide, title: v })} placeholder="ماتشا من الفضاء" />
          <Field label="العنوان الفرعي" value={slide.subtitle} onChange={v => onChange({ ...slide, subtitle: v })} placeholder="الطعم الياباني الأصيل" />
          <Field label="الوصف" value={slide.description} onChange={v => onChange({ ...slide, description: v })} multiline placeholder="وصف قصير..." />
          <div className="grid grid-cols-2 gap-3">
            <Field label="نص الزر" value={slide.cta} onChange={v => onChange({ ...slide, cta: v })} placeholder="تسوق الآن" />
            <Field label="رابط الزر" value={slide.ctaLink} onChange={v => onChange({ ...slide, ctaLink: v })} placeholder="/products" />
          </div>
          <Field label="شارة (badge)" value={slide.badge} onChange={v => onChange({ ...slide, badge: v })} placeholder="✦ جديد ومميز" />
          <Field label="رابط صورة البنر (اختياري)" value={slide.image || ""} onChange={v => onChange({ ...slide, image: v })} placeholder="https://example.com/image.png" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">الشخصية</label>
            <div className="flex gap-2">
              {mascots.map(m => (
                <button key={m.value} onClick={() => onChange({ ...slide, mascot: m.value })}
                  className={`flex-1 py-2 px-3 text-xs rounded-xl border-2 transition-all ${slide.mascot === m.value ? "border-[#261B6D] bg-[#261B6D] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── معاينة البنر المصغرة ─── */
function BannerPreview({ data }: { data: CustomizerData }) {
  const slide = data.slides[0];
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: data.primaryColor, padding: "24px", direction: "rtl", minHeight: "180px", position: "relative" }}>
      {/* نجوم */}
      {[{x:8,y:15,s:14},{x:85,y:10,s:18},{x:92,y:70,s:12},{x:5,y:70,s:10}].map((star, i) => (
        <div key={i} style={{ position:"absolute", left:`${star.x}%`, top:`${star.y}%`, opacity:0.6 }}>
          <svg width={star.s} height={star.s} viewBox="0 0 24 24" fill={data.secondaryColor}>
            <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
          </svg>
        </div>
      ))}
      <div style={{ maxWidth:"60%" }}>
        <span style={{ display:"inline-block", backgroundColor:`${data.secondaryColor}30`, color:data.secondaryColor, fontSize:"10px", fontWeight:"bold", padding:"3px 10px", borderRadius:"20px", marginBottom:"8px", border:`1px solid ${data.secondaryColor}40` }}>
          {slide.badge}
        </span>
        <div style={{ color:"white", fontSize:"18px", fontWeight:"bold", lineHeight:1.3, marginBottom:"4px" }}>{slide.title}</div>
        <div style={{ color:data.secondaryColor, fontSize:"12px", fontWeight:"600", marginBottom:"6px" }}>{slide.subtitle}</div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"10px", marginBottom:"12px", lineHeight:1.5 }}>{slide.description}</div>
        <div style={{ display:"flex", gap:"8px" }}>
          <span style={{ backgroundColor:data.secondaryColor, color:data.primaryColor, padding:"6px 14px", borderRadius:"12px", fontSize:"11px", fontWeight:"bold" }}>{slide.cta}</span>
          <span style={{ border:`1.5px solid ${data.secondaryColor}60`, color:"white", padding:"6px 14px", borderRadius:"12px", fontSize:"11px" }}>استكشف</span>
        </div>
      </div>
    </div>
  );
}

/* ─── الصفحة الرئيسية ─── */
export default function CustomizerPage() {
  const [data, setData] = useState<CustomizerData>(DEFAULT);
  const [activeTab, setActiveTab] = useState<Tab>("banner");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/api/admin/customizer")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData({ ...DEFAULT, ...d }); })
      .finally(() => setLoading(false));
  }, []);

  // تحميل خطوط Google للمعاينة داخل الكاستمايزر
  useEffect(() => {
    FONT_OPTIONS.forEach(f => {
      if (!f.gfUrl) return;
      if (document.querySelector(`link[href="${f.gfUrl}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = f.gfUrl;
      document.head.appendChild(link);
    });
  }, []);

  const updateSlide = useCallback((index: number, slide: Slide) => {
    setData(prev => {
      const slides = [...prev.slides] as [Slide, Slide, Slide];
      slides[index] = slide;
      return { ...prev, slides };
    });
  }, []);

  const updateStat = useCallback((index: number, stat: Stat) => {
    setData(prev => {
      const stats = [...prev.stats] as [Stat, Stat, Stat];
      stats[index] = stat;
      return { ...prev, stats };
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/customizer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ التغييرات");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // refresh iframe
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } catch {
      toast.error("حدث خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("هل تريد إعادة ضبط جميع الإعدادات للقيم الافتراضية؟")) {
      setData(DEFAULT);
      toast("تم إعادة الضبط — اضغط حفظ لتطبيق التغييرات", { icon: "↩️" });
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "banner",   label: "البنر",       icon: Layout },
    { id: "colors",   label: "الألوان",     icon: Palette },
    { id: "fonts",    label: "الخطوط",     icon: Type },
    { id: "store",    label: "المتجر",      icon: Store },
    { id: "stats",    label: "الإحصائيات", icon: BarChart3 },
    { id: "sections", label: "الأقسام",    icon: Eye },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 size={36} className="animate-spin text-[#261B6D]" />
    </div>
  );

  return (
    <div className="flex flex-col h-full -m-6" dir="rtl">

      {/* شريط علوي */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#261B6D] flex items-center justify-center">
            <Palette size={16} className="text-[#B2DE81]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900">مخصص تصميم المتجر</h1>
            <p className="text-xs text-gray-400">التغييرات تظهر فوراً بعد الحفظ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-medium transition-colors">
            <RotateCcw size={13} /> إعادة ضبط
          </button>
          <a href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition-colors">
            <ExternalLink size={13} /> عرض المتجر
          </a>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-70"
            style={{ backgroundColor: saved ? "#B2DE81" : "#261B6D", color: saved ? "#261B6D" : "white" }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
            {saving ? "جاري الحفظ..." : saved ? "تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── اللوحة اليسرى - التحرير ─── */}
        <div className="w-[380px] flex-shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-hidden">

          {/* تبويبات - شبكة 3×2 */}
          <div className="grid grid-cols-3 flex-shrink-0 border-b border-gray-100">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all relative ${
                  activeTab === tab.id
                    ? "text-[#261B6D] bg-[#261B6D]/5"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#261B6D] rounded-full" />
                )}
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* محتوى التبويب */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* ─── البنر ─── */}
            {activeTab === "banner" && (
              <>
                <p className="text-xs text-gray-400">عدّل السلوقن وشرائح البنر الرئيسي</p>

                {/* سلوقن البراند - ظاهر في الهيدر */}
                <div className="p-3 rounded-2xl border-2 border-[#261B6D]/20 bg-[#261B6D]/5">
                  <Field label="✦ سلوقن البراند" value={data.slogan} onChange={v => setData({ ...data, slogan: v })} placeholder="ماتشا من الفضاء" />
                </div>

                {data.slides.map((slide, i) => (
                  <SlideAccordion key={i} index={i} slide={slide} onChange={s => updateSlide(i, s)} />
                ))}
              </>
            )}

            {/* ─── الألوان ─── */}
            {activeTab === "colors" && (
              <>
                <p className="text-xs text-gray-400">اختر ألوان البراند الرئيسية للمتجر</p>

                {/* معاينة الألوان */}
                <BannerPreview data={data} />

                <div className="space-y-4 pt-2">
                  {/* اللون الكحلي */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-gray-800">اللون الرئيسي</p>
                      <p className="text-xs text-gray-500 mt-0.5">الهيدر، الأزرار، البنر</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500">{data.primaryColor}</span>
                      <label className="relative cursor-pointer">
                        <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ backgroundColor: data.primaryColor }} />
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value={data.primaryColor}
                          onChange={e => setData({ ...data, primaryColor: e.target.value })} />
                      </label>
                    </div>
                  </div>

                  {/* اللون الأخضر */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-gray-800">اللون الثانوي</p>
                      <p className="text-xs text-gray-500 mt-0.5">الأزرار الثانوية، الأيقونات، الزينة</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500">{data.secondaryColor}</span>
                      <label className="relative cursor-pointer">
                        <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ backgroundColor: data.secondaryColor }} />
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value={data.secondaryColor}
                          onChange={e => setData({ ...data, secondaryColor: e.target.value })} />
                      </label>
                    </div>
                  </div>

                  {/* لون الخلفية */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-gray-800">خلفية الموقع</p>
                      <p className="text-xs text-gray-500 mt-0.5">لون الصفحات الرئيسية</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500">{data.bgColor}</span>
                      <label className="relative cursor-pointer">
                        <div className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-md" style={{ backgroundColor: data.bgColor }} />
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value={data.bgColor}
                          onChange={e => setData({ ...data, bgColor: e.target.value })} />
                      </label>
                    </div>
                  </div>

                  {/* ألوان جاهزة */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">ثيمات جاهزة</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "ماتشا الفضاء", primary: "#261B6D", secondary: "#B2DE81", bg: "#F8F7FF" },
                        { name: "الليل الساكن", primary: "#0f172a", secondary: "#38bdf8", bg: "#f0f9ff" },
                        { name: "الوردي الناعم", primary: "#831843", secondary: "#f9a8d4", bg: "#fff0f6" },
                        { name: "البرتقالي الدافئ", primary: "#7c2d12", secondary: "#fb923c", bg: "#fff7ed" },
                      ].map(theme => (
                        <button key={theme.name} onClick={() => setData({ ...data, primaryColor: theme.primary, secondaryColor: theme.secondary, bgColor: theme.bg })}
                          className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-right">
                          <div className="flex gap-1 flex-shrink-0">
                            <div className="w-5 h-5 rounded-md" style={{ backgroundColor: theme.primary }} />
                            <div className="w-5 h-5 rounded-md" style={{ backgroundColor: theme.secondary }} />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ─── الخطوط ─── */}
            {activeTab === "fonts" && (
              <>
                <p className="text-xs text-gray-400">اختر خط الموقع وحجم النص الأساسي</p>

                {/* اختيار الخط */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">نوع الخط</p>
                  <div className="space-y-2">
                    {FONT_OPTIONS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => setData({ ...data, fontFamily: font.id })}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-right ${
                          data.fontFamily === font.id
                            ? "border-[#261B6D] bg-[#261B6D]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-gray-600">{font.labelAr}</span>
                          <span className="text-xs text-gray-400">{font.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            style={{ fontFamily: `'${font.id}', sans-serif`, fontSize: "15px" }}
                            className="text-gray-800"
                          >
                            {font.sample}
                          </span>
                          {data.fontFamily === font.id && (
                            <div className="w-5 h-5 rounded-full bg-[#261B6D] flex items-center justify-center flex-shrink-0">
                              <Check size={11} className="text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* حجم الخط */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">حجم النص</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SCALE_OPTIONS.map(scale => (
                      <button
                        key={scale.id}
                        onClick={() => setData({ ...data, fontScale: scale.id })}
                        className={`flex flex-col items-center gap-1 py-4 px-3 rounded-2xl border-2 transition-all ${
                          data.fontScale === scale.id
                            ? "border-[#261B6D] bg-[#261B6D]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span
                          style={{
                            fontFamily: `'${data.fontFamily}', sans-serif`,
                            fontSize: `calc(${scale.id}rem * 1.1)`,
                            fontWeight: 700,
                            color: data.fontScale === scale.id ? "#261B6D" : "#374151",
                          }}
                        >
                          أ
                        </span>
                        <span className="text-xs font-semibold text-gray-700">{scale.label}</span>
                        <span className="text-[10px] text-gray-400">{scale.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* معاينة الخط */}
                <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-xs text-gray-400 mb-3 font-semibold">معاينة</p>
                  <div style={{ fontFamily: `'${data.fontFamily}', sans-serif` }}>
                    <p style={{ fontSize: `calc(${data.fontScale}rem * 1.5)`, fontWeight: 700, color: data.primaryColor, marginBottom: "4px" }}>
                      ماتشا من الفضاء ✦
                    </p>
                    <p style={{ fontSize: `calc(${data.fontScale}rem * 1.1)`, color: data.secondaryColor, marginBottom: "8px" }}>
                      الطعم الياباني الأصيل
                    </p>
                    <p style={{ fontSize: `${data.fontScale}rem`, color: "#6b7280", lineHeight: 1.6 }}>
                      اكتشف مجموعتنا الفريدة من الماتشا الفاخر وأدوات التحضير الأصيلة. نكهة خاصة لكل رشفة.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ─── المتجر ─── */}
            {activeTab === "store" && (
              <>
                <p className="text-xs text-gray-400">معلومات المتجر الأساسية</p>
                <div className="space-y-3">
                  <Field label="اسم المتجر" value={data.storeName} onChange={v => setData({ ...data, storeName: v })} placeholder="MatchaWdob" />
                  <Field label="سلوقن البراند" value={data.slogan} onChange={v => setData({ ...data, slogan: v })} placeholder="ماتشا من الفضاء" />
                  <Field label="رقم الهاتف" value={data.storePhone} onChange={v => setData({ ...data, storePhone: v })} placeholder="+966500000000" />
                  <Field label="البريد الإلكتروني" value={data.storeEmail} onChange={v => setData({ ...data, storeEmail: v })} type="email" placeholder="hello@matchwdob.sa" />
                  <Field label="العنوان" value={data.storeAddress} onChange={v => setData({ ...data, storeAddress: v })} placeholder="الرياض، المملكة العربية السعودية" />
                  <Field label="نص شريط المميزات" value={data.featuresBarText} onChange={v => setData({ ...data, featuresBarText: v })} multiline placeholder="شحن مجاني • ضمان الجودة • توصيل سريع" />
                </div>
              </>
            )}

            {/* ─── الإحصائيات ─── */}
            {activeTab === "stats" && (
              <>
                <p className="text-xs text-gray-400">الأرقام التي تظهر في البنر الرئيسي</p>
                <div className="space-y-3">
                  {data.stats.map((stat, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-2">
                      <p className="text-xs font-bold text-gray-600">الإحصائية {i + 1}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="الرقم" value={stat.num} onChange={v => updateStat(i, { ...stat, num: v })} placeholder="+500" />
                        <Field label="التسمية" value={stat.label} onChange={v => updateStat(i, { ...stat, label: v })} placeholder="عميل سعيد" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* معاينة الإحصائيات */}
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: data.primaryColor, padding: "16px" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: `${data.secondaryColor}99` }}>معاينة الإحصائيات</p>
                  <div className="flex justify-around">
                    {data.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="font-bold text-base" style={{ color: data.secondaryColor }}>{stat.num}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── الأقسام ─── */}
            {activeTab === "sections" && (
              <>
                <p className="text-xs text-gray-400">تحكم في إظهار أو إخفاء أقسام الصفحة الرئيسية</p>
                <div className="space-y-3">
                  {[
                    { key: "showFeaturesBar",    label: "شريط المميزات",     desc: "الشريط العلوي مع مميزات المتجر" },
                    { key: "showOffersSection",  label: "قسم العروض",        desc: "منتجات الخصومات والعروض" },
                    { key: "showNewProducts",    label: "المنتجات الجديدة", desc: "أحدث المنتجات المضافة" },
                  ].map(section => (
                    <div key={section.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{section.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{section.desc}</p>
                      </div>
                      <button
                        onClick={() => setData({ ...data, [section.key]: !(data as any)[section.key] })}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${(data as any)[section.key] ? "bg-[#B2DE81]" : "bg-gray-300"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${(data as any)[section.key] ? "right-0.5" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── اللوحة اليمنى - المعاينة ─── */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">

          {/* شريط المعاينة */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">معاينة مباشرة</span>
              <span className="text-xs text-gray-400">— يتحدث بعد الحفظ</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "desktop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <Monitor size={13} /> سطح المكتب
              </button>
              <button onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <Smartphone size={13} /> جوال
              </button>
            </div>
          </div>

          {/* الـ iframe */}
          <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
            <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${viewMode === "mobile" ? "w-[390px]" : "w-full"}`}
              style={{ height: viewMode === "mobile" ? "780px" : "calc(100vh - 160px)" }}>
              <iframe
                ref={iframeRef}
                src="/"
                className="w-full h-full border-0"
                title="معاينة المتجر"
                style={viewMode === "mobile" ? { transform: "scale(0.9)", transformOrigin: "top center", width: "111%", height: "111%" } : {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
