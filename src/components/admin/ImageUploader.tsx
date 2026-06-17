"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, X, Link as LinkIcon, Crop, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { ImageCropModal } from "./ImageCropModal";

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** نسبة المعاينة: square أو wide أو circle */
  shape?: "square" | "wide" | "circle";
  hint?: string;
  /** نسبة العرض إلى الارتفاع لإطار القص (افتراضي 1:1) */
  aspect?: number;
}

export function ImageUploader({ label, value, onChange, shape = "wide", hint, aspect }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const cropAspect = aspect ?? 1;
  const isCircle = shape === "circle";

  useEffect(() => setLoadError(false), [value]);

  const uploadBlob = async (blob: Blob, filename: string) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "فشل الرفع");
      onChange(json.url);
      toast.success("تم رفع الصورة");
    } catch (e: any) {
      toast.error(e?.message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const openFileForCrop = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("حجم الصورة يتجاوز 8 ميجابايت");
      return;
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setCropSrc(url);
  };

  const closeCropper = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setCropSrc(null);
  };

  const handleCropConfirm = (blob: Blob) => {
    closeCropper();
    uploadBlob(blob, `image-${Date.now()}.jpg`);
  };

  const previewClasses =
    shape === "circle"
      ? "w-24 h-24 rounded-full"
      : shape === "square"
      ? "w-24 h-24 rounded-xl"
      : "w-full h-32 rounded-xl";

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      )}

      {/* المعاينة */}
      {value && loadError ? (
        <div className={`${previewClasses} flex flex-col items-center justify-center gap-1 border-2 border-dashed border-red-300 bg-red-50 text-red-400 relative px-2 text-center`}>
          <AlertTriangle size={18} />
          <span className="text-[10px] font-semibold leading-tight">تعذّر تحميل الصورة، أعد رفعها</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            aria-label="حذف الصورة"
          >
            <X size={13} />
          </button>
        </div>
      ) : value ? (
        <div className="relative inline-block group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="معاينة"
            onError={() => setLoadError(true)}
            className={`${previewClasses} object-cover border-2 border-gray-200 bg-gray-50`}
          />
          <button
            type="button"
            onClick={() => setCropSrc(value)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#261B6D] text-white flex items-center justify-center shadow-md hover:bg-[#352a8a] transition-colors"
            aria-label="تحرير/قص الصورة"
          >
            <Crop size={12} />
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            aria-label="حذف الصورة"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${previewClasses} flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#261B6D] hover:text-[#261B6D] transition-colors`}
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-[11px] font-semibold">{uploading ? "جاري الرفع..." : "ارفع صورتك"}</span>
        </button>
      )}

      {/* أزرار التحكم */}
      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261B6D] text-white text-xs font-semibold hover:bg-[#352a8a] transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {value ? "تغيير الصورة" : "رفع من جهازك"}
        </button>
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          <LinkIcon size={12} />
          رابط خارجي
        </button>
      </div>

      {/* حقل الرابط الخارجي */}
      {showUrl && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#261B6D]"
        />
      )}

      {hint && <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) openFileForCrop(f);
          e.target.value = "";
        }}
      />

      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          aspect={cropAspect}
          rounded={isCircle}
          onConfirm={handleCropConfirm}
          onCancel={closeCropper}
        />
      )}
    </div>
  );
}
