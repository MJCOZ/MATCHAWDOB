"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Truck } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  orderId: string;
  currentStatus: string;
  trackingNumber: string;
  carrier: string;
}

const STATUSES = [
  { value: "PENDING", label: "بانتظار التأكيد" },
  { value: "CONFIRMED", label: "تم التأكيد" },
  { value: "PROCESSING", label: "جاري التجهيز" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التوصيل" },
  { value: "CANCELLED", label: "ملغى" },
  { value: "REFUNDED", label: "مسترد" },
];

export function OrderStatusUpdater({ orderId, currentStatus, trackingNumber: initTracking, carrier: initCarrier }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(initTracking);
  const [carrier, setCarrier] = useState(initCarrier);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber: tracking, carrier }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      toast.success("تم تحديث حالة الطلب");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Truck size={18} className="text-orange-500" />
        <h2 className="font-bold text-gray-900">تحديث حالة الطلب</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">الحالة</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field py-2.5 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">شركة الشحن</label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="input-field py-2.5 text-sm"
          >
            <option value="">اختر</option>
            <option value="aramex">أرامكس</option>
            <option value="smsa">SMSA Express</option>
            <option value="spl">البريد السعودي</option>
            <option value="other">أخرى</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">رقم التتبع</label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="1234567890"
            className="input-field py-2.5 text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        حفظ التغييرات
      </button>
    </div>
  );
}
