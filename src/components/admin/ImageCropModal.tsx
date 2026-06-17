"use client";
import { useCallback, useRef, useState } from "react";
import { X, ZoomIn, Check, Loader2 } from "lucide-react";

interface ImageCropModalProps {
  src: string;
  /** نسبة العرض إلى الارتفاع لإطار القص */
  aspect?: number;
  /** إطار دائري (لصور البروفايل) */
  rounded?: boolean;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

const VIEW_BASE = 320;
const MAX_OUTPUT = 800;

export function ImageCropModal({ src, aspect = 1, rounded = false, onConfirm, onCancel }: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; left: number; top: number } | null>(null);

  const viewW = aspect >= 1 ? VIEW_BASE : Math.round(VIEW_BASE * aspect);
  const viewH = aspect >= 1 ? Math.round(VIEW_BASE / aspect) : VIEW_BASE;
  const scale = baseScale * zoom;

  const clamp = useCallback((left: number, top: number, s: number) => {
    const w = natural.w * s;
    const h = natural.h * s;
    const minLeft = Math.min(0, viewW - w);
    const minTop = Math.min(0, viewH - h);
    return {
      left: Math.min(0, Math.max(minLeft, left)),
      top: Math.min(0, Math.max(minTop, top)),
    };
  }, [natural, viewW, viewH]);

  const handleImgLoad = () => {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth, h = el.naturalHeight;
    const s = Math.max(viewW / w, viewH / h);
    setNatural({ w, h });
    setBaseScale(s);
    setPos({ left: (viewW - w * s) / 2, top: (viewH - h * s) / 2 });
    setZoom(1);
    setReady(true);
  };

  const onZoomChange = (z: number) => {
    const oldScale = baseScale * zoom;
    const centerX = (viewW / 2 - pos.left) / oldScale;
    const centerY = (viewH / 2 - pos.top) / oldScale;
    const newScale = baseScale * z;
    setZoom(z);
    setPos(clamp(viewW / 2 - centerX * newScale, viewH / 2 - centerY * newScale, newScale));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, left: pos.left, top: pos.top };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos(clamp(dragRef.current.left + dx, dragRef.current.top + dy, scale));
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const handleConfirm = async () => {
    if (!imgRef.current || !ready) return;
    setBusy(true);
    try {
      const outW = aspect >= 1 ? MAX_OUTPUT : Math.round(MAX_OUTPUT * aspect);
      const outH = aspect >= 1 ? Math.round(MAX_OUTPUT / aspect) : MAX_OUTPUT;
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      const sx = -pos.left / scale;
      const sy = -pos.top / scale;
      const sw = viewW / scale;
      const sh = viewH / scale;
      ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92));
      if (!blob) throw new Error("blob");
      onConfirm(blob);
    } catch {
      alert("تعذّر قص هذه الصورة (قد تكون محمية بسياسة CORS). جرّب رفعها من جهازك مباشرةً.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900">قص الصورة وتحديد الحجم</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div
          className={`relative overflow-hidden bg-gray-100 mx-auto touch-none select-none ${rounded ? "rounded-full" : "rounded-xl"}`}
          style={{ width: viewW, height: viewH, cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            onLoad={handleImgLoad}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              width: natural.w * scale,
              height: natural.h * scale,
              maxWidth: "none",
              pointerEvents: "none",
            }}
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <ZoomIn size={14} className="text-gray-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            disabled={!ready}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={!ready || busy}
            className="flex-1 py-2.5 rounded-xl bg-[#261B6D] text-white text-sm font-bold hover:bg-[#352a8a] disabled:opacity-60 flex items-center justify-center gap-1.5 transition-colors"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            اعتماد القص
          </button>
        </div>
      </div>
    </div>
  );
}
